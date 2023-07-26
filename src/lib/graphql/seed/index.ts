// tslint:disable:no-var-requires
// tslint:disable:no-console

export {}

const prisma = require('../../../server/prismaBinding.ts')
const {
  createAffiliate,
  createAgent,
  createPhotographer,
  createProcessor,
  hashPassword,
  normalizeSearch
} = require('./utils')

// date helper
const getShiftedDate = (shiftDays: number, hour: number) => {
  const newDate = new Date()
  newDate.setDate(newDate.getDate() + shiftDays)
  newDate.setHours(hour, 0, 0, 0)
  const dayOfWeek = newDate.getDay()
  // avoid weekends
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    newDate.setDate(newDate.getDate() + 2)
  }
  return newDate
}

const getRealEstateSearchDocument = (realEstate: any) => {
  const values = [realEstate.city, realEstate.street, realEstate.country, realEstate.zip, realEstate.state]
  return normalizeSearch(values.join(' '))
}

interface FirstStepSeedData {
  affiliateId1?: number
  affiliateId2?: number
  regionIds: number[]
}

interface SecondStepSeedData extends FirstStepSeedData {
  agentId?: number
  aerialAddOnId?: number
  aerialServiceId?: number
  photographerId?: number
  photographyServiceId?: number
  processorId?: number
}

interface ThirdStepData extends SecondStepSeedData {
  realEstateId1?: number
  realEstateId2?: number
  realEstateId3?: number
  servicePackageId?: number
  serviceWithProcessorId?: number
  tourId1?: number
  tourId2?: number
  tourId3?: number
}

interface FourthStepData extends ThirdStepData {}

const firstStepSeed = async (): Promise<FirstStepSeedData> => {
  prisma.mutation.createAdmin({ data: {
    adminAddress1: '5525%Red%Fox%Run',
    adminCity: 'MI',
    adminCountry: 'US',
    adminEmailAddress: 'ml@veewme.com',
    adminFirstName: 'Matti',
    adminLastName: 'Lahtinen',
    adminOrganizationName: 'VeewMe',
    adminPhone: '+1.7346045520',
    adminPostalCode: '48105',
    adminStateProvince: 'MI',
    auxBillingAddress1: '5525%Red%Fox%Run',
    auxBillingCity: 'MI',
    auxBillingCountry: 'US',
    auxBillingEmailAddress: 'ml@veewme.com',
    auxBillingFirstName: 'Matti',
    auxBillingLastName: 'Lahtinen',
    auxBillingOrganizationName: 'VeewMe',
    auxBillingPhone: '+1.7346045520',
    auxBillingPostalCode: '48105',
    auxBillingStateProvince: 'MI',
    registrantAddress1: '5525%Red%Fox%Run',
    registrantCity: 'MI',
    registrantCountry: 'US',
    registrantEmailAddress: 'ml@veewme.com',
    registrantFirstName: 'Matti',
    registrantLastName: 'Lahtinen',
    registrantOrganizationName: 'VeewMe',
    registrantPhone: '+1.7346045520',
    registrantPostalCode: '48105',
    registrantStateProvince: 'MI',
    techAddress1: '5525%Red%Fox%Run',
    techCity: 'MI',
    techCountry: 'US',
    techEmailAddress: 'ml@veewme.com',
    techFirstName: 'Matti',
    techLastName: 'Lahtinen',
    techOrganizationName: 'VeewMe',
    techPhone: '+1.7346045520',
    techPostalCode: '48105',
    techStateProvince: 'MI',
    user: { create: {
      email: 'admin@2.veewme.com',
      firstName: 'Joe',
      lastName: 'Admin',
      password: hashPassword('password'),
      role: 'ADMIN'
    }},
    years: '1'
  }}, '{ id }').catch((err: Error) => {
    console.log(err)
  })

  const affiliate1 = await createAffiliate(1)
  const affiliate2 = await createAffiliate(2)

  prisma.mutation.createDemoImages({ data: {
    cropImages: { create: [] },
    images: { create: [] }
  }}, '{ id }').catch((err: Error) => {
    console.log(err)
  })

  prisma.mutation.createDeveloper({ data: {
    user: { create: {
      email: 'developer@2.veewme.com',
      firstName: 'Joe',
      lastName: 'Developer',
      password: hashPassword('password'),
      role: 'DEVELOPER'
    }}
  }}, '{ id }').catch((err: Error) => {
    console.log(err)
  })

  Promise.all([
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 62, g: 204, r: 159 } },
      icon: 'Photo',
      label: 'Photo',
      orderIndex: 1
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 0, g: 0, r: 255 } },
      icon: 'Video',
      label: 'Video',
      orderIndex: 2
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 166, g: 255, r: 61 } },
      icon: 'Aerial',
      label: 'Aerial',
      orderIndex: 3
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 133, g: 255, r: 61 } },
      icon: 'FloorPlan',
      label: 'Floor Plan',
      orderIndex: 4
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 41, g: 125, r: 0 } },
      icon: 'Vr3D',
      label: '3D/VR',
      orderIndex: 5
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 232, g: 193, r: 95 } },
      icon: 'Panorama',
      label: 'Panorama',
      orderIndex: 6
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 14, g: 201, r: 255 } },
      icon: 'SocialMedia',
      label: 'Social Media',
      orderIndex: 7
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 255, g: 193, r: 36 } },
      icon: 'Print',
      label: 'Print',
      orderIndex: 8
    }}, '{ label }'),
    prisma.mutation.createServiceCategory({ data: {
      color: { create: { a: 1, b: 255, g: 27, r: 121 } },
      icon: 'Other',
      label: 'Other',
      orderIndex: 9
    }}, '{ label }')
  ]).catch((err: Error) => {
    console.log(err)
  })

  return {
    affiliateId1: affiliate1 && affiliate1.id,
    affiliateId2: affiliate2 && affiliate2.id,
    regionIds: affiliate1 && affiliate1.regions && affiliate1.regions.map(({ id }: { id: number }) => id) || []
  }
}

