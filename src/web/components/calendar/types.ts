import {
  EventOrderQuery,
  Region
} from '#veewme/gen/graphqlTypes'
import { NoNullableFields } from '#veewme/web/common/util'
import FullCalendar from '@fullcalendar/react'

type FullCalendarProps = React.ComponentProps<typeof FullCalendar>
type DateClick = NonNullable<FullCalendarProps['dateClick']>
export type DateClickData = Parameters<DateClick>[0]

type EventClick = NonNullable<FullCalendarProps['eventClick']>
export type InfoEvent = Parameters<EventClick>[0]['event']

export interface RawEventData {
  allDay: boolean
  eventId: number // distinguish from FullCalendar 'id' prop
  photographer: Photographer
  start: Date | string
  end?: Date | string
  title: string
  privateNote?: string
  publicNote?: string
  orderedServices?: number[]
  vacation?: boolean
}

export interface EventData extends RawEventData {
  color: string
  editable?: boolean
}

export interface Photographer {
  id: number
  firstName?: string
  lastName?: string
}

export type CalendarPhotographer = Photographer & {
  color: string
  checked?: boolean
}

export type PhotographerEventData = {
  photographerId: Photographer['id']
  orderedServices?: number[]
  totalEventDurationMinutes?: number
} & Pick<EventData, 'privateNote' | 'publicNote' | 'title' | 'vacation'>

type EditableFields = 'allDay' | 'end' | 'start' | 'photographer' | 'publicNote' | 'privateNote' | 'color' | 'title' | 'orderedServices' | 'vacation'
export type EventDelta = Pick<EventData, 'eventId'>
  & Partial<Pick<EventData, EditableFields>>
  & Partial<Pick<PhotographerEventData, 'totalEventDurationMinutes'>>

export enum DaysOfWeek {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

export interface BusinessDayHours {
  daysOfWeek: number[],
  startTime: string,
  endTime: string
}

// will include more settings
export interface Settings {
  businessDayHours: BusinessDayHours
  firstDay: number
  time12h: boolean
  showWeather: boolean
  showBusinessHours: boolean
}

export interface DailyWeather {
  dt: number
  temp: {
    day: number
  }
  weather: Array<{
    icon: string
  }>
}

export interface OpenWeatherResponse {
  daily: DailyWeather[]
}

type OrderData = NoNullableFields<EventOrderQuery>

export type Service = OrderData['order']['services'][0]

export interface SelectableService extends Service {
  checked?: boolean
}

export type Services = Service[]

export type Regions = Array<Pick<Region, 'id' | 'label'>>
