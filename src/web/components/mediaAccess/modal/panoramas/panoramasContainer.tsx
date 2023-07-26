import {
  MediaManagementPanoramasQuery,
  MediaManagementPanoramasQueryVariables
} from '#veewme/gen/graphqlTypes'
import { MediaManagementPanoramas } from '#veewme/lib/graphql/queries'

import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { Spinner } from '../styled'
import Panoramas from './panoramas'

interface PanoramasContainerProps {
  realEstateId: MediaManagementPanoramasQuery['panoramas'][0]['id']
}

const PanoramasContainer: React.FunctionComponent<PanoramasContainerProps> = props => {
  const { data, loading } = useQuery<MediaManagementPanoramasQuery, MediaManagementPanoramasQueryVariables>(MediaManagementPanoramas, {
    variables: {
      realEstateId: props.realEstateId
    }
  })

  return (
      <>
        <Spinner isProcessComplete={!loading} />
        {data && !!data.panoramas.length && <Panoramas panoramas={data.panoramas} />}
        {data && !data.panoramas.length && 'No items'}
      </>
  )
}
export default PanoramasContainer
