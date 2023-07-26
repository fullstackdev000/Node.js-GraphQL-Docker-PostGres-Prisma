import { AddressForGeoCoordinates } from '#veewme/lib/types'
import { ServiceListElement, ServiceTypeCards } from '#veewme/web/components/services/types'
import { convertToRaw, EditorState, RawDraftContentState } from 'draft-js'

export const nameof = <T>(name: keyof T) => name

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const prepareEditorValueForStorage
: (editorState?: EditorState) => RawDraftContentState | null = editorState => {
  if (!editorState) {
    return null
  }
  const rawContent = convertToRaw(editorState.getCurrentContent())
  if (rawContent.blocks.findIndex(block => block.text.length > 0) >= 0) {
    return rawContent
  }
  return null
}
export const getStringAddressFromObject = (addressData: AddressForGeoCoordinates): string => {
  const { zip, street, city, country } = addressData
  if (!zip) throw new Error('Missing ZIP code')
  if (!street) throw new Error('Missing street')
  if (!city) throw new Error('Missing city')
  if (!country) throw new Error('Missing country')
  return `${zip} ${street}, ${city}, ${country}`
}

export const getRandomArrayItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export const formatTime = (date: Date): string => new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date).toLowerCase()

export const formatDate = (date: Date): string => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)

export const fixFloatAfterDigit = (float: number, denominator: number = 100): number => Math.round(float * denominator) / denominator

export const convertToServiceTypeCards = (services: ServiceListElement[]): ServiceTypeCards => {
  const initialServiceCards: ServiceTypeCards = {}
  return services.reduce((serviceCards: ServiceTypeCards, service: ServiceListElement) => {
    if (serviceCards.hasOwnProperty(service.categoryLabel)) {
      serviceCards[service.categoryLabel].push(service)
    } else {
      serviceCards[service.categoryLabel] = [service]
    }
    return serviceCards
  }, initialServiceCards)
}

// simple debounce copied form SO
// TODO implement more advanced version or use some lib
export const debounce = <T>(callback: (...vals: T[]) => void, time: number) => {
  let interval: number
  return (...args: any) => {
    clearTimeout(interval)
    interval = setTimeout(() => {
      interval = -1
      callback(...args)
    }, time)
  }
}
