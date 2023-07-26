// tslint:disable:no-var-requires
// tslint:disable:no-console

export {}

const faker = require('faker')
const bcrypt = require('bcrypt')
const prisma = require('../../../server/prismaBinding.ts')

faker.locale = 'en_US'

const hashPassword = (password: string): string => {
  if (process.env.SALTING_ROUNDS) {
    const saltingRounds = parseInt(process.env.SALTING_ROUNDS, 0)
    const salt = bcrypt.genSaltSync(saltingRounds)
    return bcrypt.hashSync(password, salt)
  }
  throw new Error('No salting rounds provided')
}

const normalizeSearch = (searchDocument: string): string => {
  let normalized = searchDocument.replace(/[^a-zA-Z0-9 ]/g, '')
  normalized = normalized.toLowerCase()
  normalized = normalized.trim()
  return normalized
}

// phone number must start with US/CA dial code to pass phone input validation
const fakerPhoneNumber = () => '+12011111111'

const createAffiliate = (affiliateNumber: number) => {
  return prisma.mutation.createAffiliate({ data: {
    activityStatus: 'ACTIVE',
    agents: { create: [] },
    brokerages: { create: [] },
    city: faker.address.city(),
    companyName: faker.company.companyName(),
    country: 'US',
    defaultColorScheme: { create: { b: 62 , g: 204 , r: 159 } },
    domainId: { create: [] },
    emailOffice: `affiliate${affiliateNumber}@test.com`,
    featuredRealEstateSites: { create: [] },
    mediaExports: { create: [
      {
        height: 200,
        name: 'Media Export 1',
        resolution: 75,
        width: 200
      }, {
        height: 200,
        name: 'Media Export 2',
        resolution: 150,
        width: 500
      }
    ]},
    orders: { create: [] },
    phone: fakerPhoneNumber(),
    phoneOffice: fakerPhoneNumber(),
    regions: { create: [
      { label: 'Default Region', default: true },
      { label: 'Second Region' }
    ]},
    serviceIds: { create: [] },
    servicePackageIds: { create: [] },
    state: 'TX',
    street: faker.address.streetAddress(),
    templateId: 1,
    tourColor: { create: { b: 255 , g: 166 , r: 61 } },
    user: { create: {
      email: `affiliate${affiliateNumber}@2.veewme.com`,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: hashPassword('password'),
      role: 'AFFILIATE'
    }},
    website: faker.internet.domainName(),
    zip: '77777'
  }}, '{ id agents { id } regions { id } }').catch((err: Error) => {
    console.log(err)
  })
}

const createAgent = (agentNumber: number, affiliateId: number, regionId: number) => {
  const city = faker.address.city()
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const brokerageCompanyName = faker.company.companyName()
  const brokerageSearchDocument = normalizeSearch(brokerageCompanyName)

  const createBrokerageWithOffices = {
    city,
    companyName: brokerageCompanyName,
    country: 'US',
    defaultColorScheme: { create: { b: 62 , g: 204 , r: 159 } },
    offices: {
      create: [
        {
          city,
          country: 'US',
          owner: { connect: { id: affiliateId } },
          region: { connect: { id: regionId } },
          state: 'CA',
          street: '',
          zip: '77777'
        }
      ]
    },
    owner: { connect: { id: affiliateId } },
    phone: fakerPhoneNumber(),
    photoDownloadPresets: { create: [] },
    region: { connect: { id: regionId } },
    searchDocument: brokerageSearchDocument,
    state: 'AZ',
    street: faker.address.streetAddress(),
    templateId: 1,
    zip: '77777'
  }

  return prisma.mutation.createAgent({ data: {
    affiliate: { connect: { id: affiliateId } },
    brokerage: { create: { ...createBrokerageWithOffices } },
    city,
    country: 'US',
    defaultColorScheme: { create: { a: 1, b: 62, g: 204, r: 159 } },
    flyerLayout: 'FEATURED1',
    orders: { create: [] },
    phone: fakerPhoneNumber(),
    region: { connect: { id: regionId } },
    searchDocument: normalizeSearch(`${firstName} ${lastName} ${firstName}`),
    state: 'AZ',
    street: faker.address.streetAddress(),
    stripeCustomerId: 'cus_IfUwamIunLPi3w',
    templateId: 1,
    user: { create: {
      email: `agent${agentNumber}@2.veewme.com`,
      firstName,
      lastName,
      password: hashPassword('password'),
      role: 'AGENT'
    }},
    zip: '77777'
  }}, '{ id }').catch((err: Error) => {
    console.log(err)
  })
}

const createPhotographer = (affiliateId: number, regionId: number) => {
  const firstName = 'Joe'
  const lastName = 'Photo'
  return prisma.mutation.createPhotographer({ data: {
    affiliateId: { connect: { id: affiliateId } },
    city: 'New York',
    phone: fakerPhoneNumber(),
    regionId: { connect: { id: regionId } },
    searchDocument: normalizeSearch(`${firstName} ${lastName} ${firstName}`),
    user: { create: {
      email: 'photographer@2.veewme.com',
      firstName,
      lastName,
      password: hashPassword('password'),
      role: 'PHOTOGRAPHER'
    }}
  }}, '{ id }').catch((err: Error) => {
    console.log(err)
  })
}

const createProcessor = (affiliateId: number, regionId: number) => {
  const firstName = 'Joe'
  const lastName = 'Processor'
  return prisma.mutation.createProcessor({ data: {
    affiliateId: { connect: { id: affiliateId } },
    city: 'New York',
    phone: fakerPhoneNumber(),
    regionId: { connect: { id: regionId } },
    searchDocument: normalizeSearch(`${firstName} ${lastName} ${firstName}`),
    user: { create: {
      email: 'processor@2.veewme.com',
      firstName,
      lastName,
      password: hashPassword('password'),
      role: 'PROCESSOR'
    }}
  }}, '{ id }').catch((err: Error) => {
    console.log(err)
  })
}

exports.createAffiliate = createAffiliate
exports.createAgent = createAgent
exports.createPhotographer = createPhotographer
exports.createProcessor = createProcessor
exports.hashPassword = hashPassword
exports.normalizeSearch = normalizeSearch
