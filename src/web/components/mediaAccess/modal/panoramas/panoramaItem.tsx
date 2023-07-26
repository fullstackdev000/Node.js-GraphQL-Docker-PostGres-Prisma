import SelectablePhoto, { Checkmark, PhotoWrapper, Wrapper } from '#veewme/web/common/selectablePhoto'
import { itemShadow } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { PanoramaBasic } from '../../types'
import DownloadMenu from '../photos/photoDownloadMenu'

const Panorama = styled.div<{
  checked?: boolean
}>`
  position: relative;
  width: 100%;
  min-height: 60px;
  ${props => props.checked && itemShadow}

  &:hover {
    ${itemShadow}
  }

  img {
    width: 100%;
    display: block;
    filter: none;
    opacity: 1;
  }

  ${Wrapper} {
    padding: 3px;
  }

  ${Checkmark} {
    left: unset;
    right: 15px;
    top: 10px;
  }

  ${PhotoWrapper} {
    &:before {
      padding-top: 40%;
    }
  }
`

interface PanoramaItemProps {
  panorama: PanoramaBasic
  checked?: boolean
  onSelect: (id: PanoramaBasic['id']) => void
}

const PanoramaItem: React.FunctionComponent<PanoramaItemProps> = ({ checked, panorama, onSelect }) => (
  <Panorama checked={checked}>
    <SelectablePhoto
      thumbUrl={panorama.thumbUrl}
      checked={checked}
      onSelect={() => onSelect(panorama.id)}
      panoramicAspectRatio
    />
    <DownloadMenu webUrl={panorama.fullUrl} />
  </Panorama>
)

export default PanoramaItem
