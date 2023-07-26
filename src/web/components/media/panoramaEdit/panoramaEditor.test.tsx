import { shallow, ShallowWrapper } from 'enzyme'
import * as React from 'react'
import Editor from './panoramaEditor'

jest.mock('#veewme/web/common/formikFields/sliderField', () => {
  return {
    __esModule: true,
    default: () => null,
    pureSlider: () => <div />
  }
})

describe('Panorama editor tests', () => {
  type EditorProps = React.ComponentProps<typeof Editor>
  let wrapper: ShallowWrapper<EditorProps, {}, Editor>
  const mockPanorama = {
    date: '22/04/17',
    fileName: 'some-filename.jpg',
    fullUrl: 'https://picsum.photos/640/480?image=1078',
    hfov: 360,
    id: 2,
    initialHorizontalAngle: 20,
    initialVerticalAngle: 0,
    initialZoom: 110,
    theaterMode: true,
    thumbUrl: 'https://picsum.photos/640/480?image=1078',
    title: 'Lorem ipsum',
    type: 'Spherical',
    url: '/public/static/img/panorama2.jpg'
  }

  const onSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallow(
      <Editor
        panorama={mockPanorama}
        onSubmit={onSubmit}
      />
    )
  })

  it('Renders correctly', () => {
    expect(wrapper.find('PanoramaViewer').exists()).toBe(true)
    const panoramaViewerProps = wrapper.find('PanoramaViewer').props()
    expect(panoramaViewerProps).toEqual(expect.objectContaining({
      hfov: mockPanorama.initialZoom,
      panorama: mockPanorama.fullUrl,
      pitch: mockPanorama.initialVerticalAngle,
      yaw: mockPanorama.initialHorizontalAngle
    }))

    expect(wrapper.find('[label="Horizontal Start"]').length).toBe(1)
    expect(wrapper.find('[label="Vertical Start"]').length).toBe(1)
    expect(wrapper.find('[label="Initial Zoom"]').length).toBe(1)

    expect(wrapper.find('Panel').length).toBe(1)

  })

  it('Initializes state', () => {
    const expectedState = {
      mouseDown: false,
      pitch: 0,
      yaw: 20,
      zoom: 110
    }
    expect(wrapper.state()).toEqual(expect.objectContaining(expectedState))
  })

  it('Handles mnouse move', () => {
    const instance: Editor = wrapper.instance()
    instance.handleMouseMove(123, 578)

    expect(wrapper.state()).toEqual(expect.objectContaining({
      pitch:  0,
      yaw: 20
    }))

    wrapper.setState({
      mouseDown: true
    })

    instance.handleMouseMove(123, 578)

    expect(wrapper.state()).toEqual(expect.objectContaining({
      pitch:  578,
      yaw: 123
    }))

    instance.handleMouseMove(123.78, 578.23)

    expect(wrapper.state()).toEqual(expect.objectContaining({
      pitch:  578.2,
      yaw: 123.8
    }))
  })

  it('Handles zoom change', () => {
    const instance: Editor = wrapper.instance()
    instance.handleZoomChange(46)

    expect(wrapper.state()).toEqual(expect.objectContaining({
      zoom: 46
    }))
  })

  it('Handles submit', () => {
    const instance: Editor = wrapper.instance()
    instance.handleSubmit()

    expect(onSubmit).toHaveBeenLastCalledWith({
      ...mockPanorama,
      initialHorizontalAngle: 20,
      initialVerticalAngle: 0,
      initialZoom: 110
    })

    wrapper.setState({
      mouseDown: true
    })

    instance.handleMouseMove(123, 578)

    instance.handleSubmit()
    expect(onSubmit).toHaveBeenLastCalledWith({
      ...mockPanorama,
      initialHorizontalAngle: 123,
      initialVerticalAngle: 578,
      initialZoom: 110
    })
  })

})
