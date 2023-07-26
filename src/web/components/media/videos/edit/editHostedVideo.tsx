import {
  EditHostedVideoMutationVariables,
  MediaManagementPhotosQuery,
  MediaManagementPhotosQueryVariables,
  MediaManagementVideoQuery,
  MediaManagementVideoQueryVariables
} from '#veewme/gen/graphqlTypes'
import { EditHostedVideo as EditHostedVideoQuery, MediaManagementPhotosQuery as PhotosQuery, MediaManagementVideo } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { EditHostedVideoForm } from '../../videoForms/hostedVideoForm'

interface PhotosData {
  photos: NoNullableArrayItems<NoNullableFields<MediaManagementPhotosQuery['photos']>>
}

type VideoData = NoNullableFields<MediaManagementVideoQuery>

const EditHostedVideo: React.FunctionComponent<{
  onSuccess: () => void
}> = props => {
  const { realEstateId, videoId } = useParams()

  const { addToast } = useToasts()

  const { data: photosData, loading: loadingPhotos } = useQuery<PhotosData, MediaManagementPhotosQueryVariables>(PhotosQuery, {
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const { data, loading } = useQuery<VideoData, MediaManagementVideoQueryVariables>(MediaManagementVideo, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    variables: {
      id: Number(videoId)
    }
  })

  const [editVideo, { loading: editing }] = useMutation<{}, EditHostedVideoMutationVariables>(EditHostedVideoQuery, {
    onCompleted: () => {
      addToast('Video has been edited successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      props.onSuccess()
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      {
        data && photosData && <EditHostedVideoForm
          photos={photosData.photos}
          onSubmit={async values => {
            return editVideo({
              variables: {
                ...values,
                id: Number(videoId)
              }
            })
          }}
          initialData={{
            ...data.video
          }}
        />
      }
      <DotSpinnerModal isOpen={loading || editing || loadingPhotos} />
    </>
  )
}

export default EditHostedVideo
