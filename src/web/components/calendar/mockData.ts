import { RawEventData } from './types'

// temp function that can be removed when events API integration is finished
export const getShiftedDate = (days: number, hour: number) => {
  const newDate = new Date()
  newDate.setDate(newDate.getDate() + days)
  newDate.setHours(hour, 0, 0, 0)
  const dayOfWeek = newDate.getDay()
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    newDate.setDate(newDate.getDate() + 2)
  }
  return newDate
}

// replace with fetched Photographers when photographers API is completed
export const mockPhotographers = [{
  firstName: 'John',
  id: 1,
  lastName: 'Smith'
}, {
  firstName: 'Mark',
  id: 2,
  lastName: 'Novak'
}, {
  firstName: 'Justin',
  id: 3,
  lastName: 'Jackson'
}, {
  firstName: 'Elen',
  id: 4,
  lastName: 'Evans'
}, {
  firstName: 'Max',
  id: 5,
  lastName: 'Johanson'
}]

export const mockEvents: RawEventData[] = [{
  allDay: false,
  eventId: 1,
  photographer: mockPhotographers[0],
  start: getShiftedDate(1, 11),
  title: `Event no 1`
}, {
  allDay: false,
  eventId: 2,
  photographer: mockPhotographers[0],
  start: getShiftedDate(4, 12),
  title: `Event no 2`
}, {
  allDay: false,
  eventId: 3,
  photographer: mockPhotographers[1],
  start: getShiftedDate(-2, 15),
  title: `Event no 3`
}, {
  allDay: false,
  eventId: 4,
  photographer: mockPhotographers[1],
  start: getShiftedDate(-1, 11),
  title: `Event no 4`
}, {
  allDay: false,
  eventId: 5,
  photographer: mockPhotographers[1],
  start: getShiftedDate(2, 16),
  title: `Event no 5`
}, {
  allDay: false,
  eventId: 6,
  photographer: mockPhotographers[2],
  start: getShiftedDate(0, 13),
  title: `Event no 6`
}, {
  allDay: false,
  eventId: 7,
  photographer: mockPhotographers[3],
  start: getShiftedDate(5, 14),
  title: `Event no 7`
}]
