import Button from '#veewme/web/common/buttons/basicButton'
import DeleteConfirmation from '#veewme/web/common/deleteConfirmation'
import Tooltipped from '#veewme/web/common/tooltipped'
import { mount } from 'enzyme'
import * as React from 'react'

import DomainItem from './domainItem'

import { ThemeProvider } from '#veewme/web/common/styled-components'
import theme from '#veewme/web/common/theme'

jest.mock('react-tooltip', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

const mockToggleModal = jest.fn()

interface MockDeleteConfirmationProps {
  children: (callback: () => void) => React.ReactNode
}

jest.mock('#veewme/web/common/deleteConfirmation', () => {
  return {
    __esModule: true,
    default: ({ children }: MockDeleteConfirmationProps) => {
      return children(mockToggleModal)
    }
  }
})

const mockDomain = {
  existing: true,
  id: 135,
  url: 'www.example.com'
}

const mockOnDelete = jest.fn()
const mockOnOrderChange = jest.fn()

describe('Domain Item tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Renders correctly', () => {
    let wrapper = mount(
      <ThemeProvider theme={theme}>
        <DomainItem
          domain={mockDomain}
          orders={[]}
          onDelete={mockOnDelete}
          onOrderChange={mockOnOrderChange}
        />
      </ThemeProvider>
    )

    expect(wrapper.find('h3').text()).toBe(mockDomain.url)
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Button).prop('disabled')).toBe(false)

    wrapper = mount(
      <ThemeProvider theme={theme}>
        <DomainItem
          domain={{
            existing: false,
            id: 1,
            url: 'www.example.com'
          }}
          orders={[]}
          onDelete={mockOnDelete}
          onOrderChange={mockOnOrderChange}
        />
      </ThemeProvider>
    )

    expect(wrapper.find(Button).prop('disabled')).toBe(true)
  })

  it('Delete button works', () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <DomainItem
          domain={mockDomain}
          orders={[]}
          onDelete={mockOnDelete}
          onOrderChange={mockOnOrderChange}
        />
      </ThemeProvider>
    )

    const confirmFunction = wrapper.find(DeleteConfirmation).prop('onConfirm')
    confirmFunction()

    expect(mockOnDelete).toHaveBeenCalledWith(mockDomain.id)

    wrapper.find(Button).simulate('click')

    expect(mockToggleModal).toHaveBeenCalledTimes(1)

  })

  it('Tooltip displays correct text', () => {
    let wrapper = mount(
      <ThemeProvider theme={theme}>
        <DomainItem
          domain={mockDomain}
          orders={[]}
          onDelete={mockOnDelete}
          onOrderChange={mockOnOrderChange}
        />
      </ThemeProvider>
    )

    let tooltipText = wrapper.find(Tooltipped).prop('tooltip')
    expect(tooltipText).toBe('Delete domain')

    wrapper = mount(
      <ThemeProvider theme={theme}>
        <DomainItem
          domain={{
            existing: false,
            id: 1,
            url: 'www.example.com'
          }}
          orders={[]}
          onDelete={mockOnDelete}
          onOrderChange={mockOnOrderChange}
        />
      </ThemeProvider>
    )

    tooltipText = wrapper.find(Tooltipped).prop('tooltip')
    expect(tooltipText).toBe('This domain can\'t be deleted')
  })
})
