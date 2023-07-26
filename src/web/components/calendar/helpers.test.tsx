import axios from 'axios'
import { mount } from 'enzyme'
import * as React from 'react'
// import { act } from 'react-dom/test-utils'

import { wait } from '#veewme/web/common/util'
import {
  assignPhotographersColorsToEvents,
  convertEventDeltaToMutationVariables,
  fallbackColor,
  getPhotographerColor,
  getPhotographerFullName,
  initializePhotographersData,
  openweatherApiUrl,
  useWeather
} from './helpers'
import { mockEvents, mockPhotographers } from './mockData'
import { OpenWeatherResponse } from './types'

jest.mock('axios')

// TODO: move to test helpers
export const TestHook: React.FC<{
  callback: () => void
}> = ({ callback }) => {
  callback()
  return null
}

export const testHook = (callback: () => void) => {
  mount(<TestHook callback={callback} />)
}

let weatherData: OpenWeatherResponse | undefined
describe('Calendar helpers tests', () => {
  // this is just a little hack to silence a warning that we'll get until we
  // upgrade to 16.9. See also: https://github.com/facebook/react/pull/14853
  /* tslint:disable */
  const originalError = console.error
  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return
      }
      originalError.call(console, ...args)
    }
  })

  afterAll(() => {
    console.error = originalError
  })
/* tslint:enable */

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Initializes photographers data', () => {
    const mockColorPhotographers = initializePhotographersData(mockPhotographers)
    const hexColorRegex = /^#[0-9a-f]{3,6}$/i

    mockPhotographers.forEach(photographer => {
      expect(photographer).toEqual(expect.not.objectContaining({
        checked: true,
        color: expect.any(String)
      }))
    })

    mockColorPhotographers.forEach(photographer => {
      expect(photographer).toEqual(expect.objectContaining({
        checked: true,
        color: expect.stringMatching(hexColorRegex)
      }))
    })
  })

  it('Assigns photographers colors to events', () => {
    const mockColorPhotographers = initializePhotographersData(mockPhotographers)
    const mockEventsWithColors = assignPhotographersColorsToEvents(mockEvents, mockColorPhotographers)

    mockEventsWithColors.forEach(event => {
      const eventPhotographer = mockColorPhotographers.find(p => p.id === event.photographer.id)
      if (eventPhotographer) {
        expect(event.color).toBe(eventPhotographer.color)
      } else {
        expect(event.color).toBe(fallbackColor)
      }
    })
  })

  it('Returns photographer color', () => {
    const mockColorPhotographers = initializePhotographersData(mockPhotographers)

    mockColorPhotographers.forEach(p => {
      const color = getPhotographerColor(p.id, mockColorPhotographers)
      expect(color).toBe(p.color)
    })

    const nonExistingPhotographerId = 100

    expect(getPhotographerColor(nonExistingPhotographerId, mockColorPhotographers)).toBe(fallbackColor)
  })

  it('Returns photographer full name', () => {
    const mockColorPhotographers = initializePhotographersData(mockPhotographers)

    expect(getPhotographerFullName(mockColorPhotographers, 1)).toBe('John Smith')
    expect(getPhotographerFullName(mockColorPhotographers, 3)).toBe('Justin Jackson')
    expect(getPhotographerFullName(mockColorPhotographers, 5)).toBe('Max Johanson')
  })

  it('Returns weather data', async () => {
    const data = {
      data: 'Lorem ipsum'
    }
    axios.get = jest.fn().mockImplementationOnce(() => Promise.resolve(data))

    testHook(() => { weatherData = useWeather(false) })

    await wait(1)

    expect(weatherData).toBe('Lorem ipsum')
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(openweatherApiUrl, expect.objectContaining({
      params: expect.objectContaining({
        exclude: 'hourly, minutely'
      })
    }))
  })

  it('Prepares mutations variables', () => {
    const startDate = new Date()
    const endDate = new Date()
    let mutationVariables = convertEventDeltaToMutationVariables({
      end: endDate,
      eventId: 2,
      photographer: {
        id: 234
      },
      start: startDate
    })
    expect(mutationVariables).toEqual(expect.objectContaining({
      end: endDate.toISOString(),
      eventId: 2,
      photographerId: 234,
      start: startDate.toISOString()
    }))

    mutationVariables = convertEventDeltaToMutationVariables({
      end: endDate.toISOString(),
      eventId: 2,
      photographer: {
        id: 1
      },
      start: startDate.toISOString()
    })
    expect(mutationVariables).toEqual(expect.objectContaining({
      end: endDate.toISOString(),
      eventId: 2,
      photographerId: 1,
      start: startDate.toISOString()
    }))

    mutationVariables = convertEventDeltaToMutationVariables({
      end: endDate.toISOString(),
      eventId: 2,
      orderedServices: [1, 2, 5, 7],
      photographer: {
        id: 1
      },
      start: startDate.toISOString()
    }, [1, 3, 4, 5])

    expect(mutationVariables).toEqual(expect.objectContaining({
      addOrderedServices: [2, 7],
      end: endDate.toISOString(),
      eventId: 2,
      photographerId: 1,
      removeOrderedServices: [3, 4],
      start: startDate.toISOString()
    }))

    mutationVariables = convertEventDeltaToMutationVariables({
      end: endDate.toISOString(),
      eventId: 2,
      orderedServices: [1, 3, 7],
      photographer: {
        id: 1
      },
      start: startDate.toISOString()
    }, [2, 4, 5])

    expect(mutationVariables).toEqual(expect.objectContaining({
      addOrderedServices: [1, 3, 7],
      end: endDate.toISOString(),
      eventId: 2,
      photographerId: 1,
      removeOrderedServices: [2, 4, 5],
      start: startDate.toISOString()
    }))

    mutationVariables = convertEventDeltaToMutationVariables({
      eventId: 2,
      orderedServices: [1, 3, 7],
      photographer: {
        id: 1
      },
      start: startDate.toISOString()
    }, [])

    expect(mutationVariables).toEqual(expect.objectContaining({
      addOrderedServices: [1, 3, 7],
      eventId: 2,
      photographerId: 1,
      removeOrderedServices: [],
      start: startDate.toISOString()
    }))

    mutationVariables = convertEventDeltaToMutationVariables({
      eventId: 2,
      orderedServices: [],
      photographer: {
        id: 1
      },
      start: startDate.toISOString()
    }, [2, 5])

    expect(mutationVariables).toEqual(expect.objectContaining({
      addOrderedServices: [],
      eventId: 2,
      photographerId: 1,
      removeOrderedServices: [2, 5],
      start: startDate.toISOString()
    }))

  })
})
