import { UnreachableCaseError } from '#veewme/lib/error'
import { EventData, EventDelta } from './types'

export const ADD_EVENT = 'ADD_EVENT'
export interface AddAction {
  type: typeof ADD_EVENT,
  payload: EventData
}

export const REMOVE_EVENT = 'REMOVE_EVENT'
export interface RemoveAction {
  type: typeof REMOVE_EVENT,
  payload: EventData['eventId']
}

export const EDIT_EVENT = 'EDIT_EVENT'
export interface EditAction {
  type: typeof EDIT_EVENT,
  payload: EventDelta
}

export const LOAD_EVENTS = 'LOAD_EVENTS'
export interface LoadAction {
  type: typeof LOAD_EVENTS,
  payload: EventData[]
}

type EventAction = AddAction | RemoveAction | EditAction | LoadAction

const eventsReducer = (events: EventData[], action: EventAction) => {
  switch (action.type) {
    case ADD_EVENT:
      return events.concat(action.payload)
    case REMOVE_EVENT:
      return events.filter(e => e.eventId !== action.payload)
    case EDIT_EVENT:
      return events.map(e => {
        if (e.eventId === action.payload.eventId) {
          return {
            ...e,
            ...action.payload
          }
        } else {
          return e
        }
      })
    case LOAD_EVENTS:
      return action.payload
    default:
      throw new UnreachableCaseError(action)
  }
}

export default eventsReducer
