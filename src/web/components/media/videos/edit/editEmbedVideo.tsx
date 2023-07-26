import {
  EditEmbedVideoMutationVariables,
  MediaManagementVideoQuery,
  MediaManagementVideoQueryVariables
} from '#veewme/gen/graphqlTypes'
import { EditEmbedVideo as EditEmbedVideoQuery , MediaManagementVideo } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import EmbedVideoForm from '../../videoForms/embedVideoForm'

type VideoData = NoNullableFields<MediaManagementVideoQuery>

const EditEmbedVideo: React.FunctionComponent<{
  onSuccess: () => void
}> = props => {
  const { videoId } = useParams()

  const { addToast } = useToasts()
  const { data, loading } = useQuery<VideoData, MediaManagementVideoQueryVariables>(MediaManagementVideo, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    variables: {
      id: Number(videoId)
    }
  })

  const [editVideo, { loading: editing }] = useMutation<{}, EditEmbedVideoMutationVariables>(EditEmbedVideoQuery, {
    onCompleted: () => {
      addToast('Video has been edited successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      props.onSuccess()
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      {
        data && <EmbedVideoForm
          onSubmit={values => editVideo({
            variables: {
              ...values,
              id: Number(videoId)
            }
          })}
          edit
          initialData={{
            ...data.video
          }}
        />
      }
      <DotSpinnerModal isOpen={loading || editing} />
    </>
  )
}

export default EditEmbedVideo
