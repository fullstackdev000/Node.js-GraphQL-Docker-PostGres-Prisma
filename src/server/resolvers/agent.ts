import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { createRandomPassword, hashPassword } from '#veewme/helpers/password'
import { saveFileToStorage, unlink } from '#veewme/lib/storage'
import { Context } from '#veewme/lib/types'
import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { GraphQLResolveInfo } from 'graphql'
import { sendWelcomeUserEmail } from '../email'
import { ResolversRequired } from '../graphqlServer'
import { createCustomer } from '../payments/stripe'
import { normalizeSearch } from '../search'
import { resolvePaymentMethods } from './payments/payments'
import { buildRemotePathForAgent, getObjectOrError, updateSavedFile } from './utils'

export const getAgentSearchDocument = (data: GraphqlTypes.AgentCreateInput | GraphqlTypes.AgentUpdateInput) => {
  let values: string[] = []
  if (data && data.user) {
    values = [
      data.user.firstName || '',
      data.user.lastName || '',
      data.user.firstName || ''
    ]
  }
  return normalizeSearch(values.join(' '))
}

export const Agent: ResolversRequired['Agent'] = {
  affiliate: parent => prisma.agent({ id: parent.id }).affiliate(),
  brokerage: parent => prisma.agent({ id: parent.id }).brokerage(),
  coverPhoto: parent => prisma.agent({ id: parent.id }).coverPhoto(),
  defaultColorScheme: parent => prisma.agent({ id: parent.id }).defaultColorScheme(),
  orders: parent => prisma.agent({ id: parent.id }).orders(),
  paymentMethods: parent => resolvePaymentMethods(parent),
  profilePicture: parent => prisma.agent({ id: parent.id }).profilePicture(),
  region: parent => prisma.agent({ id: parent.id }).region(),
  user: parent => prisma.agent({ id: parent.id }).user()
}

export const createAgent: ResolversRequired['Mutation']['createAgent'] = async (_, { data }, context) => {
  const { affiliateId, brokerageId, coverPhoto, profilePicture, regionId, socialMedia, ...agentInput } = data
  let affId = affiliateId
  if (context.role === 'AFFILIATE') {
    affId = context.accountId
  }
  if (!affId) {
    throw new Error('You need to provide data for connecting with Affiliate')
  }

  const brokerages =
    (await PrismaTypes.prisma.brokerages({
      where: { id: brokerageId, owner: { id: affId } }
    })) || []
  const brokerageData = brokerages[0]
  if (!brokerageData) {
    throw new Error('Could not find Brokerage for given id and connected to given Affiliate.')
  }

  let plainPassword = agentInput.user.password
  let notifyTempPassword = false
  if (!plainPassword) {
    plainPassword = createRandomPassword()
    notifyTempPassword = true
  }
  const hashedPassword = hashPassword(plainPassword)

  let savedAgent = await prisma.createAgent({
    ...agentInput,
    ...socialMedia,
    affiliate: { connect: { id: affId } },
    brokerage: { connect: { id: brokerageData.id } },
    companyPay: brokerageData.companyPay,
    defaultColorScheme: {
      create: agentInput.defaultColorScheme ? agentInput.defaultColorScheme : { a: 1, b: 62, g: 204, r: 159 }
    },
    orders: { create: [] },
    region: { connect: { id: regionId } },
    searchDocument: getAgentSearchDocument(data),
    user: {
      create: {
        ...agentInput.user,
        password: hashedPassword,
        role: 'AGENT'
      }
    }
  })

  if (notifyTempPassword) {
    sendWelcomeUserEmail(agentInput.user.email, `${agentInput.user.firstName}`, plainPassword).catch(reason => {
      console.error('Failed to send the agent welcome email: ', reason)  // tslint:disable-line
    })
  }

  // Save profile picture
  if (profilePicture && profilePicture.file) {
    const remotePath = await buildRemotePathForAgent(savedAgent)
    const storedProfilePicture = await saveFileToStorage({ fileUpload: profilePicture.file, remotePath })
    savedAgent = await prisma.updateAgent({
      data: { profilePicture: { create: storedProfilePicture } },
      where: { id: savedAgent.id }
    })
  }

  // Save cover photo
  if (coverPhoto && coverPhoto.file) {
    const remotePath = await buildRemotePathForAgent(savedAgent)
    const storedCoverPhoto = await saveFileToStorage({ fileUpload: coverPhoto.file, remotePath })
    savedAgent = await prisma.updateAgent({
      data: { coverPhoto: { create: storedCoverPhoto } },
      where: { id: savedAgent.id }
    })
  }

  // Create Stripe customer and save its ID in the agent instance.
  const name = `${data.user.firstName} ${data.user.lastName}`
  const stripeCustomer = await createCustomer(data.user.email, 'AGENT', name)
  savedAgent = await prisma.updateAgent({
    data: { stripeCustomerId: stripeCustomer.id },
    where: { id: savedAgent.id }
  })

  return savedAgent
}

