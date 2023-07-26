import React, { FunctionComponent } from 'react'
import { ImagePlaceholder } from './styled'

interface BannerPlaceholderProps {
  width: number
  height: number
}

const BannerPlaceholder: FunctionComponent<BannerPlaceholderProps> = props => {
  return (
    <ImagePlaceholder width={props.width} height={props.height}>
        <div>No Overview photos/media have been selected to view here</div>
        <div>:(</div>
    </ImagePlaceholder>
  )
}
export default BannerPlaceholder
