import { mockOrderPhotos } from '#veewme/web/components/media/mockPhotosData'
import { shallow } from 'enzyme'
import * as React from 'react'
import PhotoItem from './photoItem'
import * as PL from './photos'

jest.mock('react-modal', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

jest.mock('../emailPopup', () => {
  const EmailPopup = () => <div className='email-popup'/>
  return {
    __esModule: true,
    default: EmailPopup
  }
})

jest.mock('#veewme/web/common/slideshow', () => {
  return {
    __esModule: true,
    default: () => null
  }
})

jest.mock('#veewme/web/common/sizeSlider', () => {
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

jest.mock('react-toast-notifications', () => {
  return {
    useToasts: jest.fn().mockImplementation(() => ({
      addToast: jest.fn()
    }))
  }
})

describe('Photos list tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Renders correctly', () => {
    const wrapper = shallow(
      <PL.PhotosList
        photos={mockOrderPhotos}
      />
    )

    expect(wrapper.find(PhotoItem).length).toBe(mockOrderPhotos.length)
    expect(wrapper.find('EmailPopup').exists()).toBe(true)
  })

  it('Email popup is hidden', () => {
    const wrapper = shallow(
      <PL.PhotosList
        photos={mockOrderPhotos}
      />
    )

    expect(wrapper.find('EmailPopup').prop('visible')).toBe(false)
  })

  it('All photos are deselected by default', () => {
    const wrapper = shallow(
      <PL.PhotosList
        photos={mockOrderPhotos}
      />
    )
    wrapper.find(PhotoItem).forEach(node => {
      expect(node.prop('checked')).toBeFalsy()
    })
  })

})
