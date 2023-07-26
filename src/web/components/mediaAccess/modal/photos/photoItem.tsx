import SelectablePhoto, { Checkmark, Wrapper } from '#veewme/web/common/selectablePhoto'
import { itemShadow } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { PhotoBasic } from '../../types'
import DownloadMenu from './photoDownloadMenu'

const Photo = styled.div<{
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
`

interface PhotoItemProps {
  photo: PhotoBasic
  checked?: boolean
  onSelect: (id: PhotoBasic['id']) => void
}

const PhotoItem: React.FunctionComponent<PhotoItemProps> = ({ checked, photo, onSelect }) => (
  <Photo checked={checked}>
    <SelectablePhoto
      thumbUrl={photo.thumbUrl}
      checked={checked}
      onSelect={() => onSelect(photo.id)}
    />
    <DownloadMenu webUrl={photo.webUrl} printUrl={photo.fullUrl}/>
  </Photo>
)

export default PhotoItem
