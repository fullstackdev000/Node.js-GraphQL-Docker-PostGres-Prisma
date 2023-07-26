import gql from 'graphql-tag'

export const CalendarPhotographers = gql`
  query CalendarPhotographers {
    photographers {
      id
      region {
        id
        label
      }
      user {
        firstName
        lastName
      }
    }
  }
`

export const Events = gql`
  query Events(
    $where: EventWhereInput
  ) {
    events(
      where: $where
    ) {
      eventId
      title
      allDay
      start
      end
      photographer {
        id
      }
      privateNote
      publicNote
      vacation
      orderedServices {
        id
        orderId
        event {
          eventId
        }
        service {
          id

        }
      }
    }
  }
`

export const Event = gql`
  query Event($eventId: Int!) {
    event(where: {
      id: $eventId
    }) {
      eventId
      title
      allDay
      start
      end
      photographer {
        id
      }
      privateNote
      publicNote
      vacation
      orderedServices {
        id
        orderId
        event {
          eventId
          start
        }
        service {
          id
          duration
          durationUnit
          name
          serviceType
          category {
            id
            color { r g b a }
            label
            icon
          }
        }
      }
    }
  }
`

export const CreateEvent = gql`
  mutation createEvent(
    $start: DateTime!
    $title: String
    $end: DateTime
    $allDay: Boolean
    $privateNote: String
    $publicNote: String
    $photographerId: Int
    $orderedServices: [Int!]
    $vacation: Boolean
  ) {
    createEvent(data: {
      start: $start
      title: $title
      end: $end
      allDay: $allDay
      privateNote: $privateNote
      publicNote: $publicNote
      photographerId: $photographerId
      orderedServices: $orderedServices
      vacation: $vacation
    }) {
      eventId
    }
  }
  `

export const UpdateEvent = gql`
  mutation updateEvent(
    $eventId: Int!
    $start: DateTime
    $title: String
    $end: DateTime
    $allDay: Boolean
    $privateNote: String
    $publicNote: String
    $photographerId: Int
    $addOrderedServices: [Int!]
    $removeOrderedServices: [Int!]
    $vacation: Boolean
  ) {
    updateEvent(data: {
      start: $start
      title: $title
      end: $end
      allDay: $allDay
      privateNote: $privateNote
      publicNote: $publicNote
      photographerId: $photographerId
      addOrderedServices: $addOrderedServices
      removeOrderedServices: $removeOrderedServices
      vacation: $vacation
    }
    where: {
      id: $eventId
    }) {
      eventId
    }
  }
  `

export const DeleteEvent = gql`
    mutation DeleteEvent(
      $eventId: Int!
    ) {
      deleteEvent(where: {
        id: $eventId
      }) {
        eventId
      }
    }
  `

export const EventOrder = gql`
  query EventOrder($id: Int!) {
    order: orderWithFlatennedServices(where: {
      id: $id
    }) {
      id
      notesForPhotographer
      prefferedShootTime
      realEstate {
        address
        id
        city
        street
        state
      }
      services {
        id
        orderId
        event {
          eventId
          start
        }
        service {
          id
          duration
          durationUnit
          name
          serviceType
          category {
            id
            color { r g b a }
            label
            icon
          }
        }
      }
    }
  }
`

export const JobsReport = gql`
  query JobsReport(
    $where: EventWhereInput
  ) {
    events(
      where: $where
    ) {
      eventId
      title
      allDay
      start
      end
      photographer {
        id
        user {
          firstName
          lastName
        }
      }
      privateNote
      publicNote
      orderedServices {
        id
        orderId
        order {
          id
          realEstate {
            id
            address
            agentPrimary {
              id
              user {
                firstName
                lastName
              }
              phone
              brokerage { companyName }
            }
          }
        }
        event {
          eventId
        }
        service {
          id
          name
        }
      }
    }
  }
`
