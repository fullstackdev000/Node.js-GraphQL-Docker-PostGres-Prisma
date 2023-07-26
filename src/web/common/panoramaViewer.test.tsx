import { shallow, ShallowWrapper } from 'enzyme'
import * as React from 'react'
import Viewer from './panoramaViewer'

interface PannellumViewer {
  getPitch: () => number
  getYaw: () => number
  setPitch: (x: number, animate: boolean) => void
  setYaw: (x: number, animate: boolean) => void
  on: () => void
}
interface Pannellum {
  viewer: () => PannellumViewer
}
interface Global {
  pannellum: Pannellum
}

const glob = global as any as Global

const mockSetPithch = jest.fn()
const mockSetYaw = jest.fn()
const mockOn = jest.fn()
const mockGetPitch = jest.fn().mockReturnValue(20)
const mockGetYaw = jest.fn(() => 34)
const mockMouseMove = jest.fn()

glob.pannellum = {
  viewer: () => ({
    getPitch: mockGetPitch,
    getYaw: mockGetYaw,
    on: mockOn,
    setPitch: mockSetPithch,
    setYaw: mockSetYaw
  })
}

describe('Panorama viever tests', () => {
  type ViewerProps = React.ComponentProps<typeof Viewer>
  let wrapper: ShallowWrapper<ViewerProps, {}, Viewer>
  let instance: Viewer
  const mockPanorama = {
    date: '22/04/17',
    fileName: 'some-filename.jpg',
    fullUrl: 'https://picsum.photos/640/480?image=1078',
    hfov: 360,
    id: 2,
    initialHorizontalAngle: 20,
    initialVerticalAngle: 0,
    initialZoom: 110,
    thumbUrl: 'https://picsum.photos/640/480?image=1078',
    title: 'Lorem ipsum',
    type: 'Spherical',
    url: '/public/static/img/panorama2.jpg'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallow(
      <Viewer
        panorama={mockPanorama.fullUrl}
        className='IpsumClass'
        yaw={23}
        pitch={100}
        haov={20}
        hfov={120}
        onMouseDown={jest.fn()}
        onMouseUp={jest.fn()}
        onMouseMove={mockMouseMove}
        onZoomChange={jest.fn()}
      />
    )

    instance = wrapper.instance()
  })

  it('Renders correctly', () => {
    expect(wrapper.find('.IpsumClass').exists()).toBe(true)
    expect(wrapper.find('#panorama').exists()).toBe(true)
  })

  it('Initializes events handlers', () => {
    expect(mockOn).toHaveBeenCalledTimes(2)
    expect(mockOn.mock.calls[0][0]).toBe('mousedown')
    expect(mockOn.mock.calls[1][0]).toBe('mouseup')
  })

  it('Sets pitch', () => {
    instance.updatePitch(45)

    expect(mockSetPithch).toHaveBeenCalledWith(45, false)
  })

  it('Sets yaw', () => {
    instance.updateYaw(42)

    expect(mockSetYaw).toHaveBeenCalledWith(42, false)
  })

  it('Handles mouse move', () => {
    instance.handleMouseMove()
    expect(mockMouseMove).toHaveBeenCalledWith(34, 20)

    mockGetPitch.mockReturnValue(123)
    instance.handleMouseMove()
    expect(mockMouseMove).toHaveBeenLastCalledWith(34, 90)

    mockGetPitch.mockReturnValue(-125)
    instance.handleMouseMove()
    expect(mockMouseMove).toHaveBeenLastCalledWith(34, -90)
  })

})
