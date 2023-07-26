import { mount, ReactWrapper } from 'enzyme'
import * as React from 'react'

import SelectablePhoto, { CaptionInput, Checkmark, PhotoWrapper, SelectablePhotoProps, Toolbar, Wrapper } from './selectablePhoto'

import { ThemeProvider } from '#veewme/web/common/styled-components'
import theme from '#veewme/web/common/theme'

jest.mock('./selectablePhotoBannerModal', () => {
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

const mockPhoto = {
  date: '06/23/18',
  fileName: 'some-filename.jpg',
  fullUrl: 'some-url',
  hidden: false,
  id: 256,
  star: false,
  thumbUrl: 'some-test-thumb-url',
  title: ''
}

describe('Selectable Photo tests', () => {
  let wrapper: ReactWrapper<SelectablePhotoProps>

  const updateMock = jest.fn()
  const deleteMock = jest.fn()
  const selectMock = jest.fn()

  describe('Extended version', () => {
    beforeEach(() => {
      wrapper = mount(
        <ThemeProvider theme={theme}>
          <SelectablePhoto
            key={mockPhoto.id}
            thumbUrl={mockPhoto.thumbUrl}
            fullUrl={mockPhoto.fullUrl}
            onDelete={deleteMock}
            onUpdate={updateMock}
            onSelect={selectMock}
            star={mockPhoto.star}
            hidden={mockPhoto.hidden}
            title={mockPhoto.title}
            extended
          />
        </ThemeProvider>
      )
      jest.clearAllMocks()
    })

    it('Renders correctly', () => {
      expect(wrapper.find('img').prop('src')).toBe(mockPhoto.thumbUrl)
      expect(wrapper.find(Toolbar).exists()).toBe(true)

      const photoWrapperEl = wrapper.find(PhotoWrapper)
      expect(photoWrapperEl.prop('panoramic')).toBeFalsy()
      expect(wrapper.find(Checkmark).exists()).toBe(false)
    })

    it('Calls onUpdate', () => {
      const starBtn = wrapper.find(Toolbar).find('span').at(0)
      starBtn.simulate('click')

      expect(updateMock).toHaveBeenLastCalledWith(expect.objectContaining({ star: true }))

      const hideBtn = wrapper.find(Toolbar).find('span').at(1)
      hideBtn.simulate('click')

      expect(updateMock).toHaveBeenLastCalledWith(expect.objectContaining({ hidden: true }))
    })

    it('Calls onSelect', () => {
      const el = wrapper.find(Wrapper)
      el.simulate('click')

      expect(selectMock).toHaveBeenCalledTimes(1)

      el.simulate('click')

      expect(selectMock).toHaveBeenCalledTimes(2)
    })

    it('Editing title works', () => {
      const el = wrapper.find(CaptionInput)
      el.simulate('change', {
        target: {
          value: 'Test ipsum'
        }
      })

      expect(updateMock).not.toHaveBeenCalled()

      el.simulate('blur')

      expect(updateMock).toHaveBeenLastCalledWith(expect.objectContaining({ title:  'Test ipsum' }))
    })

    it('Displays panorama size', () => {
      const localWrapper = mount(
        <ThemeProvider theme={theme}>
          <SelectablePhoto
            key={mockPhoto.id}
            thumbUrl={mockPhoto.thumbUrl}
            fullUrl={mockPhoto.fullUrl}
            onDelete={deleteMock}
            onUpdate={updateMock}
            onSelect={selectMock}
            star={mockPhoto.star}
            hidden={mockPhoto.hidden}
            title={mockPhoto.title}
            extended
            panoramicAspectRatio
          />
        </ThemeProvider>
      )
      const photoWrapperEl = localWrapper.find(PhotoWrapper)

      expect(photoWrapperEl.prop('panoramic')).toBeTruthy()
    })
  })

  describe('Basic version', () => {
    beforeEach(() => {
      wrapper = mount(
        <ThemeProvider theme={theme}>
          <SelectablePhoto
            key={mockPhoto.id}
            thumbUrl={mockPhoto.thumbUrl}
            fullUrl={mockPhoto.fullUrl}
            onSelect={selectMock}
            checked
          />
        </ThemeProvider>
      )
      jest.clearAllMocks()
    })

    it('Renders correctly', () => {
      expect(wrapper.find('img').prop('src')).toBe(mockPhoto.thumbUrl)
      expect(wrapper.find(Toolbar).exists()).toBe(false)

      const photoWrapperEl = wrapper.find(PhotoWrapper)
      expect(photoWrapperEl.prop('panoramic')).toBeFalsy()
      expect(wrapper.find(Checkmark).exists()).toBe(true)
    })
  })

})
