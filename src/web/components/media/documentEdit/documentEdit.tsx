import {
  MediaDocumentFormInitialDataQuery,
  MediaDocumentFormInitialDataQueryVariables,
  UpdateMediaDocumentMutation,
  UpdateMediaDocumentMutationVariables
} from '#veewme/gen/graphqlTypes'
import { MediaDocumentFormInitialDataQuery as DocumentQuery, UpdateMediaDocument } from '#veewme/lib/graphql/queries/media'

import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
// import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { OrderDocumentDetails } from '../types'
import DocumentEditForm from './documentEditForm'

interface RouteParams {
  documentId: string
  realEstateId: string
}

const DocumentEdit: React.FunctionComponent = () => {
  const { documentId, realEstateId } = useParams<RouteParams>()

  const history = useHistory()
  const { addToast } = useToasts()

  const { data, loading: loadingInitialData } = useQuery<MediaDocumentFormInitialDataQuery, MediaDocumentFormInitialDataQueryVariables>(DocumentQuery, {
    variables: {
      id: Number(documentId)
    }
  })

  const [ updateDocument, { loading } ] = useMutation<UpdateMediaDocumentMutation, UpdateMediaDocumentMutationVariables>(UpdateMediaDocument, {
    onCompleted: () => {
      const redirectUrl = `${privateUrls.realEstate}/${realEstateId}/media/documents`
      history.push(redirectUrl)
      addToast(
        `Document was updated successfully.`,
        { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
      )
    },
    onError: error => {
      addToast(
        `Error ${error.message} occured.`,
        { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    }
  })

  return (
    <>
      <DotSpinnerModal isOpen={loading || loadingInitialData} />
      {
        data && <DocumentEditForm
          data={data.mediaDocument}
          onSubmit={(values: OrderDocumentDetails) => {
            updateDocument({
              variables: {
                ...values
              }
            }).catch(e => log.debug(e))
          }}
        />
      }
    </>
  )
}

export default DocumentEdit