export const deleteAgent: ResolversRequired['Mutation']['deleteAgent'] = async (_, args, context, info) => {
  const where: GraphqlTypes.AgentWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.affiliate = { id: context.accountId }
  }
  const agentObj = await getObjectOrError<GraphqlTypes.Agent>(context.prismaBinding.query.agents({ where }, info))
  const profilePicFileObj = await prisma.agent({ id: args.where.id }).profilePicture()
  if (profilePicFileObj) {
    unlink(profilePicFileObj.path)
  }
  const coverPhotoFileObj = await prisma.agent({ id: args.where.id }).coverPhoto()
  if (coverPhotoFileObj) {
    unlink(coverPhotoFileObj.path)
  }
  return prisma.deleteAgent({ id: agentObj.id })
}

export const updateAgent: ResolversRequired['Mutation']['updateAgent'] = async (_, args, context) => {
  const {
    data: { affiliateId, brokerageId, regionId, socialMedia, ...data }
  } = args

  const where: GraphqlTypes.AgentWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.affiliate = { id: context.accountId }
  }

  const query = `{
    id
    connectedAffiliate: affiliate { id }
    connectedBrokerage: brokerage { id }
    connectedCoverPhoto: coverPhoto { path }
    connectedProfilePicture: profilePicture { path }
  }`

  const agentObj = await getObjectOrError<PrismaTypes.Agent>(context.prismaBinding.query.agents({ where }, query))

  type AliasedAgent = Omit<GraphqlTypes.Agent, 'affiliate' | 'brokerage' | 'coverPhoto' | 'profilePicture'> & {
    connectedAffiliate: GraphqlTypes.Affiliate
    connectedBrokerage: GraphqlTypes.Brokerage
    connectedCoverPhoto: GraphqlTypes.File
    connectedProfilePicture: GraphqlTypes.File
  }

  const {
    connectedAffiliate,
    connectedBrokerage,
    connectedCoverPhoto,
    connectedProfilePicture
  } = (agentObj as unknown) as AliasedAgent

  // Once affiliate is set, it cannot be changed. Changing it could give an agent access
  // to other affiliate's data.
  if (affiliateId && affiliateId !== connectedAffiliate.id) {
    throw new UserInputError('Cannot change affiliate ID', { invalidArgs: ['affiliateId'] })
  }

  // TODO make accessing companyPay for Agent from resolver only
  const { brokerage, companyPay } = await setBrokerageRelatedData(connectedBrokerage, brokerageId)
  const password = data.user && data.user.password && hashPassword(data.user.password)

  const remotePath = await buildRemotePathForAgent(agentObj)
  const profilePicture = await updateSavedFile(remotePath, connectedProfilePicture, data.profilePicture)
  const coverPhoto = await updateSavedFile(remotePath, connectedCoverPhoto, data.coverPhoto)

  return prisma.updateAgent({
    data: {
      ...data,
      ...socialMedia,
      brokerage,
      companyPay,
      coverPhoto,
      defaultColorScheme: { update: data.defaultColorScheme },
      profilePicture,
      region: regionId ? { connect: { id: regionId } } : undefined,
      searchDocument: getAgentSearchDocument(data),
      user: {
        update: {
          ...data.user,
          password
        }
      }
    },
    where: { id: agentObj.id }
  })
}

