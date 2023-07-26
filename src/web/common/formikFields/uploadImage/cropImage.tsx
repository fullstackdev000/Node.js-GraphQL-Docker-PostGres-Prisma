import { ImageDimensions } from '#veewme/lib/types'
import 'rc-slider/assets/index.css'
import * as React from 'react'
import Cropper, { CropCoordinates, CroppedArea, CropShape } from 'react-easy-crop'
import Button from '../../buttons/basicButton'
import * as log from '../../log'
import Modal from '../../modal'
import styled from '../../styled-components'
import { PureSlider } from '../sliderField'
import { Label } from '../styled'

const cropperControlsHeight = 50

const CropperWrapper = styled.div`
  position: relative;
  height: calc(80vh - ${cropperControlsHeight}px);
  width: 80vw;
`

const CropperControls = styled.div`
  height: ${cropperControlsHeight}px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const Slider = styled(props => <PureSlider {...props} />)`
  display: block;
  flex: 1 0 0;
  margin-right: 30px;
  padding-bottom: 5px;
  & > ${Label} {
    margin-bottom: 5px;
  }
`

interface CropImageProps {
  cropShape: CropShape
  imageFullDimensions: ImageDimensions
  image?: HTMLImageElement
  onRequestClose: () => void
  name: string
  saveImageToFieldValue: (canvas: HTMLCanvasElement) => void
  type?: string
  restrictPosition?: boolean
}

interface CropImageState {
  crop: CropCoordinates
  croppedAreaPixels: CroppedArea
  croppedImage?: string
  zoom: number
}

class CropImageConent extends React.PureComponent<CropImageProps, CropImageState> {
  static defaultProps = {
    cropShape: 'rect',
    restrictPosition: false
  }
  state = {
    crop: { x: 0, y: 0 },
    croppedAreaPixels: {
      height: 0,
      width: 0,
      x: 0,
      y: 0
    },
    croppedImage: '',
    zoom: 1
  }

  drawCroppedImage = () => {
    const { croppedAreaPixels } = this.state
    const { image, imageFullDimensions } = this.props
    if (!image) { return }
    const canvas = document.createElement('canvas')
    const finalImageWidth = croppedAreaPixels.width < imageFullDimensions.width ? croppedAreaPixels.width : imageFullDimensions.width
    const finalImageHeight = croppedAreaPixels.height < imageFullDimensions.height ? croppedAreaPixels.height : imageFullDimensions.height
    canvas.width = finalImageWidth
    canvas.height = finalImageHeight
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        finalImageWidth,
        finalImageHeight
      )
    }

    this.props.saveImageToFieldValue(canvas)
    this.props.onRequestClose()
  }

  onCropChange = (crop: CropCoordinates) => { this.setState({ crop }) }

  onCropComplete = (croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => {
    this.setState({ croppedAreaPixels })
  }

  onZoomChange = (zoom: number) => { this.setState({ zoom }) }

  render () {
    return (
      <>
        <CropperWrapper>
          <Cropper
            image={this.props.image !== undefined ? this.props.image.src : ''}
            crop={this.state.crop}
            cropShape={this.props.cropShape}
            zoom={this.state.zoom}
            aspect={this.props.imageFullDimensions.width / this.props.imageFullDimensions.height}
            onCropChange={this.onCropChange}
            onCropComplete={this.onCropComplete}
            onZoomChange={this.onZoomChange}
            onImgError={(e: Event) => { log.debug(e) }}
            restrictPosition={this.props.restrictPosition}
          />
        </CropperWrapper>
        <CropperControls>
          <Slider
            label='Zoom'
            min={0.3}
            max={3}
            step={0.01}
            value={this.state.zoom}
            onChange={this.onZoomChange}
          />
          <Button label='Apply' buttonTheme='action' full disabled={!this.props.image} onClick={this.drawCroppedImage} />
        </CropperControls>
      </>
    )
  }
}

const CropImage: React.FunctionComponent<CropImageProps & {isOpen: boolean}> = props => {
  return (
    <Modal isOpen={props.isOpen} onRequestClose={props.onRequestClose}>
      <CropImageConent {...props} />
    </Modal>
  )
}
CropImage.defaultProps = { cropShape: 'rect' }

export default CropImage
