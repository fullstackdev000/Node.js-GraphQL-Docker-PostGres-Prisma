import eventsReducer, {
  ADD_EVENT,
  AddAction,
  EDIT_EVENT,
  EditAction,
  LOAD_EVENTS,
  LoadAction,
  REMOVE_EVENT,
  RemoveAction
} from './eventsReducer'
import { assignPhotographersColorsToEvents, initializePhotographersData } from './helpers'
import { mockEvents, mockPhotographers } from './mockData'
import { EventData } from './types'

let events: EventData[] = []
describe('Events reducer tests', () => {
  beforeEach(() => {
    const photographersWithColors = initializePhotographersData(mockPhotographers)
    events = assignPhotographersColorsToEvents(mockEvents, photographersWithColors)

    jest.clearAllMocks()
  })

  it('Handles LOAD_EVENTS action', () => {
    const action: LoadAction = {
      payload: events,
      type: LOAD_EVENTS
    }
    const result = eventsReducer([], action)

    expect(result).toEqual(events)

  })

  it('Handles REMOVE_EVENT action', () => {
    const action: RemoveAction = {
      payload: 2,
      type: REMOVE_EVENT
    }
    const result = eventsReducer(events, action)

    expect(result.length).toEqual(events.length - 1)
    expect(result.some(e => e.eventId === 2)).toBe(false)
  })

  it('Handles ADD_EVENT action', () => {
    const action: AddAction = {
      payload: {
        allDay: true,
        color: '#aaa',
        editable: true,
        eventId: 3,
        photographer: {
          id: 1
        },
        privateNote: 'priv',
        publicNote: 'pub',
        start: '2021-05-30T13:00:00.000Z',
        title: 'Ipsum'
      },
      type: ADD_EVENT
    }
    const result = eventsReducer(events, action)

    const expectedResult = events.concat(action.payload)

    expect(result).toEqual(expectedResult)
    const lastItem = result[result.length - 1]
    expect(lastItem).toEqual(action.payload)

    expect(lastItem.title).toBe('Ipsum')

  })

  it('Handles EDIT_EVENT action', () => {
    let action: EditAction = {
      payload: {
        eventId: 3,
        privateNote: 'abc',
        publicNote: 'xyz',
        start: '2021-06-30T14:50:00.000Z',
        title: 'ABC'
      },
      type: EDIT_EVENT
    }
    let result = eventsReducer(events, action)

    let editedEvent = result.find(ev => ev.eventId === 3)
    let originalEvent = events.find(ev => ev.eventId === 3)
    expect(editedEvent).toEqual({
      ...originalEvent,
      privateNote: 'abc',
      publicNote: 'xyz',
      start: '2021-06-30T14:50:00.000Z',
      title: 'ABC'
    })

    action = {
      payload: {
        end: '2022-06-31T15:50:00.000Z',
        eventId: 4,
        publicNote: '-',
        start: '2022-06-31T12:50:00.000Z',
        title: 'ABC'
      },
      type: EDIT_EVENT
    }
    result = eventsReducer(events, action)

    editedEvent = result.find(ev => ev.eventId === 4)
    originalEvent = events.find(ev => ev.eventId === 4)
    expect(editedEvent).toEqual({
      ...originalEvent,
      end: '2022-06-31T15:50:00.000Z',
      eventId: 4,
      publicNote: '-',
      start: '2022-06-31T12:50:00.000Z',
      title: 'ABC'
    })

  })

})
