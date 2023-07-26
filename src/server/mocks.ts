import * as faker from 'faker'
import { IMocks, MockList } from 'graphql-tools'
import { randomArrayValue } from '../lib/faker'

// https://www.apollographql.com/docs/graphql-tools/mocking/
export const mocks: IMocks = {
  Order: () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    return {
      address: `${faker.address.streetAddress()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}`,
      agent: faker.name.findName(firstName, lastName),
      agentEmail: faker.internet.email(firstName, lastName),
      baths: faker.random.number(10),
      beds: faker.random.number(10),
      broker: 'Coldwell Banker Weir Manuel - Ann Arbor',
      cost: '$14',
      date: '04/23/2018',
      images: faker.random.number(10),
      MLS: [...Array(8).keys()].map(_ => faker.random.number(9)).join(),
      mobileTel: faker.phone.phoneNumber(),
      officeTel: faker.phone.phoneNumber(),
      price: '3.5M USD',
      services: () => new MockList([0, 10]),
      surface: 550,
      thumb: randomArrayValue([null, '/public/static/img/house1.png', '/public/static/img/house2.png']),
      videos: faker.random.number(10),
      web: faker.internet.url()
    }
  },
  OrderService: () => ({
    category: {
      color: {
        a: 1,
        b: faker.random.number(255),
        g: faker.random.number(255),
        r: faker.random.number(255)
      },
      icon: randomArrayValue(['Aerial', 'Photo', 'Video', 'FloorPlan']),
      id: faker.random.number(100000),
      label: faker.random.word()
    },
    date: randomArrayValue([null, '04/25/18']),
    id: faker.random.number(100000),
    name: faker.random.word(),
    photographer: randomArrayValue([null,{
      firstName:  faker.name.firstName(),
      lastName: faker.name.lastName()
    }]),
    time: randomArrayValue([null, '10:30am'])
  }),
  Query: () => ({
    me: () => ({
      firstName: 'Joe',
      lastName: 'Mocked'
    }),
    orders: () => new MockList([0, 10])
  })
}
