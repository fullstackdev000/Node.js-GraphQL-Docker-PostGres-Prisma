import { ExternalDomainDetails, TopLevelDomain } from '#veewme/gen/graphqlTypes'
import * as axios from 'axios'
import * as xml from 'xml-js'
import { ResolversRequired } from '../graphqlServer'

export const commandQuery = {
  check: 'namecheap.domains.check',
  getTLD: 'namecheap.users.getPricing',
  purchase: 'namecheap.domains.create',
  setHost: 'namecheap.domains.dns.setHosts'
}

export const queryUrl = async (command: string, additionalParams: { [key: string]: string } = {}) => {
  try {
    const response = await axios.default.get(
      process.env.NAMECHEAP_URL || 'https://api.sandbox.namecheap.com/xml.response',
      { params: {
        ApiKey: process.env.NAMECHEAP_API_KEY,
        ApiUser: process.env.NAMECHEAP_API_USER,
        ClientIp: process.env.NAMECHEAP_CLIENT_IP,
        Command: command,
        UserName: process.env.NAMECHEAP_USERNAME,
        ...additionalParams
      }}
    )
    const result = response && xml.xml2js(response.data, {
      attributesKey: 'attributes',
      compact: true,
      ignoreDeclaration: true,
      nativeType: true,
      textKey: 'text'
    })

    return result
  } catch (error) {
    return error
  }
}

export const checkDomainExist: ResolversRequired['Query']['checkDomainExist'] = async (obj, args, context, info) => {
  const { where: { url } } = args
  const data = await queryUrl(commandQuery.check, { DomainList: url })
  const apiResponse = data.ApiResponse
  const isApiResponseStatus = apiResponse && data.ApiResponse.attributes.Status !== 'ERROR'
  const isDomainAvailable = isApiResponseStatus && data.ApiResponse.CommandResponse.DomainCheckResult.attributes.Available === 'true'
  const result: ExternalDomainDetails = {
    exists: true,
    status: 'success',
    url
  }
  if (isDomainAvailable) {
    result.exists = false
    result.price = parseFloat(data.ApiResponse.CommandResponse.DomainCheckResult.attributes.PremiumRegistrationPrice)
    return result
  } else if (isApiResponseStatus) {
    return result
  } else if (apiResponse) {
    const errorText = (
      apiResponse
      && apiResponse.Errors
      && apiResponse.Errors.Error
      && apiResponse.Errors.Error.text
    )
    throw new Error(`Checking domain existence error: ${errorText}`)
  } else {
    throw new Error('Call API to namecheap.com fail')
  }
}

enum TopLevelDomains {
  COM = 'com',
  NET = 'net',
  INFO = 'info',
  ORG = 'org',
  HOUSE = 'house'
}

export const getTopLevelDomainsPrice
: ResolversRequired['Query']['getTopLevelDomainsPrice'] = async (obj, args, context, info) => {
  const topLevelDomains: TopLevelDomain[] = []
  for (const value of Object.values(TopLevelDomains)) {
    const data = await queryUrl(
      commandQuery.getTLD,
      {
        ActionName: 'REGISTER',
        ProductName: value,
        ProductType: 'DOMAIN'
      }
    )

    const apiResponse = data && data.ApiResponse
    const isApiResponseStatusSuccess = apiResponse && apiResponse.attributes && apiResponse.attributes.Status !== 'ERROR'
    const price = (
      isApiResponseStatusSuccess
      && apiResponse.CommandResponse
      && apiResponse.CommandResponse.UserGetPricingResult
      && apiResponse.CommandResponse.UserGetPricingResult.ProductType
      && apiResponse.CommandResponse.UserGetPricingResult.ProductType.ProductCategory
      && apiResponse.CommandResponse.UserGetPricingResult.ProductType.ProductCategory.Product
      && apiResponse.CommandResponse.UserGetPricingResult.ProductType.ProductCategory.Product.Price
    )

    if (price) {
      topLevelDomains.push({
        currency: price && price[1].attributes.Currency,
        price: price && price[1].attributes.Price && parseFloat(price[1].attributes.Price),
        status: 'success',
        topLevelDomain: value
      })
    } else if (isApiResponseStatusSuccess) {
      topLevelDomains.push({
        error: new Error(`Top-level domain '${value}' invalid`),
        status: 'error',
        topLevelDomain: value
      })
    } else if (apiResponse) {
      const errorText = (
        apiResponse
        && apiResponse.Errors
        && apiResponse.Errors.Error
        && apiResponse.Errors.Error.text
      )
      topLevelDomains.push({
        error: new Error(`Getting top level domain price error: ${errorText}`),
        status: 'error',
        topLevelDomain: value
      })
    } else {
      topLevelDomains.push({
        error: new Error('Call API to namecheap.com fail'),
        status: 'error',
        topLevelDomain: value
      })
    }
  }

  return topLevelDomains
}

interface DNSresult {
  attributes: {
    Domain: string
    IsSuccess: string
  }
  Warnings: object
}

export const setDns = async (sld: string, tld: string, dns: string = '35.237.145.158'): Promise<DNSresult> => {
  const data = await queryUrl(
    commandQuery.setHost,
    {
      Address1: dns,
      Address2: dns,
      Address3: dns,
      HostName1: '@',
      HostName2: '*',
      HostName3: 'www',
      RecordType1: 'A',
      RecordType2: 'A',
      RecordType3: 'A',
      SLD: sld,
      TLD: tld
    }
  )
  const apiResponse = data && data.ApiResponse
  const isApiResponseStatusSuccess = apiResponse && apiResponse.attributes && apiResponse.attributes.Status !== 'ERROR'
  const dnsHostResult = (
    apiResponse
    && apiResponse.CommandResponse
    && apiResponse.CommandResponse.DomainDNSSetHostsResult
  )
  const isDNSHostResultSuccess = (
    isApiResponseStatusSuccess
    && dnsHostResult
    && dnsHostResult.attributes
    && dnsHostResult.attributes.IsSuccess === 'true'
  )
  if (isDNSHostResultSuccess) {
    return dnsHostResult
  } else if (isApiResponseStatusSuccess) {
    throw new Error('Set DNS failed')
  } else if (apiResponse) {
    const errorText = (
      apiResponse
      && apiResponse.Errors
      && apiResponse.Errors.Error
      && apiResponse.Errors.Error.text
    )
    throw new Error(`DNS error: ${errorText}`)
  } else {
    throw new Error('Call API to namecheap.com fail')
  }
}
