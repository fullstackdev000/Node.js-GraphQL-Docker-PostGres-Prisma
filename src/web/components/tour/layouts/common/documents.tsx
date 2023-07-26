// import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
// import styled from '#veewme/web/common/styled-components'
import DocumentsList from '#veewme/web/components/mediaAccess/modal/documents/documents'
import * as React from 'react'
import { Tour } from '../../types'

interface DocumentsModalProps {
  toggleModal: () => void
  modalVisible: boolean
  tour: Tour
}

const DocumentsModal: React.FunctionComponent<DocumentsModalProps> = props => {
  return (
    <Modal
      centerVertically
      title='Documents'
      isOpen={props.modalVisible}
      onRequestClose={props.toggleModal}
    >
      <DocumentsList documents={props.tour.documents} />
    </Modal>
  )
}

export default DocumentsModal
