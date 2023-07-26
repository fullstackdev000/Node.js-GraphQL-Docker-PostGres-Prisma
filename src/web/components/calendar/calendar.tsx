/* tslint:disable:no-implicit-dependencies */
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import '@fullcalendar/core/main.css'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@fullcalendar/daygrid/main.css'
import interactionPlugin from '@fullcalendar/interaction'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import '@fullcalendar/timegrid/main.css'
import moment from 'moment'
import React from 'react'
import EventModal from './addEventModal'
import DateWarningModal from './dateClickWarning'
import DeleteWarningModal from './deleteWarning'
import { useWeather } from './helpers'
import NotifyModal from './notifyModal'
import { DateClickData, EventData, EventDelta, InfoEvent, Photographer, PhotographerEventData, Services, Settings } from './types'

const CalendarStyled = styled.div`
  .fc-header-toolbar {
    font-size: 13px;

    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
      .fc-left {
        width: 320px;
      }
    }
  }

  .event-disabled {
    opacity: 0.5;
    filter: blur(1px);
  }

  .fc-event:hover {
    .cal-event-remove {
      display: block;
    }
  }

  .fc-content {
    padding-bottom: 5px;
  }

  .fc-time-grid {
    .cal-weather {
      display: none;
    }
  }

  .fc-timeGrid-view .fc-day-grid .fc-row .fc-content-skeleton {
    padding-bottom: 100px;
  }

  .fc-day-grid {
    .fc-day {
      position: relative;

      .cal-weather {
        width: 100px;
        height: 100px;
        position: absolute;
        bottom: 0;
        margin-left: 50%;
        left: -50px;
      }

      @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
        .cal-weather {
          width: 70px;
          height: 70px;
          left: -35px;
        }
      }
    }
  }

  .fc-time-grid .fc-event-container {
    margin-right: 17px !important;;
  }

  .cal-event-remove {
    display: none;
    position: absolute;
    top: 2px;
    right: 2px;
    height: 14px;
    width: 14px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 25px;
    font-weight: 500;
    text-align: center;
    line-height: 15px;
    color: ${props => props.theme.colors.LABEL_TEXT};
    z-index: 100;
  }
`

interface IconsPathsMap {
  [key: string]: string
}

const mapOpenweatherIcons: IconsPathsMap = {
  '01d': '0001_sunny',
  '02d': '0002_sunny_intervals',
  '03d': '0003_white_cloud',
  '04d': '0004_black_low_cloud',
  '09d': '0009_light_rain_showers',
  '10d': '0010_heavy_rain_showers',
  '11d': '0024_thunderstorms',
  '13d': '0019_cloudy_with_light_snow',
  '50d': '0006_mist'
}

interface CalendarProps extends Settings {
  events: EventData[]
  onAddEvent: (eventData: DateClickData, photographerData: PhotographerEventData) => void
  photographers: Photographer[]
  disableAddingEvents?: boolean
  onRemoveEvent: (id: EventData['eventId']) => void
  onEdit: (event: EventDelta) => void
  allEditable?: boolean
  timeZone: string
  services?: Services
  defaultEventTitle?: string
  defaultDate?: string
  photographerNote?: string
}

