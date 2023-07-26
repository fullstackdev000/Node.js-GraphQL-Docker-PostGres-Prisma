import * as React from 'react'
import Button from '../../common/buttons/basicButton'
import DeleteConfirmation from '../../common/deleteConfirmation'

import { Close } from 'styled-icons/material'

interface MediaDeleteBtnProps {
  onDelete: () => void
  itemTitle: string
}

const MediaDeleteBtn: React.FunctionComponent<MediaDeleteBtnProps> = props => (
  <DeleteConfirmation
    onConfirm={props.onDelete}
    message={<>Are you sure you want to delete <strong>{props.itemTitle}</strong>?</>}
  >
    {toggleDeleteConfirmation => (<Button
      buttonTheme='primary'
      icon={Close}
      label='Delete'
      onClick={toggleDeleteConfirmation}
    />)}
  </DeleteConfirmation>
)

export default MediaDeleteBtn
