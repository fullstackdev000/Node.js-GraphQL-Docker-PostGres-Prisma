import { FileValue, ImageDimensions } from '#veewme/lib/types'
import * as React from 'react'
import { CropShape } from 'react-easy-crop'
import { UnreachableCaseError } from '../../../../lib/error'
import PhotographerSvg from '../../../assets/svg/photographer.svg'
import UploadSvg from '../../../assets/svg/upload.svg'
import styled, { css } from '../../styled-components'

export const previewBasicDimension = 200

const calculateAdjustedDimensions = (preview: ImageDimensions, full: ImageDimensions): ImageDimensions => {
  const scaleAccordingToHeight = preview.height / full.height
  const scaleAccordingToWidth = preview.width / full.width

  if (preview.height >= full.height && preview.width >= full.width) {
    return full
  } else if (preview.height >= full.height && preview.width < full.width) {
    return {
      height: scaleAccordingToWidth * full.height,
      width: scaleAccordingToWidth * full.width
    }
  } else if (preview.height < full.height && preview.width >= full.width) {
    return {
      height: scaleAccordingToHeight * full.height,
      width: scaleAccordingToHeight * full.width
    }
  } else if (preview.height < full.height && preview.width < full.width) {
    const scale = scaleAccordingToHeight < scaleAccordingToWidth
      ? scaleAccordingToHeight : scaleAccordingToWidth
    return {
      height: scale * full.height,
      width: scale * full.width
    }
  }

  return preview
}

const portraitPreviewWrapperStyle = css`
  width: 100%;
  min-width: ${previewBasicDimension}px;
  height: ${previewBasicDimension}px;
`

export type FieldOrientation =
  | 'landscape' // controls (buttons, labels, etc.) at the bottom
  | 'portrait' // controls on the side

const PreviewWrapper = styled.div<{fieldOrientation: FieldOrientation}>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  ${props => {
    switch (props.fieldOrientation) {
      case 'landscape': return `
        width: ${previewBasicDimension}px;
        height: 100%;
      `
      case 'portrait': return portraitPreviewWrapperStyle
      default: throw new UnreachableCaseError(props.fieldOrientation)
    }
  }}
`

const PreviewImg = styled.div<{
  cropShape: CropShape
  previewDimensions: ImageDimensions
}>`
  width: ${props => props.previewDimensions.width}px;
  height:${props => props.previewDimensions.height}px;
  border-radius: 5px;
  overflow: hidden;
  object-fit: contain;
  border: 2px solid ${props => props.theme.colors.BORDER};
  position: relative;
  background-color: white;
  color: ${props => props.theme.colors.LIGHT_BLUISH_GREY};
  font-weight: 600;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  ${props => props.cropShape === 'round' ? 'border-radius: 100%' : ''}
  img {
    max-width: 100%;
    max-height: 100%;
  }
  svg {
    height: 40%;
    width: 40%;
    fill: ${props => props.theme.colors.LIGHT_BLUISH_GREY};
    margin: 10px;
  }
  p {
    text-align: center;
    padding: 0 5px;
  }
`

export type ImageType = 'media' | 'photo'

const generatePlaceholderIcon: React.FunctionComponent<{imageType: ImageType}> = props => {
  switch (props.imageType) {
    case 'media': return (
      <>
        <UploadSvg />
        <p>Add media</p>
      </>
    )
    case 'photo': return <PhotographerSvg />
    default: throw new UnreachableCaseError(props.imageType)
  }
}

interface UploadImagePreviewProps {
  className?: string
  cropShape: CropShape
  imageFullDimensions: ImageDimensions
  imageType: ImageType
  fieldOrientation: FieldOrientation
  value?: FileValue
}

interface UploadImagePreviewState {
  dimensionsAdjustedToPreviewWindow: ImageDimensions
  imgSrc?: string
}

class UploadImagePreview extends React.PureComponent<UploadImagePreviewProps, UploadImagePreviewState> {
  static defaultProps = {
    cropShape: 'rect',
    imageType: 'photo'
  }

  state: UploadImagePreviewState = {
    dimensionsAdjustedToPreviewWindow: {
      height: previewBasicDimension,
      width: previewBasicDimension
    }
  }

  private previewWrapperRef = React.createRef<HTMLDivElement>()

  adjustDimensions = () => {
    if (this.previewWrapperRef.current) {
      const offsetDimensions = {
        height: this.previewWrapperRef.current.offsetHeight,
        width: this.previewWrapperRef.current.offsetWidth
      }
      this.setState({
        dimensionsAdjustedToPreviewWindow: calculateAdjustedDimensions(offsetDimensions, this.props.imageFullDimensions)
      })
    }
  }

  componentDidMount () {
    if (this.previewWrapperRef.current) {
      this.adjustDimensions()
      window.addEventListener('resize', this.adjustDimensions)
    }
    this.setState({ imgSrc: this.props.value && this.props.value.path })
  }

  componentDidUpdate (prevProps: UploadImagePreviewProps, prevState: UploadImagePreviewState) {
    if (this.props.value) {
      if (this.props.value.file !== (prevProps.value && prevProps.value.file)) {
        this.setState({ imgSrc: URL.createObjectURL(this.props.value.file) })
      } else if (this.props.value.path !== (prevProps.value && prevProps.value.path)) {
        this.setState({ imgSrc: this.props.value.path })
      }
    } else if (this.props.value !== prevProps.value) {
      this.setState({ imgSrc: this.props.value })
    }
  }

  componentWillUnmount () {
    if (this.previewWrapperRef.current) {
      window.removeEventListener('resize', this.adjustDimensions)
    }
  }

  render () {
    return (
      <PreviewWrapper className={this.props.className} ref={this.previewWrapperRef} fieldOrientation={this.props.fieldOrientation}>
        <PreviewImg
          cropShape={this.props.cropShape}
          previewDimensions={this.state.dimensionsAdjustedToPreviewWindow}
        >
          {this.state.imgSrc ? <img src={this.state.imgSrc} alt='Avatar'/> : generatePlaceholderIcon({ imageType: this.props.imageType })}
        </PreviewImg>
      </PreviewWrapper>
    )
  }
}

export default UploadImagePreview