const secondStepSeed = async (data: FirstStepSeedData): Promise<SecondStepSeedData> => {
  const secondStepData: SecondStepSeedData = { ...data }
  if (data.affiliateId1) {
    if (data.regionIds[0]) {
      const agent1 = await createAgent(1, data.affiliateId1, data.regionIds[0])
      await createAgent(2, data.affiliateId2, data.regionIds[0])
      const photographer = await createPhotographer(data.affiliateId1, data.regionIds[0])
      const processor = await createProcessor(data.affiliateId1, data.regionIds[0])

      const aerialService = await prisma.mutation.createService({ data: {
        assignable: true,
        categoryId: { connect: { label: 'Aerial' } },
        defaultCompensation: 20.00,
        duration: 3,
        durationUnit: 'Hour',
        mediaOnly: false,
        name: '2 minute drone film',
        orderedServiceIds: { create: [] },
        orderNotifyEmails: [],
        ownerId: { connect: { id: data.affiliateId1 } },
        packageIds: { create: [] },
        price: 40.00,
        regionFeeAdjustedIds:  { create: [] },
        serviceType: 'Primary',
        shortDescription: '2 minute drone film',
        tourNotifyEmails: []
      }}, '{ id }').catch((err: Error) => { console.log(err) })

      const aerialAddOn = await prisma.mutation.createService({ data: {
        assignable: true,
        categoryId: { connect: { label: 'Aerial' } },
        defaultCompensation: 10.00,
        duration: 30,
        durationUnit: 'Minute',
        mediaOnly: false,
        name: '5 minute environment film',
        orderedServiceIds: { create: [] },
        orderNotifyEmails: [],
        ownerId: { connect: { id: data.affiliateId1 } },
        packageIds: { create: [] },
        price: 20.00,
        regionFeeAdjustedIds:  { create: [] },
        serviceType: 'AddOn',
        shortDescription: '5 minute environment film',
        tourNotifyEmails: []
      }}, '{ id }').catch((err: Error) => { console.log(err) })

      secondStepData.agentId = agent1 && agent1.id
      secondStepData.photographerId = photographer && photographer.id
      secondStepData.processorId = processor && processor.id
      secondStepData.aerialServiceId = aerialService && aerialService.id
      secondStepData.aerialAddOnId = aerialService && aerialAddOn.id

      await prisma.mutation.createEvent({ data: {
        allDay: false,
        end: getShiftedDate(0, 15),
        photographer: { connect: { id: photographer.id } },
        privateNote: 'Private note',
        publicNote: 'Public note',
        start: getShiftedDate(0, 13),
        title: 'Photo shooting session'
      } })

      await prisma.mutation.createEvent({ data: {
        allDay: true,
        photographer: { connect: { id: photographer.id } },
        privateNote: 'Private note',
        publicNote: 'Public note',
        start:  getShiftedDate(2, 9),
        title: 'Some All Day event'
      } })

      await prisma.mutation.createEvent({ data: {
        allDay: false,
        photographer: { connect: { id: photographer.id } },
        privateNote: 'event',
        publicNote: 'Public note',
        start:  getShiftedDate(-3, 10),
        title: 'ABC event'
      } })

      await prisma.mutation.createEvent({ data: {
        allDay: false,
        photographer: { connect: { id: photographer.id } },
        privateNote: 'Private note',
        publicNote: 'Public note',
        start:  getShiftedDate(5, 16),
        title: 'XYZ event'
      } })

      await prisma.mutation.createEvent({ data: {
        allDay: false,
        photographer: { connect: { id: photographer.id } },
        privateNote: 'Test note',
        publicNote: 'Lorem ipsum',
        start:  getShiftedDate(1, 12),
        title: 'June event'
      } })
    }
    if (data.regionIds[1]) {
      const photographyService = await prisma.mutation.createService({ data: {
        assignable: true,
        categoryId: { connect: { label: 'Photo' } },
        defaultCompensation: 15.00,
        duration: 4,
        durationUnit: 'Hour',
        mediaOnly: false,
        name: '40 photographs',
        orderedServiceIds: { create: [] },
        orderNotifyEmails: [],
        ownerId: { connect: { id: data.affiliateId1 } },
        packageIds: { create: [] },
        price: 30.99,
        regionFeeAdjustedIds:  { create: [{
          adjustedCompensation: 20,
          adjustedPrice: 35.99,
          regionId: { connect: { id: data.regionIds[1] } }
        }] },
        serviceType: 'Primary',
        shortDescription: '40 photographs',
        tourNotifyEmails: []
      }}, '{ id }').catch((err: Error) => { console.log(err) })
      secondStepData.photographyServiceId = photographyService && photographyService.id
    }
  }

  return secondStepData
}

