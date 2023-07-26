import { shallow } from 'enzyme'
import * as React from 'react'
import * as Utils from './util'

jest.useFakeTimers()

describe('Utils', () => {
  it('Wait', () => {
    Utils.wait(234).catch(e => null)
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 234)
  })

  it('Format lines', () => {
    let text = 'Test \n text \n ipsum'
    let res = Utils.formatLines(text)

    let TestComp = () => <div>{res}</div>
    let wrapper = shallow(<TestComp />)

    expect(wrapper.matchesElement((
      <div>
        <span>
          Test
        </span>
        <br />
        <span>
          text
        </span>
        <br />
        <span>
          ipsum
        </span>
      </div>
    ))).toBe(true)

    text = 'Test \n'
    res = Utils.formatLines(text)

    TestComp = () => <div>{res}</div>
    wrapper = shallow(<TestComp />)

    expect(wrapper.html()).toBe('<div><span>Test </span><br/><span></span></div>')
  })

  it('Get pixels', () => {
    expect(Utils.getPixels('234px')).toBe(234)
    expect(Utils.getPixels('1000px')).toBe(1000)
    expect(Utils.getPixels('0px')).toBe(0)

    expect(() => Utils.getPixels('200')).toThrowError(/Couldn't convert '200' to pixels/)
  })

  it('Wraps link', () => {
    expect(Utils.wrapLinkUrl('http://www.text.com')).toBe('http://www.text.com')
    expect(Utils.wrapLinkUrl('www.text.com')).toBe('http://www.text.com')
  })

  it('Checks if correct layout name', () => {
    expect(Utils.isLayoutName('FEATURED1')).toBe(true)

    expect(Utils.isLayoutName('FakeName')).toBe(false)
  })
})
