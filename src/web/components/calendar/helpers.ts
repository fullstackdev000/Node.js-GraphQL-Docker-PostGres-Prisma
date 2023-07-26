import {
  UpdateEventMutationVariables
} from '#veewme/gen/graphqlTypes'

import { themeColors } from '#veewme/web/common/colors'
import * as log from '#veewme/web/common/log'
import axios from 'axios'
import moment from 'moment'
import * as R from 'ramda'
import * as React from 'react'
import { CalendarPhotographer, EventData, EventDelta, OpenWeatherResponse, Photographer, RawEventData } from './types'

export const fallbackColor = '#aaa'
const defaultEventDurationHour = 1
export const openweatherApiUrl = 'https://api.openweathermap.org/data/2.5/onecall'
// TODO move to circleCI env variables
const openweatherApiKey = 'fe4463330822c6efa2c9832982fce1e8'
/*
  Based on https://stackoverflow.com/a/7419630
*/
const generateRainbowColor = (indexOfRainbowColor: number, numberOfRainbowColors: number) => {
  let r = 0
  let g = 0
  let b = 0
  const h = (indexOfRainbowColor + 1) / numberOfRainbowColors
  const i = ~~(h * 6) // tslint:disable-line
  const f = h * 6 - i
  const q = 1 - f
  switch (i % 6) {
    case 0:
      r = 1
      g = f
      b = 0
      break
    case 1:
      r = q
      g = 1
      b = 0
      break
    case 2:
      r = 0
      g = 1
      b = f
      break
    case 3:
      r = 0
      g = q
      b = 1
      break
    case 4:
      r = f
      g = 0
      b = 1
      break
    case 5:
      r = 1
      g = 0
      b = q
      break
  }
  // tslint:disable-next-line
  const c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2)
  return c
}

// In most cases there will be only 2 - 3 photographers from given region and we want to use our theme colors for them
// if there are more photographers generated rainbow color will be assigned to them
export const PhotographersColors = [themeColors.BLUE, themeColors.GREEN, themeColors.ORANGE]

export const initializePhotographersData = (photographers: Photographer[]): CalendarPhotographer[] =>
  photographers.map((p, i) => ({
    ...p,
    checked: true,
    color: PhotographersColors[i] || generateRainbowColor(i, photographers.length)
  }))

export const assignPhotographersColorsToEvents = (events: RawEventData[], photographers: CalendarPhotographer[]): EventData[] => {
  return events.map(e => {
    const eventPhotographer = photographers.find(p => p.id === e.photographer.id)
    const photographerColor = eventPhotographer ? eventPhotographer.color : fallbackColor

    return {
      ...e,
      color: photographerColor
    }
  })
}

export const getPhotographerColor = (id: CalendarPhotographer['id'], photographers: CalendarPhotographer[]) => {
  const photographer = photographers.find(p => p.id === id)
  return photographer ? photographer.color : fallbackColor
}

export const checkOverlap = (events: EventData[], eventA: EventData) => {
  const res = events.filter(eventB => {
    return eventB.photographer.id === eventA.photographer.id && eventA.eventId !== eventB.eventId
  })
    .some(eventB => {
      const eventAStart = moment(eventA.start)
      const eventAEnd = eventA.end ? moment(eventA.end) : eventAStart.clone().add(defaultEventDurationHour, 'hour')

      const eventBStart = moment(eventB.start)
      const eventBEnd = eventB.end ? moment(eventB.end) : eventBStart.clone().add(defaultEventDurationHour, 'hour')

      const theSameDay = eventAStart.isSame(eventBStart, 'day')
      if (theSameDay && (eventA.allDay || eventB.allDay)) {
        return true
      }
      const startOverlap = eventAStart.isBetween(eventBStart, eventBEnd, 'minute', '[)')
      if (startOverlap) {
        return true
      }
      const endOverlap = eventAEnd.isBetween(eventBStart, eventBEnd, 'minute', '(]')
      if (endOverlap) {
        return true
      }

      const eventBWithinEventATime = eventAStart.isBefore(eventBStart, 'minute') && eventAEnd.isAfter(eventBEnd, 'minute')
      return eventBWithinEventATime
    })
  return res
}

export const getPhotographerFullName = (photographers: Photographer[], id: Photographer['id']) => {
  const photographerData = photographers.find(p => p.id === id)
  const photographerName = photographerData && `${photographerData.firstName} ${photographerData.lastName}`
  return photographerName
}

export const convertEventDeltaToMutationVariables = (eventDelta: EventDelta, prevServicesIds?: number[]) => {
  const variables: UpdateEventMutationVariables = {
    ...eventDelta
  }
  if (eventDelta.start) {
    variables.start = typeof eventDelta.start === 'string' ? eventDelta.start : eventDelta.start.toISOString()
  }

  if (eventDelta.end) {
    variables.end = typeof eventDelta.end === 'string' ? eventDelta.end : eventDelta.end.toISOString()
  }

  if (eventDelta.photographer) {
    variables.photographerId = eventDelta.photographer.id
  }

  if (eventDelta.orderedServices) {
    const prevEventServicesIds = prevServicesIds || []
    const removeOrderedServices = R.difference(prevEventServicesIds, eventDelta.orderedServices)
    const addOrderedServices = R.difference(eventDelta.orderedServices, prevEventServicesIds)

    variables.addOrderedServices = addOrderedServices
    variables.removeOrderedServices = removeOrderedServices
  }

  return variables
}

export const useWeather = (skip: boolean) => {
  const [weatherData, setWeather] = React.useState<OpenWeatherResponse>()
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  React.useEffect(() => {
    // https://stackoverflow.com/a/53572588
    if (skip) {
      return
    }

    const fetchWeather = async () => {
      try {
        const res = await axios.get<OpenWeatherResponse>(openweatherApiUrl, {
          cancelToken: source && source.token,
          params: {
            appid: openweatherApiKey,
            exclude: 'hourly, minutely',
            lat: 44.314842,
            lon: -85.602364
          }
        })
        setWeather(res.data)
      } catch (e) {
        log.debug(e)
      }

    }
    fetchWeather().catch(e => log.debug(e))

    return () => {
      source.cancel('Request has been cancelled')
    }
  }, [])

  return weatherData
}

export const defaultSettingsValues = {
  // format required by FullCalendar
  businessDayHours: {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    endTime: '18:00',
    startTime: '10:00'
  },
  firstDay: 0,
  showBusinessHours: false,
  showWeather: true,
  time12h: true
}
