import { FieldProps } from 'formik'
import { getOrientation, Orientation } from 'get-orientation/browser'
import * as React from 'react'
import { CropShape } from 'react-easy-crop'
import { withToastManager, WithToastManagerApi } from 'react-toast-notifications'
import { UnreachableCaseError } from '../../../lib/error'
import { ImageDimensions } from '../../../lib/types'
import styled, { css } from '../styled-components'
import { Label } from './styled'
import CropImage from './uploadImage/cropImage'
import UploadImagePreview, { FieldOrientation, ImageType, previewBasicDimension } from './uploadImage/preview'

const UploadImagePortraitStyle = css`
  flex-direction: column;
  align-items: center;
`

const UploadImageWrapper = styled.div<{fieldOrientation: FieldOrientation}>`
  display: flex;
  ${props => {
    switch (props.fieldOrientation) {
      case 'landscape': return `
        align-items: center;
      `
      case 'portrait': return UploadImagePortraitStyle
      default: throw new UnreachableCaseError(props.fieldOrientation)
    }
  }}
`

const HiddenInput = styled.input`display: none;`

interface InputProps {
  id: string
  onBlur: FieldProps['field']['onBlur']
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FunctionComponent<InputProps> = props => {
  return (
    <HiddenInput
      accept='image/png, image/jpeg'
      id={props.id}
      onBlur={props.onBlur}
      onChange={e => props.onChange(e)}
      type='file'
    />
  )
}

const HelpersPortraitStyle = css`text-align: center;`

export const HelpersWrapper = styled.div<{fieldOrientation: FieldOrientation}>`
  & > label {
    white-space: normal;
    display: block;
    & > * {
      margin-top: 10px;
      font-weight: 600;
    }
  }
  ${props => {
    switch (props.fieldOrientation) {
      case 'landscape': return `
        margin-left: 20px;
        text-align: left;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        flex-grow: 0;
        & > label {
          margin: 20px 0 0;
        }
      `
      case 'portrait': return HelpersPortraitStyle
      default: throw new UnreachableCaseError(props.fieldOrientation)
    }
  }}
`

const ButtonsPortraitStyle = css`
  margin-top: 10px;
  & > * {
    margin: 0 10px;
  }
`

const ButtonsWrapper = styled.div<{fieldOrientation: FieldOrientation}>`
  ${props => {
    switch (props.fieldOrientation) {
      case 'landscape': return `
        width: 100%;
        flex-shrink: 0;
        margin: 10px 0;
        & > * {margin-right: 10px;}
      `
      case 'portrait': return ButtonsPortraitStyle
      default: throw new UnreachableCaseError(props.fieldOrientation)
    }
  }}
`

const ImageButton = css`
  display: inline-block;
  margin: 0 3px;
  width: 26px;
  height: 26px;
  padding: 0;
  line-height: 26px;
  background: ${props => props.theme.colors.BLUE};
  border: 0 none;
  border-radius: 100%;
  font-size: 20px;
  color: #fff;
  text-align: center;
  cursor: pointer;
`

const DeleteButton = styled.button`
  ${ImageButton}

  &[disabled] {
    opacity: 0.6;
  }
`

const Browse = styled.label`
  ${ImageButton}
`

interface EXIFCanvasProperties {
  canvasHeight: number
  canvasWidth: number
  rotateDEG: number
  scaleX: number
  scaleY: number
  translateForFlipX: number
  translateForFlipY: number
  translateForRotateX: number
  translateForRotateY: number
}

const generateCanvasProperties: (orientation: Orientation, imageWidth: number, imageHeight: number) => EXIFCanvasProperties =
  (orientation, imageWidth, imageHeight) => {
    const canvasProperties = {
      canvasHeight: imageHeight,
      canvasWidth: imageWidth,
      rotateDEG: 0,
      scaleX: 1,
      scaleY: 1,
      translateForFlipX: 0,
      translateForFlipY: 0,
      translateForRotateX: 0,
      translateForRotateY: 0
    }
    switch (orientation) {
      case Orientation.TOP_LEFT: return canvasProperties
      case Orientation.TOP_RIGHT: return {
        ...canvasProperties,
        scaleX: -1,
        translateForFlipX: imageWidth
      }
      case Orientation.BOTTOM_RIGHT: return {
        ...canvasProperties,
        rotateDEG: 180,
        translateForRotateX: imageWidth,
        translateForRotateY: imageHeight
      }
      case Orientation.BOTTOM_LEFT: return {
        ...canvasProperties,
        rotateDEG: 180,
        scaleX: -1,
        translateForFlipX: imageWidth,
        translateForRotateX: imageWidth,
        translateForRotateY: imageHeight
      }
      case Orientation.LEFT_TOP: return {
        ...canvasProperties,
        canvasHeight: imageWidth,
        canvasWidth: imageHeight,
        rotateDEG: 90,
        scaleY: -1,
        translateForFlipY: imageHeight,
        translateForRotateX: imageHeight
      }
      case Orientation.RIGHT_TOP: return {
        ...canvasProperties,
        canvasHeight: imageWidth,
        canvasWidth: imageHeight,
        rotateDEG: 90,
        translateForRotateX: imageHeight
      }
      case Orientation.RIGHT_BOTTOM: return {
        ...canvasProperties,
        canvasHeight: imageWidth,
        canvasWidth: imageHeight,
        rotateDEG: -90,
        scaleY: -1,
        translateForFlipY: imageHeight,
        translateForRotateY: imageWidth
      }
      case Orientation.LEFT_BOTTOM: return {
        ...canvasProperties,
        canvasHeight: imageWidth,
        canvasWidth: imageHeight,
        rotateDEG: -90,
        translateForRotateY: imageWidth
      }
      default: throw new UnreachableCaseError(orientation)
    }
  }

const rotateImage: (image: HTMLImageElement, orientation: Orientation) => Promise<string> = async (image, orientation) => {
  const canvas = document.createElement('canvas')
  const canvasProperties = generateCanvasProperties(orientation, image.width, image.height)
  canvas.width = canvasProperties.canvasWidth
  canvas.height = canvasProperties.canvasHeight
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.translate(canvasProperties.translateForRotateX, canvasProperties.translateForRotateY)
    ctx.rotate(canvasProperties.rotateDEG * Math.PI / 180)
    ctx.translate(canvasProperties.translateForFlipX, canvasProperties.translateForFlipY)
    ctx.scale(canvasProperties.scaleX, canvasProperties.scaleY)
    ctx.drawImage(image, 0, 0)
  }
  const imageSrc = await new Promise<string>(resolve => {
    canvas.toBlob(file => {
      if (!file) {
        resolve(image.src)
      }
      resolve(URL.createObjectURL(file))
    }, 'image/png')
  })
  return imageSrc
}

