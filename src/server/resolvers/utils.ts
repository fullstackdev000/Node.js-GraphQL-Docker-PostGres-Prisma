import * as GraphqlTypes from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { saveFileToStorage, unlink } from '#veewme/lib/storage'
import { Context } from '#veewme/lib/types'
import { ForbiddenError, UserInputError } from 'apollo-server-express'
import * as path from 'path'

/**
 * Get first object from a list. If the list is empty, throw ForbiddenError.
 * @param objects List of objects
 */
export const getObjectOrError = async <R>(objects: Promise<R[]>) => {
  const obj = (await objects)[0]
  if (!obj) throw new ForbiddenError('No access')
  return obj
}

// Prefixes to denote the directory where to upload the file
const PREFIX_CLIENTS = 'clients'
const PREFIX_MEDIA = 'media'

export interface BuildRemotePathArgs {
  affiliate?: PrismaTypes.Affiliate | null
  brokerage?: PrismaTypes.Brokerage | null
  agent?: PrismaTypes.Agent | null
  realEstate?: PrismaTypes.RealEstate | null
  photographer?: PrismaTypes.Photographer | null
  prefix: string
}

export const buildRemotePath = ({
  affiliate,
  brokerage,
  agent,
  realEstate,
  photographer,
  prefix
}: BuildRemotePathArgs): string => {
  let remotePath = ''
  if (prefix) {
    remotePath = path.join(prefix)
  }
  if (affiliate) {
    remotePath = path.join(remotePath, `${affiliate.id}`)
  }
  if (brokerage) {
    remotePath = path.join(remotePath, `${brokerage.id}`)
  }
  if (agent) {
    remotePath = path.join(remotePath, `${agent.id}`)
  }
  if (realEstate) {
    remotePath = path.join(remotePath, `${realEstate.id}`)
  }
  if (photographer) {
    remotePath = path.join(remotePath, `${photographer.id}`)
  }
  return remotePath
}

export const buildRemotePathForRealEstate = async (realEstateId: number): Promise<string> => {
  // TODO: validate if real estate belongs to the viewer
  const realEstate = await prisma.realEstate({ id: realEstateId })
  if (!realEstate) {
    throw new UserInputError('Real estate does not exist')
  }
  const agent = await prisma.realEstate({ id: realEstateId }).agentPrimaryId()
  if (!agent) {
    throw new UserInputError('Agent does not exist')
  }
  const brokerage = await prisma.agent({ id: agent.id }).brokerage()
  const affiliate = await prisma.agent({ id: agent.id }).affiliate()
  return buildRemotePath({ affiliate, brokerage, agent, realEstate, prefix: PREFIX_MEDIA })
}

export const buildRemotePathForService = (affiliateId: number): string => {
  return path.join(PREFIX_CLIENTS, `${affiliateId}`)
}

export const buildRemotePathForAgent = async (agent: PrismaTypes.Agent): Promise<string> => {
  const brokerage = await prisma.agent({ id: agent.id }).brokerage()
  const affiliate = await prisma.agent({ id: agent.id }).affiliate()
  return buildRemotePath({ affiliate, brokerage, agent, prefix: PREFIX_CLIENTS })
}

export const buildRemotePathForBrokerage = async (brokerage: PrismaTypes.Brokerage): Promise<string> => {
  const affiliate = await prisma.brokerage({ id: brokerage.id }).owner()
  return buildRemotePath({ affiliate, brokerage, prefix: PREFIX_CLIENTS })
}

export const buildRemotePathForAffiliate = async (affiliate: PrismaTypes.Affiliate): Promise<string> => {
  return buildRemotePath({ affiliate, prefix: PREFIX_CLIENTS })
}

export const buildRemotePathForPhotographer = async (photographer: PrismaTypes.Photographer): Promise<string> => {
  const affiliate = await prisma.photographer({ id: photographer.id }).affiliateId()
  return buildRemotePath({ affiliate, photographer, prefix: PREFIX_CLIENTS })
}

export const updateSavedFile = async (
  remotePath: string,
  currentFile: GraphqlTypes.Maybe<GraphqlTypes.File>,
  newFile?: GraphqlTypes.Maybe<GraphqlTypes.Scalars['Upload']>
): Promise<PrismaTypes.Maybe<PrismaTypes.FileUpdateOneInput>> => {
  // Only delete current picture when either null or empty string was passed in the mutation input.
  // In case of undefined value we do nothing.
  if (newFile === null && currentFile) {
    unlink(currentFile.path)
    return { delete: true }
  }

  const profilePictureExists = !!(newFile || currentFile)
  const newProfilePictureFileFromUpload = newFile && newFile.file

  if (profilePictureExists) {
    const newProfilePicture =
      newProfilePictureFileFromUpload && (await saveFileToStorage({ fileUpload: newFile.file, remotePath }))
    if (currentFile && newProfilePictureFileFromUpload) {
      unlink(currentFile.path)
    }
    return {
      create: !currentFile && newProfilePicture ? newProfilePicture : undefined,
      delete: false,
      update: currentFile && newProfilePicture
    }
  }
  return
}

export const getAffiliateIdForUser = async (context: Context) => {
  if (context.role === 'AFFILIATE' && context.accountId) {
    return context.accountId
  } else if (context.role === 'AGENT') {
    const affiliate = await prisma.agent({ id: context.accountId }).affiliate()
    return affiliate.id
  }
  throw new ForbiddenError('Only affiliate or agent can use this action.')
}
