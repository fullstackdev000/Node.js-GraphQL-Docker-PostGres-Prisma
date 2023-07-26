import { wait } from '#veewme/web/common/util'
import { mount } from 'enzyme'
import * as React from 'react'
import { Domain, TopDomain } from './'
import Form from './addDomainForm'

import { ThemeProvider } from '#veewme/web/common/styled-components'
import theme from '#veewme/web/common/theme'

jest.mock('#veewme/web/common/formikFields/navigationWarning', () => {
  return {
    __esModule: true,
    default: () => <div />
  }
})

jest.mock('react-tooltip', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

jest.mock('react-toast-notifications', () => {
  return {
    useToasts: jest.fn().mockImplementation(() => ({
      addToast: jest.fn()
    }))
  }
})

const MockTopDomains: TopDomain[] = [{
  currency: 'USD',
  name: 'com',
  price: 19
}, {
  currency: 'USD',
  name: 'org',
  price: 25
}]

const mockSubmitSuccess = jest.fn()

// Based on https://github.com/formium/formik/issues/937
describe('Domain Form tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Sends correct data of non-existing domain', async () => {
    expect.assertions(2)
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Form
          topDomains={MockTopDomains}
          domainAdded={false}
          onSubmit={(values: Pick<Domain, 'existing' | 'url'>) => {
            mockSubmitSuccess(values)
          }}
        />
      </ThemeProvider>
    )

    const nameInput = wrapper.find('input[name="name"]')
    nameInput.simulate('change', {
      target: {
        name: 'name',
        value: 'example'
      }
    })

    wrapper.find('button[type="submit"]').simulate('click')

    await wait(0)
    expect(wrapper.find('input[name="name"]').props().value).toEqual('example')
    expect(mockSubmitSuccess).toHaveBeenCalledWith(expect.objectContaining({
      existing: false,
      url: 'example.com'
    }))
  })

  it('Sends correct data of existing domain', async () => {
    expect.assertions(1)
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Form
          topDomains={MockTopDomains}
          domainAdded={false}
          onSubmit={(values: Pick<Domain, 'existing' | 'url'>) => {
            mockSubmitSuccess(values)
          }}
        />
      </ThemeProvider>
    )

    const existingRadio = wrapper.find('input[name="existing"]').at(1)
    existingRadio.simulate('change', {
      target: {
        name: 'existing',
        value: 'yes'
      }
    })

    wrapper.find('input[name="existingUrl"]').simulate('change', {
      target: {
        name: 'existingUrl',
        value: 'example.abc'
      }
    })

    wrapper.find('button[type="submit"]').simulate('click')

    await wait(0)
    expect(mockSubmitSuccess).toHaveBeenCalledWith(expect.objectContaining({
      existing: true,
      url: 'example.abc'
    }))
  })
})