type ImageModificationStyle = 'crop' | 'scaledown'

interface CustomProps {
  className?: string
  cropShape: CropShape
  imageFullDimensions: ImageDimensions
  imageMinDimensions?: ImageDimensions
  modificationStyle: ImageModificationStyle
  imageType: ImageType
  label?: JSX.Element
  fieldOrientation: FieldOrientation
  switchField?: React.FunctionComponent
}

const plusEntity = <>&#65291;</>
const minusEnity = <>&#8722;</>

type UploadImageProps = FieldProps & CustomProps

interface UploadImageState {
  image?: HTMLImageElement
  modalOpen: boolean
  name: string
  type: string
}

class UploadImageField extends React.PureComponent<UploadImageProps & WithToastManagerApi, UploadImageState> {
  static defaultProps: CustomProps = {
    cropShape: 'rect',
    fieldOrientation: 'portrait',
    imageFullDimensions: {
      height: previewBasicDimension,
      width: previewBasicDimension
    },
    imageType: 'photo',
    modificationStyle: 'crop'
  }

  state: UploadImageState = {
    modalOpen: false,
    name: 'UploadedImage',
    type: 'image/png'
  }

  saveImageToFieldValue = async (canvas: HTMLCanvasElement) => {
    canvas.toBlob(blob => {
      if (blob) {
        this.props.form.setFieldValue(this.props.field.name, {
          file: new File([blob], this.state.name, { type: this.state.type }),
          id: this.props.field.value && this.props.field.value.id
        })
      } else {
        this.props.toastManager.add(
          `Something wrong with the resize`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }
    }, 'image/png')
  }

  cropImage = (image: HTMLImageElement) => {
    this.setState({
      image,
      modalOpen: true
    })
  }

  scaledownImage = async (image: HTMLImageElement) => {
    const minDimensions = this.props.imageMinDimensions
    const isImageHeightSmallerThanFullDimensions = !minDimensions && image.height < this.props.imageFullDimensions.height
    const isImageWidthSmallerThanFullDimensions = !minDimensions && image.width < this.props.imageFullDimensions.width
    const isImageHeightSmallerThanMinDimensions = minDimensions && image.height < minDimensions.height
    const isImageWidthSmallerThanMinDimensions = minDimensions && image.width < minDimensions.width

    if (isImageHeightSmallerThanFullDimensions
      || isImageWidthSmallerThanFullDimensions
      || isImageHeightSmallerThanMinDimensions
      || isImageWidthSmallerThanMinDimensions
    ) {
      const { height, width } = this.props.imageMinDimensions || this.props.imageFullDimensions
      this.props.toastManager.add(
        `The image is too small. Upload image of dimensions at least ${width}x${height}px`,
        { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    } else {
      const keepTheDimension = 1
      const widthScale = image.width > this.props.imageFullDimensions.width ? this.props.imageFullDimensions.width / image.width : keepTheDimension
      const heightScale = image.height > this.props.imageFullDimensions.height ? this.props.imageFullDimensions.height / image.height : keepTheDimension
      const divider = widthScale < heightScale ? widthScale : heightScale
      const destinedWidth = image.width * divider
      const destinedHeight = image.height * divider
      const canvas = document.createElement('canvas')
      canvas.width = destinedWidth
      canvas.height = destinedHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(image, 0, 0, destinedWidth, destinedHeight)
      }
      this.saveImageToFieldValue(canvas).catch(error => {
        this.props.toastManager.add(
          error.message,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      })
    }
  }

  onSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    const file = target && target.files && target.files[0]
    if (file) {
      this.setState({
        name: file.name,
        type: file.type
      })
      const image = new Image()
      image.src = URL.createObjectURL(file)
      const orientation = await getOrientation(file)
      if (orientation !== 1) {
        image.src = await rotateImage(image, orientation)
      }
      if (this.props.modificationStyle === 'scaledown') {
        this.scaledownImage(image).catch(error => {
          this.props.toastManager.add(
            error.message,
            { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
          )
        })
      } else {
        this.cropImage(image)
      }
      target.value = ''
    }
  }

  render () {
    const { field, form, ...props } = this.props
    return (
      <UploadImageWrapper fieldOrientation={props.fieldOrientation}>
        <Input
          id={field.name}
          onBlur={field.onBlur}
          onChange={this.onSelectFile}
        />
        <UploadImagePreview
          cropShape={props.cropShape}
          imageType={props.imageType}
          fieldOrientation={props.fieldOrientation}
          imageFullDimensions={props.imageFullDimensions}
          value={field.value}
        />
        <HelpersWrapper fieldOrientation={props.fieldOrientation}>
          {props.label && <Label>{props.label}</Label>}
          <ButtonsWrapper fieldOrientation={props.fieldOrientation}>
            <Browse
              htmlFor={field.name}
            >
              {plusEntity}
            </Browse>
            <DeleteButton
              type='button'
              disabled={!field.value || (!field.value.file && !field.value.path)}
              onClick={() => { form.setFieldValue(field.name, null) }}
            >
              {minusEnity}
            </DeleteButton>
          </ButtonsWrapper>
          {props.switchField}
        </HelpersWrapper>
        <CropImage
          cropShape={this.props.cropShape}
          imageFullDimensions={props.imageFullDimensions}
          image={this.state.image}
          isOpen={this.state.modalOpen}
          onRequestClose={() => { this.setState({ modalOpen: false }) }}
          name={this.state.name}
          type={this.state.type}
          saveImageToFieldValue={this.saveImageToFieldValue}
        />
      </UploadImageWrapper>
    )
  }
}

export default withToastManager<UploadImageProps>(UploadImageField)