const getAgentsArgs = async (args: GraphqlTypes.QueryAgentsArgs, context: Context): Promise<any> => {
  const { search, ...newArgs } = args
  const where: GraphqlTypes.AgentWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.affiliate = { id: context.accountId }
  }
  if (context.role === 'AGENT') {
    const agentQuery = `{ id brokerage { id } }`
    const { brokerage }: { brokerage: GraphqlTypes.Brokerage } = await context.prismaBinding.query.agent(
      { where: { id: context.accountId } },
      agentQuery
    )
    if (brokerage) {
      where.brokerage = { id: brokerage.id }
    } else {
      where.id = context.accountId
    }
  }
  if (args.search) {
    const searchPhrase = normalizeSearch(args.search)
    where.searchDocument_contains = searchPhrase
  }
  if (args.searchByBrokerage) {
    const brokerageSearchPhrase = normalizeSearch(args.searchByBrokerage)
    if (where.brokerage) {
      where.brokerage.searchDocument_contains = brokerageSearchPhrase
    } else {
      where.brokerage = { searchDocument_contains: brokerageSearchPhrase }
    }
  }
  newArgs.where = where
  return newArgs
}

const agentsByRole = async <T>(
  args: GraphqlTypes.QueryAgentsArgs,
  context: Context,
  info: GraphQLResolveInfo | string | undefined = undefined
): Promise<T[]> => {
  const newArgs = await getAgentsArgs(args, context)
  return context.prismaBinding.query.agents({ ...newArgs }, info)
}

export const agent: ResolversRequired['Query']['agent'] = async (_, args, context, info) => {
  const where: GraphqlTypes.AgentWhereInput = { ...args.where }
  if (context.role === 'AFFILIATE') {
    where.affiliate = { id: context.accountId }
  }
  const agentObj = await getObjectOrError<GraphqlTypes.Agent>(context.prismaBinding.query.agents({ where }, info))
  return agentObj
}

export const agents: ResolversRequired['Query']['agents'] = async (_, args, context, info) => {
  return agentsByRole<GraphqlTypes.Agent>(args, context, info)
}

export const agentsConnection: ResolversRequired['Query']['agentsConnection'] = async (_, args, context) => {
  const newArgs = await getAgentsArgs(args, context)
  const totalCount = await prisma
    .agentsConnection({ where: newArgs.where })
    .aggregate()
    .count()
  const objects = await agentsByRole<GraphqlTypes.Agent>(args, context)
  return { agents: objects, totalCount }
}

export const setBrokerageRelatedData = async (
  connectedBrokerage: GraphqlTypes.Maybe<GraphqlTypes.Brokerage>,
  brokerageId?: GraphqlTypes.Maybe<GraphqlTypes.Scalars['Int']>
): Promise<{
  brokerage: PrismaTypes.Maybe<PrismaTypes.BrokerageUpdateOneRequiredWithoutAgentsInput>
  companyPay: PrismaTypes.Maybe<boolean>
}> => {
  let brokerage, companyPay
  if (brokerageId && (!connectedBrokerage || (connectedBrokerage && connectedBrokerage.id !== brokerageId))) {
    brokerage = { connect: { id: brokerageId } }
    const updatedBrokerage = await prisma.brokerage({ id: brokerageId })
    companyPay = updatedBrokerage && updatedBrokerage.companyPay
  } else if (connectedBrokerage && connectedBrokerage.id) {
    companyPay = connectedBrokerage.companyPay
  }
  return { brokerage, companyPay }
}

export const moveBrokerAgents: ResolversRequired['Mutation']['moveBrokerAgents'] = async (_, args, context) => {
  if (context.role !== 'AFFILIATE') {
    throw new ForbiddenError('Only affiliate can perform this action')
  }

  const { fromBrokerId, toBrokerId } = args
  const affiliateBrokerages = await prisma.brokerages({
    where: { id_in: [fromBrokerId, toBrokerId], owner: { id: context.accountId } }
  })
  if (affiliateBrokerages.length !== 2) {
    throw new UserInputError('You can only move between brokerages you own')
  }

  const agentList = await prisma.agents({ where: { brokerage: { id: fromBrokerId } } })
  for (const agentObj of agentList) {
    await prisma.updateAgent({
      data: { brokerage: { connect: { id: toBrokerId } } },
      where: { id: agentObj.id }
    })
  }
  return agentList
}
