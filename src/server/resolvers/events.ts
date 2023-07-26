import { EventOrderByInput } from '#veewme/gen/graphqlTypes'
import * as PrismaTypes from '#veewme/gen/prisma'
import { prisma } from '#veewme/gen/prisma'
import { UserInputError } from 'apollo-server-express'
import { ResolversRequired } from '../graphqlServer'

export const Event: ResolversRequired['Event'] = {
  orderedServices: parent => prisma.event({ eventId: parent.eventId }).orderedServices(),
  photographer: parent => prisma.event({ eventId: parent.eventId }).photographer()
}

export const event: ResolversRequired['Query']['event'] = async (_, args) => {
  const eventObj = await prisma.event({ eventId: args.where.id })
  if (!eventObj) throw new UserInputError('Event not found')
  return eventObj
}

export const events: ResolversRequired['Query']['events'] = async (_, args, context) => {
  const orderBy: EventOrderByInput = args.orderBy || 'createdAt_DESC'
  return context.prismaBinding.query.events({ orderBy, ...args })
}

/** Recalculate statusScheduled for orders connected with given ordered services. */
const updateOrderStatusScheduled = async (orderedServicesIds: number[]) => {
  // Get the list of modified orders; group by order ID as mutation can accept different OrderedService IDs from
  // different orders.
  const orders = new Map<number, PrismaTypes.Order>()
  for (const orderedServiceId of orderedServicesIds) {
    const orderObj = await prisma.orderedService({ id: orderedServiceId }).orderId()
    if (!orders.has(orderObj.id)) {
      orders.set(orderObj.id, orderObj)
    }
  }

  // For each order, query all its ordered services and check if all of them have scheduled events.
  for (const orderObj of orders.values()) {
    const orderedServicesWithoutEvents = await prisma.orderedServices({
      where: { AND: [{ orderId: { id: orderObj.id } }, { event: null }] }
    })
    const newStatusScheduled = orderedServicesWithoutEvents.length === 0
    if (orderObj.statusScheduled !== newStatusScheduled) {
      await prisma.updateOrder({ where: { id: orderObj.id }, data: { statusScheduled: newStatusScheduled } })
    }
  }
}

export const createEvent: ResolversRequired['Mutation']['createEvent'] = async (_, args) => {
  const { photographerId, orderedServices, ...data } = args.data
  let assignServices
  if (orderedServices) {
    const ids = orderedServices.map(serviceId => ({ id: serviceId }))
    assignServices = { connect: ids }
  }

  const eventObj = await prisma.createEvent({
    ...data,
    orderedServices: assignServices,
    photographer: { connect: { id: photographerId } }
  })

  if (orderedServices) {
    await updateOrderStatusScheduled(orderedServices)
  }
  return eventObj
}

export const updateEvent: ResolversRequired['Mutation']['updateEvent'] = async (_, args) => {
  const { addOrderedServices, photographerId, removeOrderedServices, ...data } = args.data

  const eventPhotographer = await prisma.event({ eventId: args.where.id }).photographer()

  let photographer
  if (eventPhotographer && photographerId === null) {
    photographer = { disconnect: true }
  } else if (photographerId) {
    photographer = { connect: { id: photographerId } }
  }

  const addServicesIds = addOrderedServices ? addOrderedServices.map(id => ({ id })) : []
  const removeServicesIds = removeOrderedServices ? removeOrderedServices.map(id => ({ id })) : []

  const eventObj = await prisma.updateEvent({
    data: {
      ...data,
      orderedServices: { connect: addServicesIds, disconnect: removeServicesIds },
      photographer
    },
    where: { eventId: args.where.id }
  })

  let changedOrderedServices: number[] = []
  if (addOrderedServices) {
    changedOrderedServices = changedOrderedServices.concat(addOrderedServices)
  }
  if (removeOrderedServices) {
    changedOrderedServices = changedOrderedServices.concat(removeOrderedServices)
  }
  await updateOrderStatusScheduled(changedOrderedServices)
  return eventObj
}

export const deleteEvent: ResolversRequired['Mutation']['deleteEvent'] = async (_, args) => {
  // Get all the associate ordered services, in order to update the statusScheduled value after event removal.
  const orderedServices = await prisma.event({ eventId: args.where.id }).orderedServices()
  const eventObj = await prisma.deleteEvent({ eventId: args.where.id })
  if (orderedServices) {
    await updateOrderStatusScheduled(orderedServices.map(obj => obj.id))
  }
  return eventObj
}
