import { shallow } from 'enzyme'
import * as React from 'react'
import Hide from './hideForRole'

jest.mock('@apollo/react-hooks', () => {
  return {
    __esModule: true,
    default: () => null,
    useQuery: () => ({
      data: {
        me: {
          role: 'AGENT'
        }
      },
      loading: false
    })
  }
})

describe('Hide For Role', () => {

  it('Hides content for given role', () => {
    const wrapper = shallow(
      <Hide
        roles={['AGENT', 'AFFILIATE']}
      >
        <div className='hideMe'>tets</div>
      </Hide>
    )

    expect(wrapper.exists('.hideMe')).toBe(false)
  })

  it('Hides content for given role and show fallback', () => {
    const wrapper = shallow(
      <Hide
        roles={['AGENT', 'AFFILIATE']}
        fallback={<div className='fallback-element'>NO ACCESS</div>}
      >
        <div className='hideMe'>tets</div>
      </Hide>
    )

    expect(wrapper.exists('.hideMe')).toBe(false)
    expect(wrapper.exists('.fallback-element')).toBe(true)
    expect(wrapper.find('.fallback-element').text()).toBe('NO ACCESS')
  })

  it('Does not hide content for other roles', () => {
    const wrapper = shallow(
      <Hide
        roles={['ADMIN', 'AFFILIATE']}
      >
        <div className='hideMe'>tets</div>
      </Hide>
    )

    expect(wrapper.exists('.hideMe')).toBe(true)
  })

  it('Shows content for given role', () => {
    const wrapper = shallow(
      <Hide
        action='show'
        roles={['AGENT', 'AFFILIATE']}
      >
        <div className='showMe'>tets</div>
      </Hide>
    )

    expect(wrapper.exists('.showMe')).toBe(true)
  })

  it('Does not shows content for other roles', () => {
    const wrapper = shallow(
      <Hide
        action='show'
        roles={['ADMIN', 'AFFILIATE']}
      >
        <div className='showMe'>tets</div>
      </Hide>
    )

    expect(wrapper.exists('.showMe')).toBe(false)
  })

  it('Shows content if no roles specified in hide mode', () => {
    const wrapper = shallow(
      <Hide
        roles={[]}
      >
        <div className='hideMe'>tets</div>
      </Hide>
    )

    expect(wrapper.exists('.hideMe')).toBe(true)
  })

  it('Hides content if no roles specified in show mode', () => {
    const wrapper = shallow(
      <Hide
        action='show'
        roles={[]}
      >
        <div className='showMe'>tets</div>
      </Hide>
    )

    expect(wrapper.exists('.showMe')).toBe(false)
  })
})
