import {
  UploadMediaDocumentMutationVariables
} from '#veewme/gen/graphqlTypes'

import * as log from '#veewme/web/common/log'
import { guidGenerator } from '#veewme/web/common/util'
import * as React from 'react'
import { Header, ListTitle, ListWrapper } from '../styled'
import { OrderDocumentBase } from '../types'
import Uploader from '../uploader'
import { UploadProgressData } from './documentsContainer'
import DocumentsList from './documentsList'

export const subscriptionTopicName = 'uploadDocumentProgress'

interface DocumentsProps {
  documents: OrderDocumentBase[]
  uploadDocument: (variables: Omit<UploadMediaDocumentMutationVariables, 'realEstateId'>) => Promise<{}>
  deleteDocument: (id: OrderDocumentBase['id']) => void
}

class Documents extends React.PureComponent<DocumentsProps> {

  handleOrderDocumentsDelete = (id: OrderDocumentBase['id']) => {
    log.debug('delete', id)
    this.props.deleteDocument(id)
  }

  render () {
    return (
      <ListWrapper>
        <Header>
          <ListTitle>Documents</ListTitle>
        </Header>
        <Uploader
          server={{
            process: (_fieldName, file, _metadata, load, error, progress, abort) => {
              const id = guidGenerator()

              this.props.uploadDocument({
                appearance: 'Always',
                file,
                label: file.name,
                photoIdentification: id
              })
              .then(() => {
                load()
              })
              .catch(e => error(e))

              PubSub.subscribe(subscriptionTopicName, (msg: string, progressData: UploadProgressData) => {
                const data = progressData.uploadRealEstatePhotoProgress
                if (data && data.photoIdentification === id) {
                  progress(true, data.progress, 100)
                }
              })

              return {
                abort: () => {
                  abort()
                }
              }
            },
            revert: null
          }}
          acceptedFileTypes={[
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/pdf'
          ]}
        />
        {
          <DocumentsList
            documents={this.props.documents}
            onDelete={this.handleOrderDocumentsDelete}
          />
        }
      </ListWrapper>
    )
  }
}

export default Documents
