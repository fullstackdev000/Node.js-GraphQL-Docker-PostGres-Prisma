import { DomainOrderByInput } from '#veewme/gen/graphqlTypes'
import { prisma } from '#veewme/gen/prisma'
import { checkCname } from '#veewme/helpers/dns'
import { CnameStatus } from '#veewme/lib/types'
import { forwardTo } from 'graphql-binding'
import { ResolversRequired } from '../graphqlServer'
import { commandQuery, queryUrl, setDns } from './namecheap'

export const checkWhiteLabel: ResolversRequired['Mutation']['checkWhiteLabel'] = async (_, { data }) => {
  const { cname, id } = data
  const MAIN_DOMAIN = 'veewme.com'
  const status = await checkCname(cname, MAIN_DOMAIN)
  if (status === CnameStatus.SUCCESS) {
    await prisma.updateAffiliate({
      data: {
        customDomain: cname,
        customDomainEnabled: true
      },
      where: {
        id
      }
    })
  }
  return status
}

export const addDomain: ResolversRequired['Mutation']['addDomain'] = async (obj, { data }, context, info) => {
  const affiliateId = context.role === 'AFFILIATE' && context.accountId ? context.accountId : data.affiliateId
  if (!affiliateId) { throw new Error('Affiliate id is required') }
  const d = await context.prismaBinding.mutation.createDomain({ data: {
    addedBy: 'AFFILIATE',
    affiliateId: { connect: { id: affiliateId } },
    url: data.url
  }})
  return d
}

export const purchaseDomain: ResolversRequired['Mutation']['purchaseDomain'] = async (obj, args, context, info) => {
  const { url } = args.data
  const affiliateId = context.role === 'AFFILIATE' && context.accountId ? context.accountId : args.data.affiliateId
  if (!affiliateId) { throw new Error('Affiliate id is required') }
  const admins = await prisma.admins({ where: { user: { email: 'admin@2.veewme.com' } } })
  if (admins.length === 0) throw new Error('Error fetching admins')
  const admin = admins[0]
  const data = await queryUrl(
    commandQuery.purchase,
    {
      AdminAddress1: admin.adminAddress1,
      AdminCity: admin.adminCity,
      AdminCountry: admin.adminCountry,
      AdminEmailAddress: admin.adminEmailAddress,
      AdminFirstName: admin.adminFirstName,
      AdminLastName: admin.adminLastName,
      AdminOrganizationName: admin.adminOrganizationName,
      AdminPhone: admin.adminPhone,
      AdminPostalCode: admin.adminPostalCode,
      AdminStateProvince: admin.adminStateProvince,
      AuxBillingAddress1: admin.auxBillingAddress1,
      AuxBillingCity: admin.auxBillingCity,
      AuxBillingCountry: admin.auxBillingCountry,
      AuxBillingEmailAddress: admin.auxBillingEmailAddress,
      AuxBillingFirstName: admin.auxBillingFirstName,
      AuxBillingLastName: admin.auxBillingLastName,
      AuxBillingOrganizationName: admin.auxBillingOrganizationName,
      AuxBillingPhone: admin.auxBillingPhone,
      AuxBillingPostalCode: admin.auxBillingPostalCode,
      AuxBillingStateProvince: admin.auxBillingStateProvince,
      DomainName: url,
      RegistrantAddress1: admin.registrantAddress1,
      RegistrantCity: admin.registrantCity,
      RegistrantCountry: admin.registrantCountry,
      RegistrantEmailAddress: admin.registrantEmailAddress,
      RegistrantFirstName: admin.registrantFirstName,
      RegistrantLastName: admin.registrantLastName,
      RegistrantOrganizationName: admin.registrantOrganizationName,
      RegistrantPhone: admin.registrantPhone,
      RegistrantPostalCode: admin.registrantPostalCode,
      RegistrantStateProvince: admin.registrantStateProvince,
      TechAddress1: admin.techAddress1,
      TechCity: admin.techCity,
      TechCountry: admin.techCountry,
      TechEmailAddress: admin.techEmailAddress,
      TechFirstName: admin.techFirstName,
      TechLastName: admin.techLastName,
      TechOrganizationName: admin.techOrganizationName,
      TechPhone: admin.techPhone,
      TechPostalCode: admin.techPostalCode,
      TechStateProvince: admin.techStateProvince,
      Years: admin.years
    }
  )
  const apiResponse = data && data.ApiResponse
  const isApiResponseStatusSuccess = apiResponse && apiResponse.attributes && apiResponse.attributes.Status !== 'ERROR'
  const d = (
    isApiResponseStatusSuccess
    && apiResponse.CommandResponse
    && apiResponse.CommandResponse.DomainCreateResult
    && apiResponse.CommandResponse.DomainCreateResult.attributes
  )
  if (!d || d.Registered !== 'true') {
    if (isApiResponseStatusSuccess) {
      throw new Error('Purchase domain failed')
    } else if (apiResponse) {
      const errorText = (
        apiResponse
        && apiResponse.Errors
        && apiResponse.Errors.Error
        && apiResponse.Errors.Error.text
      )
      throw new Error(`Purchase domain error: ${errorText}`)
    } else {
      throw new Error('Call API to namecheap.com fail')
    }
  } else {
    const sld = url.split('.', 1)[0]
    const tld = url.replace(`${sld}.`,'')
    await setDns(sld, tld)
    return context.prismaBinding.mutation.createDomain({ data: {
      addedBy: 'NAMECHEAP',
      affiliateId: { connect: { id: affiliateId } },
      url
    }})
  }
}

