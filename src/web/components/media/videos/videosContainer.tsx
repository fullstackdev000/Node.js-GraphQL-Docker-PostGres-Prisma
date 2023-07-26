import {
  DeleteVideoMutationVariables,
  MediaManagementVideosQuery,
  MediaManagementVideosQueryVariables,
  ReorderVideosMutationVariables
} from '#veewme/gen/graphqlTypes'
import { DeleteVideo, MediaManagementVideos, ReorderVideos } from '#veewme/lib/graphql/queries'
// import * as log from '#veewme/web/common/log'
import HideForRole from '#veewme/web/common/hideForRole'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoAccessFallback } from '#veewme/web/common/ui-helpers'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Videos from './videos'

interface VideosData {
  videos: NoNullableArrayItems<NoNullableFields<MediaManagementVideosQuery['videos']>>
}

const VideosContainer: React.FC<RouteComponentProps> = props => {
  const { addToast } = useToasts()
  const { realEstateId } = useParams<{ realEstateId: string }>() // route params always are strings
  const { data, loading, refetch } = useQuery<VideosData, MediaManagementVideosQueryVariables>(MediaManagementVideos, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }),
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const [ reorderVideos ] = useMutation<{}, ReorderVideosMutationVariables>(ReorderVideos, {
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  const [ deleteVideo, { loading: deleting } ] = useMutation<{}, DeleteVideoMutationVariables>(DeleteVideo, {
    awaitRefetchQueries: true,
    refetchQueries: ['MediaManagementVideos']
  })

  return (
    <>
      <Videos
        videos={data && data.videos || []}
        reorderVideos={ids => reorderVideos({ variables: { ids } })}
        deleteVideo={id => deleteVideo({ variables: { id } })}
        {...props}
      />
      <DotSpinnerModal isOpen={loading || deleting} />
    </>
  )
}

const VideosAuth: React.FC<RouteComponentProps> = props => {
  return (
    <HideForRole
      action='hide'
      roles={['AGENT']}
      fallback={<NoAccessFallback />}
    >
      <VideosContainer {...props} />
    </HideForRole>
  )
}

export default VideosAuth
