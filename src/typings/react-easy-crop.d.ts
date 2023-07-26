declare module 'react-easy-crop' {
  import * as React from 'react'
  import Cropper from 'react-easy-crop'

  export interface CropCoordinates {
    x: number
    y: number
  }

  export interface CroppedArea extends CropCoordinates {
    height: number
    width: number
  }

  export interface Classes {
    containerClassName?: string
    cropAreaClassName?: string
    imageClassName?: string
  }

  export interface Styles {
    containerStyle?: object
    cropAreaStyle?: object
    imageStyle?: object
  }

  export type CropShape = 'rect' | 'round'

  export interface CropProps {
    aspect?: number
    classes?: Classes
    crop: CropCoordinates
    cropShape?: CropShape
    crossOrigin?: string
    image: string
    maxZoom?: number
    minZoom?: number
    onCropChange: (crop: CropCoordinates) => void
    onCropComplete?: (croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => void
    onImgError?: (e: Event) => void
    onZoomChange?: (zoom: number) => void
    restrictPosition?: boolean
    showGrid?: boolean
    style?: Styles
    zoom?: number
    zoomSpeed?: number
  }

  export default class Cropper extends React.Component<CropProps> {}
}