export const createDomain: ResolversRequired['Mutation']['createDomain'] = async (obj, args, context, info) => {
  const { data: { existing, ...data } } = args
  if (existing) {
    return addDomain(obj, { data }, context, info)
  } else {
    return purchaseDomain(obj, { data }, context, info)
  }
}

export const Domain: ResolversRequired['Domain'] = {
  affiliate: parent => prisma.domain({ id: parent.id }).affiliateId(),
  affiliateId: async parent => {
    const aff = await prisma.domain({ id: parent.id }).affiliateId()
    return aff && aff.id
  },
  existing: async parent => {
    const d = await prisma.domain({ id: parent.id })
    return !!d && d.addedBy === 'AFFILIATE'
  },
  tour: parent => prisma.domain({ id: parent.id }).tourId(),
  tourId: async parent => {
    const tour = await prisma.domain({ id: parent.id }).tourId()
    return tour && tour.id
  }
}

export const domain: ResolversRequired['Query']['domain'] = forwardTo('prismaBinding')
export const domains: ResolversRequired['Query']['domains'] = async (obj, args, context, info) => {
  const affiliateId = (
    context.role === 'AFFILIATE' && context.accountId
    ? context.accountId
    : args.where && args.where.affiliateId
  )
  const orderBy: DomainOrderByInput = args.orderBy || 'dateOfPurchase_DESC'
  const listDomains = await context.prismaBinding.query.domains({
    orderBy,
    where: {
      ...args.where,
      affiliateId: args.where
      ? {
        ...args.where.affiliateId,
        id: affiliateId
      }
      : { id: affiliateId }
    }
  }, info)
  return listDomains
}
export const updateDomain: ResolversRequired['Mutation']['updateDomain'] = async (obj, args, context, info) => {
  const { affiliate, affiliateId, tour, tourId, ...data } = args.data
  if (context.role === 'AFFILIATE') {
    const currentDomain = await context.prismaBinding.query.domain({ where: args.where }, ` id affiliateId`)
    if (currentDomain && currentDomain.affiliateId !== context.accountId) {
      throw new Error('Affiliate may only update it\'s own domains.')
    }
  }
  const d = await context.prismaBinding.mutation.updateDomain({
    data: {
      ...data,
      affiliateId: {
        ...affiliate,
        connect: affiliateId || affiliate && affiliate.id
        ? { id: affiliateId || affiliate && affiliate.id }
        : undefined
      },
      tourId: {
        ...tour,
        connect: tourId || tour && tour.id
        ? { id: tourId || tour && tour.id }
        : undefined
      }
    },
    where: args.where
  }, info)
  return d
}

export const deleteDomain: ResolversRequired['Mutation']['deleteDomain'] = async (obj, args, context, info) => {
  if (context.role === 'AFFILIATE') {
    const owner = await prisma.domain(args.where).affiliateId()
    if (owner && owner.id !== context.accountId) {
      throw new Error('Affiliate may only delete it\'s own domains.')
    }
  }
  return prisma.deleteDomain(args.where)
}