const thirdStepSeed = async (data: SecondStepSeedData): Promise<ThirdStepData> => {
  const thirdStepData: ThirdStepData = { ...data }
  if (data.affiliateId1) {
    if (data.processorId) {
      const serviceWithProcessor = await prisma.mutation.createService({ data: {
        assignable: true,
        categoryId: { connect: { label: 'Photo' } },
        defaultCompensation: 10.00,
        duration: 2,
        durationUnit: 'Hour',
        mediaOnly: false,
        name: '20 photos',
        orderedServiceIds: { create: [] },
        orderNotifyEmails: [],
        ownerId: { connect: { id: data.affiliateId1 } },
        packageIds: { create: [] },
        price: 20.99,
        processorId: { connect: { id: data.processorId } },
        regionFeeAdjustedIds:  { create: [] },
        serviceType: 'Primary',
        shortDescription: '20 photos',
        tourNotifyEmails: []
      }}, '{ id }').catch((err: Error) => { console.log(err) })
      thirdStepData.serviceWithProcessorId = serviceWithProcessor && serviceWithProcessor.id
    }
    if (data.photographyServiceId && data.aerialServiceId && data.regionIds[1]) {
      const servicePackage = await prisma.mutation.createServicePackage({ data: {
        assignable: true,
        duration: 3,
        durationUnit: 'Hour',
        mediaOnly: false,
        name: 'Photo and aerial',
        orderedServicesIds: { create: [] },
        orderNotifyEmails: [],
        ownerId: { connect: { id: data.affiliateId1 } },
        price: 35.00,
        regionFeeAdjustedIds: { create: [{
          adjustedCompensation: 20,
          adjustedPrice: 40.99,
          regionId: { connect: { id: data.regionIds[1] } }
        }] },
        serviceIds: { connect: [{ id: data.aerialServiceId }, { id: data.photographyServiceId }] },
        tourNotifyEmails: []
      }}, '{ id }').catch((err: Error) => { console.log(err) })
      thirdStepData.servicePackageId = servicePackage && servicePackage.id
    }
  }

  if (data.photographyServiceId && data.aerialServiceId && data.agentId && data.affiliateId1) {
    const realEstate1 = {
      city: 'New York',
      country: 'US',
      state: 'NY',
      street: '350 Fifth Avenue',
      zip: '10118'
    }
    const order1 = await prisma.mutation.createOrder({ data: {
      orderedFromAffiliateId: { connect: { id: data.affiliateId1 } },
      price: 50.00,
      realEstateId: { create: {
        ...realEstate1,
        agentPrimaryId: { connect: { id: data.agentId } },
        searchDocument: getRealEstateSearchDocument(realEstate1),
        tourId: { create: {
          realEstateHeadline: 'sth'
        }}
      }},
      serviceIds: { create: [
        { serviceId: { connect: { id: data.photographyServiceId } } }
      ]},
      statusPaid: true
    }}, `{
      id
      realEstateId {
        id
        tourId { id }
      }
    }`).catch((err: Error) => {
      console.log(err)
    })
    thirdStepData.realEstateId1 = order1 && order1.realEstateId && order1.realEstateId.id
    thirdStepData.tourId1 = order1 && order1.realEstateId && order1.realEstateId.tourId && order1.realEstateId.tourId.id

    const realEstate2 = {
      city: 'Washington DC',
      country: 'US',
      state: 'WA',
      street: '1600 Pennsylvania Avenue',
      zip: '152536'
    }
    const order2 = await prisma.mutation.createOrder({ data: {
      orderedFromAffiliateId: { connect: { id: data.affiliateId1 } },
      price: 70.00,
      realEstateId: { create: {
        ...realEstate2,
        agentPrimaryId: { connect: { id: data.agentId } },
        searchDocument: getRealEstateSearchDocument(realEstate2)
      }},
      serviceIds: { create: [
        { serviceId: { connect: { id: data.aerialServiceId } } }
      ]}
    }}, `{
      id
      realEstateId {
        id
        tourId { id }
      }
    }`).catch((err: Error) => {
      console.log(err)
    })
    thirdStepData.realEstateId2 = order2 && order2.realEstateId && order2.realEstateId.id
    thirdStepData.tourId2 = order2 && order2.realEstateId && order2.realEstateId.tourId && order2.realEstateId.tourId.id

    const realEstate3 = {
      city: 'Crystal Lake Township',
      country: 'US',
      state: 'MI',
      street: '49 Linden St',
      zip: '49635'
    }
    const order3 = await prisma.mutation.createOrder({ data: {
      orderedFromAffiliateId: { connect: { id: data.affiliateId1 } },
      price: 100.00,
      realEstateId: { create: {
        ...realEstate3,
        agentPrimaryId: { connect: { id: data.agentId } },
        searchDocument: getRealEstateSearchDocument(realEstate3)
      }},
      serviceIds: { create: [
        { serviceId: { connect: { id: data.aerialServiceId } } }
      ]}
    }}, `{
      id
      realEstateId {
        id
        tourId { id }
      }
    }`).catch((err: Error) => {
      console.log(err)
    })
    thirdStepData.realEstateId3 = order3 && order3.realEstateId && order3.realEstateId.id
    thirdStepData.tourId3 = order3 && order3.realEstateId && order3.realEstateId.tourId && order3.realEstateId.tourId.id
  }
  return thirdStepData
}

