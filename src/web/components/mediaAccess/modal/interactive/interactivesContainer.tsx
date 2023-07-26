import {
  MediaAccessInteractivesQuery,
  MediaAccessInteractivesQueryVariables
} from '#veewme/gen/graphqlTypes'
import { MediaAccessInteractives as InteractivesQuery } from '#veewme/lib/graphql/queries/media'

import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { Spinner } from '../styled'
import Interactives from './interactives'

interface InteractivesData {
  mediaInteractives: NoNullableArrayItems<NoNullableFields<MediaAccessInteractivesQuery['mediaInteractives']>>
}

interface InteractivesContainerProps {
  realEstateId: InteractivesData['mediaInteractives'][0]['id']
}

const InteractivesContainer: React.FunctionComponent<InteractivesContainerProps> = props => {
  const { data, loading } = useQuery<InteractivesData, MediaAccessInteractivesQueryVariables>(InteractivesQuery, {
    variables: {
      realEstateId: props.realEstateId
    }
  })

  return (
      <>
        <Spinner isProcessComplete={!loading} />
        {data && !!data.mediaInteractives.length && <Interactives interactives={data.mediaInteractives} />}
        {data && !data.mediaInteractives.length && 'No items'}
      </>
  )
}
export default InteractivesContainer
