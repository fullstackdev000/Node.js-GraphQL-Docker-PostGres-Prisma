// import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import moment from 'moment'
import React from 'react'
import { useToasts } from 'react-toast-notifications'
import Calendar from './calendar'
import eventsReducer, {
  ADD_EVENT,
  EDIT_EVENT,
  LOAD_EVENTS,
  REMOVE_EVENT
} from './eventsReducer'
import { checkOverlap, getPhotographerColor, getPhotographerFullName } from './helpers'
import Toolbar from './toolbar'
import { CalendarPhotographer, DateClickData, EventData, EventDelta, PhotographerEventData, RawEventData, Regions, Services, Settings } from './types'

interface CalendarExtendedProps {
  photographers: CalendarPhotographer[]
  events: EventData[]
  addingMultipleEvents?: boolean
  onAddEvent: (values: Omit<RawEventData, 'eventId'>) => Promise<RawEventData['eventId'] | undefined>
  onEditEvent: (values: EventDelta) => void
  onRemoveEvent: (values: RawEventData['eventId']) => void
  onSettingsUpdate?: (values: Settings) => void
  allEditable?: boolean
  services?: Services
  defaultEventTitle?: string
  defaultDate?: string
  regions: Regions
  settings: Settings
  photographerNote?: string
}

const CalendarExtended: React.FunctionComponent<CalendarExtendedProps> = props => {
  const { addToast } = useToasts()
  const [events, dispatch] = React.useReducer(eventsReducer, props.events)
  const [photographers, setPhotographers] = React.useState<CalendarPhotographer[]>(props.photographers)
  const [timezone, setTimezone] = React.useState<string>('local')

  const [region, setRegion] = React.useState(1) // just mock initial region id
  const filteredEvents = React.useMemo(
    () => events.filter(e => {
      const eventPhotographerId = e.photographer.id
      const photographer = photographers.find(p => p.id === eventPhotographerId)
      const showEvent = photographer && photographer.checked
      return showEvent
    }),
    [events, photographers]
  )

  React.useEffect(() => {

    dispatch({
      payload: props.events,
      type: LOAD_EVENTS
    })
  }, [props.events])

  const showOverlapAlert = (name: string = 'Unknown') => addToast(`Events of ${name} overlap.`, { appearance: 'error', autoDismiss: true })

  const handleAddEvent = async (eventData: DateClickData, photographerData: PhotographerEventData) => {
    const color = getPhotographerColor(photographerData.photographerId, photographers)
    const durationMinutes = photographerData.totalEventDurationMinutes
    // object with mutation variables that probably will be sent to backend
    const mutationVariables: Omit<RawEventData, 'eventId'> = {
      allDay: eventData.allDay,
      orderedServices: photographerData.orderedServices,
      photographer: {
        id: photographerData.photographerId
      },
      privateNote: photographerData.privateNote,
      publicNote: photographerData.publicNote,
      start: eventData.date,
      title: photographerData.title,
      vacation: photographerData.vacation
    }

    if (durationMinutes) {
      mutationVariables.end = moment(mutationVariables.start).add(durationMinutes, 'm').toISOString()
    }

    const eventId = await props.onAddEvent(mutationVariables)
    if (!eventId) {
      addToast(`Something went wrong.`, { appearance: 'error', autoDismiss: true })
      return
    }
    // object with data required to updated state after adding new event
    const combinedData = {
      ...mutationVariables,
      color,
      editable: true,
      // event id will be read from API response
      eventId
    }
    dispatch({
      payload: combinedData,
      type: ADD_EVENT
    })
    const overlap = checkOverlap(events, combinedData)
    if (overlap) {
      const photographerName = getPhotographerFullName(photographers, combinedData.photographer.id)
      showOverlapAlert(photographerName)
    }
  }

  const handleRemoveEvent = (id: EventData['eventId']) => {
    dispatch({
      payload: id,
      type: REMOVE_EVENT
    })
    props.onRemoveEvent(id)
  }

  const handleEdit = (eventDelta: EventDelta) => {
    const photographer = eventDelta.photographer
    const deltaCopy = {
      ...eventDelta
    }
    const color = photographer && getPhotographerColor(photographer.id, photographers)
    if (color) {
      deltaCopy.color = color
    }
    const durationMinutes = eventDelta.totalEventDurationMinutes
    if (durationMinutes) {
      deltaCopy.end = moment(eventDelta.start).add(durationMinutes, 'm').toISOString()
    }
    dispatch({
      payload: deltaCopy,
      type: EDIT_EVENT
    })

    props.onEditEvent(deltaCopy)
    const currentEvent = events.find(e => e.eventId === deltaCopy.eventId)
    if (currentEvent) {
      const currentEventComplete = {
        ...currentEvent,
        ...deltaCopy
      }
      const overlap = checkOverlap(events, currentEventComplete)
      if (overlap) {
        const photographerName = getPhotographerFullName(photographers, currentEventComplete.photographer.id)
        showOverlapAlert(photographerName)
      }
    }
  }

  return (
    <>
      <Panel>
        <Toolbar
          photographers={photographers}
          setPhotographers={photoData => setPhotographers(photoData)}
          regions={props.regions}
          regionId={region}
          setRegion={id => setRegion(id)}
          timezone={timezone}
          setTimezone={tz => setTimezone(tz)}
        />
        <Calendar
          allEditable={props.allEditable}
          events={filteredEvents}
          onAddEvent={handleAddEvent}
          photographers={photographers}
          disableAddingEvents={!props.addingMultipleEvents}
          onRemoveEvent={handleRemoveEvent}
          onEdit={handleEdit}
          timeZone={timezone}
          services={props.services}
          defaultEventTitle={props.defaultEventTitle}
          defaultDate={props.defaultDate}
          photographerNote={props.photographerNote}
          {...props.settings}
        />
      </Panel>
    </>
  )
}

export default CalendarExtended
