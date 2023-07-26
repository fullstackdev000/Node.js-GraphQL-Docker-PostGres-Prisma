import {
  MediaAccessVideosQuery,
  MediaAccessVideosQueryVariables
} from '#veewme/gen/graphqlTypes'
import { MediaAccessVideos } from '#veewme/lib/graphql/queries'

import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { Spinner } from '../styled'
import Videos from './videos'

interface VideosData {
  videos: NoNullableArrayItems<NoNullableFields<MediaAccessVideosQuery['videos']>>
}

interface VideosContainerProps {
  realEstateId: VideosData['videos'][0]['id']
}

const VideosContainer: React.FunctionComponent<VideosContainerProps> = props => {
  const { data, loading } = useQuery<VideosData, MediaAccessVideosQueryVariables>(MediaAccessVideos, {
    variables: {
      realEstateId: props.realEstateId
    }
  })

  return (
      <>
        <Spinner isProcessComplete={!loading} />
        {data && !!data.videos.length && <Videos videos={data.videos} />}
        {data && !data.videos.length && 'No items'}
      </>
  )
}
export default VideosContainer
