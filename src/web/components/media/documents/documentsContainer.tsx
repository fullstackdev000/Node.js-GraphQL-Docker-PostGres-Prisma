import {
  DeleteDocumentMutationVariables,
  MediaManagementDocumentsQuery,
  MediaManagementDocumentsQueryVariables,
  UploadMediaDocumentMutationVariables,
  UploadRealEstatePhotoProgressSubscription
} from '#veewme/gen/graphqlTypes'
import {
  DeleteDocument,
  MediaManagementDocumentsQuery as DocumentsQuery,
  UploadMediaDocument,
  UploadRealEstatePhotoProgress
} from '#veewme/lib/graphql/queries/media'

import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Documents, { subscriptionTopicName } from './documents'

export interface UploadProgressData {
  uploadRealEstatePhotoProgress: NoNullableFields<UploadRealEstatePhotoProgressSubscription['uploadRealEstatePhotoProgress']>
}

interface DocumentsData {
  mediaDocuments: NoNullableArrayItems<NoNullableFields<MediaManagementDocumentsQuery['mediaDocuments']>>
}

const DocumentsContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const { realEstateId } = useParams<{ realEstateId: string }>() // route params always are strings
  const { data, loading } = useQuery<DocumentsData, MediaManagementDocumentsQueryVariables>(DocumentsQuery, {
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const [ uploadDocument ] = useMutation<{}, UploadMediaDocumentMutationVariables>(UploadMediaDocument, {
    awaitRefetchQueries: true,
    refetchQueries: ['MediaManagementDocuments']
  })

  useSubscription<UploadProgressData>(UploadRealEstatePhotoProgress, {
    onSubscriptionData: options => {
      PubSub.publish(subscriptionTopicName, options.subscriptionData.data)
      // log.debug(options.subscriptionData.data)
    },
    variables: { realEstateId: Number(realEstateId) }
  })

  const [deleteDocument, { loading: deleting }] = useMutation<{}, DeleteDocumentMutationVariables>(DeleteDocument, {
    awaitRefetchQueries: true,
    onCompleted: e => addToast('Item has been deleted.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }),
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    refetchQueries: ['MediaManagementDocuments']
  })

  return (
      <>
        <DotSpinnerModal isOpen={loading || deleting} />
        {data && <Documents
          deleteDocument={id => deleteDocument({ variables: { id } })}
          documents={data.mediaDocuments}
          uploadDocument={variables =>
            uploadDocument({ variables: {
              ...variables,
              realEstateId: Number(realEstateId)
            } })
          }
        />}
      </>
  )
}
export default DocumentsContainer
