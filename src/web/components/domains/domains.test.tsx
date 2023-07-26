import { shallow } from 'enzyme'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import AddDomain from './addDomain'
import Domains from './domains'

const mockRemoveAllToasts = jest.fn()

jest.mock('react-toast-notifications', () => {
  return {
    useToasts: jest.fn().mockImplementation(() => ({
      removeAllToasts: mockRemoveAllToasts
    }))
  }
})

jest.mock('react-modal', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

jest.mock('react-tooltip', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

describe('Domains tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Renders correctly', () => {
    const wrapper = shallow(<Domains />)

    expect(wrapper.find(AddDomain).length).toBe(1)
    expect(wrapper.find('h1').at(0).text()).toBe('Custom Domain Management')
  })

  it('Calls useToasts', () => {
    shallow(<Domains />)

    expect(useToasts).toHaveBeenCalledTimes(1)
  })
})
