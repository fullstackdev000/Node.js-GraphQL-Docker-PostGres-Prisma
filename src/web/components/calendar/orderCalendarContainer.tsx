import {
  CalendarMeQuery,
  CalendarPhotographersQuery,
  CreateEventMutation,
  CreateEventMutationVariables,
  DeleteEventMutationVariables,
  EventOrderQuery,
  EventOrderQueryVariables,
  EventsQuery,
  Region,
  UpdateEventMutationVariables
} from '#veewme/gen/graphqlTypes'
import {
  CalendarMe,
  CalendarPhotographers,
  CreateEvent,
  DeleteEvent,
  EventOrder,
  Events,
  UpdateEvent
} from '#veewme/lib/graphql/queries'

import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ApolloError, NetworkStatus } from 'apollo-client'
import moment from 'moment'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Calendar from './calendarExtended'
import { assignPhotographersColorsToEvents, convertEventDeltaToMutationVariables, defaultSettingsValues, initializePhotographersData } from './helpers'
import { CalendarHeader, PrefrredShootTime, Wrapper } from './styled'
import { Settings } from './types'

import Exclamation from '#veewme/web/assets/svg/exclamation.svg'

export interface RouteState {
  totalEventDurationMinutes: number
}

interface PhotographersData {
  photographers: NoNullableArrayItems<NoNullableFields<CalendarPhotographersQuery['photographers']>>
}

type OrderData = NoNullableFields<EventOrderQuery>

interface EventsData {
  events: NoNullableArrayItems<NoNullableFields<EventsQuery['events']>>
}

type MeData = NoNullableFields<CalendarMeQuery>

const OrderCalendarContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const { orderId } = useParams<{
    orderId: string
  }>()

  const showErrorToast = (error: ApolloError) => {
    addToast(error.message, {
      appearance: 'error',
      autoDismiss: true,
      autoDismissTimeout: 10000
    })
  }

  const { data: orderData, loading: loadingOrders, refetch: refetchOrder } = useQuery<OrderData, EventOrderQueryVariables>(EventOrder,
    {
      onError: showErrorToast,
      variables: {
        id: Number(orderId)
      }
    }
  )

  const { data: photographersData, loading: loadingPhotographers } = useQuery<PhotographersData>(CalendarPhotographers,
    {
      onError: showErrorToast
    }
  )

  const { data, loading: loadingEvents, refetch, networkStatus } = useQuery<EventsData>(Events,
    {
      notifyOnNetworkStatusChange : true,
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

  const [createEvent, { loading: addingEvent }] = useMutation<CreateEventMutation, CreateEventMutationVariables>(
    CreateEvent,
    {
      awaitRefetchQueries: true,
      onError: error => {
        addToast(
          `Error ${error.message} occured.`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: ['EventOrder']
    }
  )

  const [updatingServices, setUpdatingServices] = React.useState(false)

  const [updateEvent] = useMutation<{}, UpdateEventMutationVariables>(
    UpdateEvent,
    {
      onError: showErrorToast
    }
  )

  const [deleteEvent, { loading: deleting }] = useMutation<{}, DeleteEventMutationVariables>(
    DeleteEvent,
    {
      awaitRefetchQueries: true,
      onError: err => {
        showErrorToast(err)
        refetch().catch(e => log.debug(e))
      },
      refetchQueries: ['EventOrder']
    }
  )

  const photographersWithColors = useMemo(() => {
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

  const events = useMemo(
    () => {
      if (!data) {
        return []
      }

      const formattedEvents = data.events.map(e => ({
        ...e,
        editable: e.orderedServices && e.orderedServices.length ? e.orderedServices[0].orderId === Number(orderId) : false,
        orderedServices: e.orderedServices.map(s => s.id)
      }))

      return assignPhotographersColorsToEvents(formattedEvents, photographersWithColors)
    },
    [data, photographersWithColors]
  )

  const firstEventDate = React.useMemo(() => {
    let date: string = new Date().toISOString()
    if (orderData) {
      const ev = orderData.order.services[0].event
      if (ev) {
        date = ev.start
      }
    }

    return date
  }, [orderData])

  const loading = loadingPhotographers || loadingEvents || loadingOrders || deleting || updatingServices
  const initalLoad = networkStatus === NetworkStatus.loading || loadingPhotographers || loadingOrders || loadingMe

  return (
    <Wrapper>
      <CalendarHeader>
        {orderData && orderData.order.realEstate.address}
        <PrefrredShootTime>
            <Exclamation />
            <span>Preferred shoot date/time:</span>
            <strong>
              {(orderData && orderData.order.prefferedShootTime) ? moment(orderData.order.prefferedShootTime).format('MM/DD/YYYY | hh:mm a') : '-'}
            </strong>
        </PrefrredShootTime>
      </CalendarHeader>
      {
        !initalLoad &&
          <Calendar
            defaultDate={firstEventDate}
            settings={calendarSettings}
            services={orderData && orderData.order.services}
            events={events}
            photographers={photographersWithColors}
            addingMultipleEvents={true}
            onAddEvent={async values => {
              const start = typeof values.start === 'string' ? values.start : values.start.toISOString()
              const variables: CreateEventMutationVariables = {
                ...values,
                orderedServices: values.orderedServices,
                photographerId: values.photographer.id,
                start
              }

              if (values.end) {
                variables.end = typeof values.end === 'string' ? values.end : values.end.toISOString()
              }

              const res = await createEvent({
                variables
              })

              return res.data && res.data.createEvent.eventId
            }}
            onEditEvent={async values => {
              const prevEventServices = orderData && orderData.order.services || []
              const prevEventServicesIds = prevEventServices
                .filter(s => {
                  if (s.event) {
                    return s.event.eventId === values.eventId
                  } else {
                    return false
                  }
                })
                .map(s => s.id)
              const variables = convertEventDeltaToMutationVariables(values, prevEventServicesIds)
              // Show spinner/loader only when event data is edited via modal - not when event time/duration is edited
              // directly in calendar by dragging/resizing.
              if (values.orderedServices) {
                setUpdatingServices(true)
              }

              await updateEvent({
                variables
              })

              if (values.orderedServices) {
                try {
                  await refetchOrder()
                } finally {
                  setUpdatingServices(false)
                }
              }
            }}
            onRemoveEvent={eventId => deleteEvent({
              variables: {
                eventId
              }
            })}
            onSettingsUpdate={values => log.debug('Settings update', values)}
            allEditable={false}
            defaultEventTitle={orderData && `${orderData.order.realEstate.city} - ${orderData.order.realEstate.street}`}
            regions={regions}
            photographerNote={orderData && orderData.order.notesForPhotographer}
          />
      }
      <DotSpinnerModal isOpen={loading || addingEvent} />
    </Wrapper>
  )
}

export default OrderCalendarContainer
