import {
  MediaAccessDocumentsQuery,
  MediaAccessDocumentsQueryVariables
} from '#veewme/gen/graphqlTypes'
import { MediaAccessDocumentsQuery as DocumentsQuery } from '#veewme/lib/graphql/queries/media'

import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { Spinner } from '../styled'
import Documents from './documents'

interface DocumentsData {
  mediaDocuments: NoNullableArrayItems<NoNullableFields<MediaAccessDocumentsQuery['mediaDocuments']>>
}

interface DocumentsContainerProps {
  realEstateId: MediaAccessDocumentsQuery['mediaDocuments'][0]['id']
}

const DocumentsContainer: React.FunctionComponent<DocumentsContainerProps> = props => {
  const { data, loading } = useQuery<DocumentsData, MediaAccessDocumentsQueryVariables>(DocumentsQuery, {
    variables: {
      realEstateId: props.realEstateId
    }
  })

  return (
      <>
        <Spinner isProcessComplete={!loading} />
        {data && !!data.mediaDocuments.length && <Documents documents={data.mediaDocuments} />}
        {data && !data.mediaDocuments.length && 'No documents'}
      </>
  )
}
export default DocumentsContainer