const fourthStepSeed = async (data: ThirdStepData): Promise<FourthStepData> => {
  const fourthStepData: FourthStepData = { ...data }
  if (fourthStepData.realEstateId1) {
    Promise.all([
      prisma.mutation.createPhoto({ data: {
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename1.jpg',
          path: 'https://picsum.photos/1280/960?image=1081',
          size: 0
        }},
        hidden: true,
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename1-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=1081',
          size: 0
        }},
        title: 'Lorem ipsum',
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename1-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1081',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename2.jpg',
          path: 'https://picsum.photos/1280/960?image=1040',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename2-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=1040',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename2-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1040',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename3.jpg',
          path: 'https://picsum.photos/1280/960?image=1078',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename3-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=1078',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename3-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1078',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename4.jpg',
          path: 'https://picsum.photos/1280/960?image=1031',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename4-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=1031',
          size: 0
        }},
        title: 'Some test caption',
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename4-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1031',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename5.jpg',
          path: 'https://picsum.photos/1280/960?image=946',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename5-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=946',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename5-web.jpg',
          path: 'https://picsum.photos/1280/960?image=946',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename6.jpg',
          path: 'https://picsum.photos/1280/960?image=859',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename6-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=859',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename6-web.jpg',
          path: 'https://picsum.photos/1280/960?image=859',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename7.jpg',
          path: 'https://picsum.photos/1280/960?image=249',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename7-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=249',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename7-web.jpg',
          path: 'https://picsum.photos/1280/960?image=249',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createMediaDocument({ data: {
        fileId: { create: {
          extension: 'doc',
          filename: 'xyz.doc',
          path: '',
          size: 2245
        }},
        label: 'Archive',
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } }
      }}, '{ id }'),
      prisma.mutation.createMediaDocument({ data: {
        fileId: { create: {
          extension: 'xls',
          filename: 'xyz.xls',
          path: '',
          size: 2245
        }},
        label: 'Very important document',
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } }
      }}, '{ id }'),
      prisma.mutation.createMediaDocument({ data: {
        fileId: { create: {
          extension: 'doc',
          filename: 'abc.doc',
          path: '',
          size: 2245
        }},
        label: 'Document #1',
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } }
      }}, '{ id }'),
      prisma.mutation.createMediaDocument({ data: {
        fileId: { create: {
          extension: 'pdf',
          filename: 'abc.pdf',
          path: '',
          size: 2245
        }},
        label: 'Document pdf',
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } }
      }}, '{ id }'),
      prisma.mutation.createMediaDocument({ data: {
        fileId: { create: {
          extension: 'xls',
          filename: 'abc.xls',
          path: '',
          size: 2245
        }},
        label: 'Document',
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } }
      }}, '{ id }'),
      prisma.mutation.createMediaDocument({ data: {
        fileId: { create: {
          extension: 'doc',
          filename: 'report.doc',
          path: '',
          size: 2245
        }},
        label: 'Report 2019',
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } }
      }}, '{ id }'),
      prisma.mutation.createMediaDocument({ data: {
        fileId: { create: {
          extension: 'doc',
          filename: 'test.doc',
          path: '',
          size: 2245
        }},
        label: 'Test document name',
        realEstateId: { connect: { id: fourthStepData.realEstateId1 } }
      }}, '{ id }'),
      prisma.mutation.createMediaInteractive({ data: {
        appearance: 'Always',
        label: 'Other',
        realEstate: { connect: { id: fourthStepData.realEstateId1 } },
        type: 'EMBEDDED',
        url: 'http://example.com'
      }}, '{ id }'),
      prisma.mutation.createMediaInteractive({ data: {
        appearance: 'Unbranded',
        label: 'EMBEDDED',
        realEstate: { connect: { id: fourthStepData.realEstateId1 } },
        type: 'EMBEDDED',
        url: 'http://example.com'
      }}, '{ id }'),
      prisma.mutation.createPanorama({ data: {
        file: { create: {
          extension: 'jpg',
          filename: 'some-filename1.jpg',
          path: 'https://picsum.photos/1280/960?image=249',
          size: 0
        }},
        hfov: 360,
        initialHorizontalAngle: 15,
        initialVerticalAngle: 10,
        initialZoom: 50,
        realEstate: { connect: { id: fourthStepData.realEstateId1 } },
        thumb: { create: {
          extension: 'jpg',
          filename: 'some-filename1-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=249',
          size: 0
        }},
        title: 'Panorama',
        type: 'SPHERICAL',
        webFile: { create: {
          extension: 'jpg',
          filename: 'some-filename1-web.jpg',
          path: 'https://picsum.photos/1280/960?image=249',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPanorama({ data: {
        file: { create: {
          extension: 'jpg',
          filename: 'some-filename1.jpg',
          path: 'https://picsum.photos/1280/960?image=1081',
          size: 0
        }},
        hfov: 280,
        initialHorizontalAngle: -15,
        initialVerticalAngle: 0,
        initialZoom: 80,
        realEstate: { connect: { id: fourthStepData.realEstateId1 } },
        thumb: { create: {
          extension: 'jpg',
          filename: 'some-filename1-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=1081',
          size: 0
        }},
        title: 'Another Panorama',
        type: 'SPHERICAL',
        webFile: { create: {
          extension: 'jpg',
          filename: 'some-filename1-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1081',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createVideo({ data: {
        appearance: 'Always',
        label: 'Example URL Video',
        realEstate: { connect: { id: fourthStepData.realEstateId1 } },
        type: 'URL',
        url: 'http://proba.veewme.com/public/static/video/promo.mp4'
      }}, '{ id }'),
      prisma.mutation.createVideo({ data: {
        appearance: 'Branded',
        category: 'Neighborhoods',
        embeddedCode: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0"></iframe>',
        label: 'Example Embedded Video',
        realEstate: { connect: { id: fourthStepData.realEstateId1 } },
        type: 'Embed'
      }}, '{ id }')
    ]).catch((err: Error) => {
      console.log(err)
    })
  }
  if (fourthStepData.realEstateId2) {
    Promise.all([
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename8.jpg',
          path: 'https://picsum.photos/1280/960?image=42',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId2 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename8-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=42',
          size: 0
        }},
        title: 'Lorem ipsum',
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename8-web.jpg',
          path: 'https://picsum.photos/1280/960?image=42',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename2.jpg',
          path: 'https://picsum.photos/1280/960?image=1040',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId2 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename2-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=1040',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename2-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1040',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename9.jpg',
          path: 'https://picsum.photos/1280/960?image=378',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId2 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename9-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=378',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename9-web.jpg',
          path: 'https://picsum.photos/1280/960?image=378',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename10.jpg',
          path: 'https://picsum.photos/1280/960?image=305',
          size: 0
        }},
        hidden: true,
        realEstateId: { connect: { id: fourthStepData.realEstateId2 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename10-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=305',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename10-web.jpg',
          path: 'https://picsum.photos/1280/960?image=305',
          size: 0
        }}
      }}, '{ id }')
    ]).catch((err: Error) => {
      console.log(err)
    })
  }
  if (fourthStepData.realEstateId3) {
    Promise.all([
      prisma.mutation.createPhoto({ data: {
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename11.jpg',
          path: 'https://picsum.photos/1280/960?image=311',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId3 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename11-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=311',
          size: 0
        }},
        title: 'Lorem ipsum',
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename11-web.jpg',
          path: 'https://picsum.photos/1280/960?image=311',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename2.jpg',
          path: 'https://picsum.photos/1280/960?image=1040',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId3 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename2-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=1040',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename2-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1040',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename12.jpg',
          path: 'https://picsum.photos/1280/960?image=230',
          size: 0
        }},
        realEstateId: { connect: { id: fourthStepData.realEstateId3 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename12-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=230',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename12-web.jpg',
          path: 'https://picsum.photos/1280/960?image=230',
          size: 0
        }}
      }}, '{ id }'),
      prisma.mutation.createPhoto({ data: {
        featured: true,
        fileId: { create: {
          extension: 'jpg',
          filename: 'some-filename13.jpg',
          path: 'https://picsum.photos/1280/960?image=1065',
          size: 0
        }},
        hidden: true,
        realEstateId: { connect: { id: fourthStepData.realEstateId3 } },
        thumbId: { create: {
          extension: 'jpg',
          filename: 'some-filename13-thumb.jpg',
          path: 'https://picsum.photos/640/480?image=305',
          size: 0
        }},
        webFileId: { create: {
          extension: 'jpg',
          filename: 'some-filename13-web.jpg',
          path: 'https://picsum.photos/1280/960?image=1065',
          size: 0
        }}
      }}, '{ id }')
    ]).catch((err: Error) => {
      console.log(err)
    })
  }
  return fourthStepData
}

firstStepSeed().then(secondStepSeed).then(thirdStepSeed).then(fourthStepSeed).catch((err: Error) => { console.log(err) })
