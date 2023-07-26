import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Button from '../../../common/buttons/basicButton'
import MediaDeleteBtn from '../mediaItemDeleteBtn'
import { MediaItem, MediaItemButtons, MediaItemInfo, MediaItemMain, MediaItemType } from '../styled'
import { OrderDocumentBase } from '../types'

import { File } from 'styled-icons/boxicons-regular'
import { Edit } from 'styled-icons/boxicons-solid'

interface DocumentsListProps extends RouteComponentProps {
  document: OrderDocumentBase
  onDelete: (id: OrderDocumentBase['id']) => void
}

const DocumentsList: React.FunctionComponent<DocumentsListProps> = props => {
  const { document, match: { url } } = props
  const handleDelete = React.useCallback(() => props.onDelete(document.id), [])
  const minSizeToDisplayInMB = 0.1 * 1024 // 0.1 MB in KB

  const sizeKb = document.size / 1024
  let displaySize = `${(sizeKb).toFixed(1)} KB`
  if (sizeKb > minSizeToDisplayInMB) {
    displaySize = `${(sizeKb / 1024).toFixed(1)} MB`
  }

  return (
    <>
      <MediaItem>
        <MediaItemType>
          <File size='30' />
          <span>{document.extension}</span>
        </MediaItemType>
        <MediaItemMain>
          <MediaItemInfo>
            <span>{document.label}</span>
            <span> {`${document.extension}, ${displaySize}`}</span>
          </MediaItemInfo>
          <MediaItemButtons>
            <Button
              buttonTheme='primary'
              icon={Edit}
              label='Edit'
              to={`${url}/document/${document.id}`}
            />
            <MediaDeleteBtn
              itemTitle={document.label}
              onDelete={handleDelete}
            />
          </MediaItemButtons>
        </MediaItemMain>
      </MediaItem>
    </>
  )
}

export default withRouter(DocumentsList)
