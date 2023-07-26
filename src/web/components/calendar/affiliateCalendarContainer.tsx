import {
  CalendarMeQuery,
  CalendarPhotographersQuery,
  CreateEventMutation,
  CreateEventMutationVariables,
  DeleteEventMutationVariables,
  EventsQuery,
  Region,
  UpdateEventMutationVariables
} from '#veewme/gen/graphqlTypes'
import {
  CalendarMe,
  CalendarPhotographers,
  CreateEvent,
  DeleteEvent,
  Events,
  UpdateEvent
} from '#veewme/lib/graphql/queries'

import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ApolloError, NetworkStatus } from 'apollo-client'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Calendar from './calendarExtended'
import { assignPhotographersColorsToEvents, convertEventDeltaToMutationVariables, defaultSettingsValues, initializePhotographersData } from './helpers'
import { Wrapper } from './styled'
import { Settings } from './types'

interface PhotographersData {
  photographers: NoNullableArrayItems<NoNullableFields<CalendarPhotographersQuery['photographers']>>
}

interface EventsData {
  events: NoNullableArrayItems<NoNullableFields<EventsQuery['events']>>
}

type MeData = NoNullableFields<CalendarMeQuery>

const AffiliateCalendarContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const location = useLocation()

  const showErrorToast = (error: ApolloError) => {
    addToast(error.message, {
      appearance: 'error',
      autoDismiss: true,
      autoDismissTimeout: 10000
    })
  }

  const { data: photographersData, loading: loadingPhotographers } = useQuery<PhotographersData>(CalendarPhotographers,
    {
      onError: showErrorToast
    }
  )

  const { data: meData, loading: loadingMe } = useQuery<MeData>(CalendarMe)

  let regions: Array<Pick<Region, 'id' | 'label'>> = []

  const calendarSettings: Settings = {
    ...defaultSettingsValues,
    businessDayHours: {
      ...defaultSettingsValues.businessDayHours
    }
  }

  if (meData && meData.me.account.__typename === 'Affiliate') {
    regions = meData.me.account.regions || []

    calendarSettings.businessDayHours.startTime = meData.me.account.calendarStartTime
    calendarSettings.businessDayHours.endTime = meData.me.account.calendarEndTime
    calendarSettings.firstDay = meData.me.account.calendarFirstDay
    calendarSettings.showWeather = meData.me.account.calendarShowWeather
    calendarSettings.showBusinessHours = meData.me.account.calendarShowBusinessHours
    calendarSettings.time12h = meData.me.account.calendarTime12h
  }

  // Because of the bug related to: https://github.com/apollographql/react-apollo/issues/2202
  // when refetching events (e.g. after delete/update mutation error) reference to 'data' is changed
  // before loading new fresh data. In other words, before getting new data the previous data value remains the same but reference to it
  // is changed. As a result Calendar considers it as new data (because uses reference equality comparison) and for a brief moment
  // stale data is visible
  const { data, loading: loadingEvents, refetch, networkStatus } = useQuery<EventsData>(Events,
    {
      notifyOnNetworkStatusChange : true,
      onError: showErrorToast
    }
  )

  const [createEvent, { loading: addingEvent }] = useMutation<CreateEventMutation, CreateEventMutationVariables>(
    CreateEvent,
    {
      onError: error => {
        addToast(
          `Error ${error.message} occured.`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const [updatingServices, setUpdatingServices] = React.useState(false)

  const [updateEvent] = useMutation<{}, UpdateEventMutationVariables>(
    UpdateEvent,
    {
      onError: err => {
        showErrorToast(err)
        refetch().catch(e => log.debug(e))
      }
    }
  )

  const [deleteEvent] = useMutation<{}, DeleteEventMutationVariables>(
    DeleteEvent,
    {
      onError: err => {
        showErrorToast(err)
        refetch().catch(e => log.debug(e))
      }
    }
  )

  const photographersWithColors = React.useMemo(() => {
    if (!photographersData || !photographersData.photographers) {
      return []
    }

    const photographers = photographersData.photographers.map(({ id, user: { firstName, lastName } }) => ({
      firstName,
      id,
      lastName
    }))

    return initializePhotographersData(photographers)

  }, [photographersData])

  const events = React.useMemo(
    () => {
      if (!data) {
        return []
      }

      const formattedEvents = data.events.map(e => ({
        ...e,
        orderedServices: e.orderedServices.map(s => s.id)
      }))

      return assignPhotographersColorsToEvents(formattedEvents, photographersWithColors)
    },
    [data, photographersWithColors]
  )

  const loading = loadingPhotographers || loadingEvents || updatingServices
  const initalLoad = networkStatus === NetworkStatus.loading || loadingPhotographers || loadingMe

  /** TODO: use actual calendar settings from affiliate */
  return (
    <Wrapper>
      {
        !initalLoad &&
          <Calendar
            settings={calendarSettings}
            events={events}
            photographers={photographersWithColors}
            addingMultipleEvents
            onAddEvent={async values => {
              const start = typeof values.start === 'string' ? values.start : values.start.toISOString()
              const res = await createEvent({
                variables: {
                  ...values,
                  photographerId: values.photographer.id,
                  start
                }
              })
              return res.data && res.data.createEvent.eventId
            }}
            onEditEvent={async values => {
              const searchString = location.search.split('?')[1]
              const prevServices = searchString ? searchString.split(',').map(id => Number(id)) : []
              const variables = convertEventDeltaToMutationVariables(values, prevServices)
              if (values.title) {
                setUpdatingServices(true)
              }

              await updateEvent({
                variables
              })
              // Show spinner/loader only when event data is edited via modal - not when event time/duration is edited
              // directly in calendar by dragging/resizing
              if (values.title) {
                setUpdatingServices(false)
              }
            }}
            onRemoveEvent={eventId => deleteEvent({
              variables: {
                eventId
              }
            })}
            onSettingsUpdate={values => log.debug('Settings update', values)}
            allEditable
            regions={regions}
          />
      }
      <DotSpinnerModal isOpen={loading || addingEvent} />
    </Wrapper>
  )
}

export default AffiliateCalendarContainer