const Calendar: React.FunctionComponent<CalendarProps> = props => {
  const [eventModalVisible, toggleEventModal] = React.useState(false)
  const [dateClickWarningVisible, toggleDateClickWarning] = React.useState(false)
  const [eventEditModalVisible, toggleEventEditModal] = React.useState(false)
  const [deleteModalVisible, toggleDeleteModal] = React.useState(false)
  const [showNotifyModal, toggleNotifyModal] = React.useState(false)
  const [tempEvent, saveTempEvent] = React.useState<DateClickData>()
  const [editedEventId, setEditedEventId] = React.useState<number>()
  const weatherData = useWeather(!props.showWeather)

  const eventIdToRemove = React.useRef<number>(-1)
  const eventRemoveBtns = React.useRef<HTMLElement[]>([])

  const editedEvent = React.useMemo(() => props.events.find(e => e.eventId === editedEventId), [props.events, editedEventId])

  const handleDateClick = (event: DateClickData) => {
    if (props.disableAddingEvents) {
      toggleDateClickWarning(true)
      return
    }
    toggleEventModal(true)
    saveTempEvent(event)
    log.debug('Date click', event)
  }

  const addEvent = (photographerData: PhotographerEventData) => {
    if (tempEvent) {
      props.onAddEvent(tempEvent, photographerData)
      saveTempEvent(undefined)
    }
    toggleEventModal(false)
  }

  const showDeleteModal = (e: MouseEvent) => {
    // https://stackoverflow.com/a/50326668
    if (e.target instanceof HTMLSpanElement) {
      const id = e.target.getAttribute('data-event-id')
      eventIdToRemove.current = Number(id)
      toggleDeleteModal(true)
    }

  }

  React.useEffect(() => () => {
    log.debug('Calendar unmount')
    eventRemoveBtns.current.forEach(el => el.removeEventListener('click', showDeleteModal))
  }, [])

  const handleEdit = (event: InfoEvent) => {
    props.onEdit({
      allDay: event.allDay,
      end: event.end ? event.end : undefined,
      eventId: event.extendedProps.eventId,
      start: event.start ? event.start : new Date()
    })
  }

  return (
    <>
      <CalendarStyled>
        <FullCalendar
          height='auto'
          defaultDate={props.defaultDate}
          eventTimeFormat={{
            hour: 'numeric',
            hour12: props.time12h,
            minute: '2-digit'
          }}
          slotLabelFormat={{
            hour: 'numeric',
            hour12: props.time12h,
            meridiem: 'short',
            minute: '2-digit',
            omitZeroMinute: true
          }}
          businessHours={props.businessDayHours}
          defaultView='timeGridWeek'
          header={{
            center: 'title',
            left: ' ',
            right: 'prev,next today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          plugins={[momentTimezonePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
          events={props.events}
          dateClick={handleDateClick}
          eventRender={info => {
            // vacation stripes
            if (info.event.extendedProps.vacation) {
              const color = info.event.backgroundColor
              const contentEl = info.el.querySelector('.fc-content') as HTMLElement
              if (contentEl) {
                contentEl.style.backgroundColor = info.event.backgroundColor
              }

              info.el.style.background = `repeating-linear-gradient(-45deg,
                ${color} 0 15px,
                black 15px 18px)`
            }
            if (!info.event.startEditable && !props.allEditable) {
              info.el.classList.add('event-disabled')
              return
            }
            const removeBtnEl = document.createElement('span')
            removeBtnEl.innerHTML = '&times;'
            removeBtnEl.className = 'cal-event-remove'
            info.el.appendChild(removeBtnEl)
            const eventId = info.event.extendedProps.eventId
            removeBtnEl.setAttribute('data-event-id', eventId)
            eventRemoveBtns.current.push(removeBtnEl)

            removeBtnEl.addEventListener('click', showDeleteModal)
          }}
          dayRender={dayData => {
            if (!weatherData || !props.showWeather) {
              return
            }
            const dayDate = moment(dayData.date).utc()
            const dayWeather = weatherData.daily.find(weather => {
              const date = moment.unix(weather.dt)
              return date.isSame(dayDate, 'day')
            })

            if (dayWeather) {
              const iconEl = document.createElement('img')
              const customIcon = mapOpenweatherIcons[dayWeather.weather[0].icon]
              const iconUrl = `/public/static/img/weather-icons/${customIcon}.png`
              iconEl.setAttribute('src', iconUrl)
              iconEl.className = 'cal-weather'
              dayData.el.appendChild(iconEl)
            }

          }}
          eventResize={info => handleEdit(info.event)}
          eventDrop={info => {
            handleEdit(info.event)
            toggleNotifyModal(true)
          }}
          eventClick={info => {
            if (!info.event.startEditable && !props.allEditable) {
              return
            }

            setEditedEventId(info.event.extendedProps.eventId)
            toggleEventEditModal(true)
          }}
          editable={props.allEditable}
          timeZone={props.timeZone}
          firstDay={props.firstDay}
          minTime={props.showBusinessHours ? '00:00:00' : props.businessDayHours.startTime}
          maxTime={props.showBusinessHours ? '24:00:00' : props.businessDayHours.endTime}
        />
      </CalendarStyled>
      {
        showNotifyModal && <NotifyModal
          isOpen={showNotifyModal}
          onRequestClose={() => toggleNotifyModal(false)}
          onSubmit={values => {
            log.debug('Notify:', values)
            toggleNotifyModal(false)
          }}
        />
      }
      {
        tempEvent && <EventModal
          isOpen={eventModalVisible}
          photographerNote={props.photographerNote}
          date={tempEvent.date}
          onRequestClose={() => toggleEventModal(false)}
          onSubmit={addEvent}
          photographers={props.photographers}
          allDay={tempEvent.allDay}
          title='Add Event'
          timeZone={props.timeZone}
          services={props.services}
          initialData={{
            title: props.defaultEventTitle
          }}
        />
      }
      {
        editedEvent && <EventModal
          isOpen={eventEditModalVisible}
          date={editedEvent.start}
          onRequestClose={() => toggleEventEditModal(false)}
          onSubmit={({
            orderedServices,
            photographerId,
            privateNote,
            publicNote,
            title,
            totalEventDurationMinutes,
            vacation
          }) => {
            props.onEdit({
              eventId: editedEvent.eventId,
              orderedServices,
              photographer: {
                id: photographerId
              },
              privateNote,
              publicNote,
              start: editedEvent.start,
              title,
              totalEventDurationMinutes,
              vacation
            })
            toggleEventEditModal(false)
            setEditedEventId(undefined)
            log.debug(orderedServices)
          }}
          photographers={props.photographers}
          allDay={editedEvent.allDay}
          title='Edit Event'
          initialData={{
            photographerId: editedEvent.photographer.id,
            privateNote: editedEvent.privateNote,
            publicNote: editedEvent.publicNote,
            title: editedEvent.title,
            vacation: !!editedEvent.vacation
          }}
          timeZone={props.timeZone}
          services={props.services}
          eventId={editedEvent.eventId}
        />
      }
      <DateWarningModal
        isOpen={dateClickWarningVisible}
        onRequestClose={() => toggleDateClickWarning(false)}
      />
      <DeleteWarningModal
        isOpen={deleteModalVisible}
        onRequestClose={() => toggleDeleteModal(false)}
        onDelete={() => {
          props.onRemoveEvent(eventIdToRemove.current)
          toggleDeleteModal(false)
        }}
      />
    </>
  )
}

export default Calendar
