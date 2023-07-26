import {
  EditFauxVideoMutationVariables,
  MediaManagementVideoQuery,
  MediaManagementVideoQueryVariables
} from '#veewme/gen/graphqlTypes'
import { EditFauxVideo as EditFauxVideoQuery , MediaManagementVideo } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import FauxVideoForm from '../../videoForms/fauxVideoForm'

type VideoData = NoNullableFields<MediaManagementVideoQuery>

const EditFauxVideo: React.FunctionComponent<{
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

  const [editVideo, { loading: editing }] = useMutation<{}, EditFauxVideoMutationVariables>(EditFauxVideoQuery, {
    onCompleted: () => {
      addToast('Video has been edited successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      props.onSuccess()
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      {
        data && <FauxVideoForm
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

export default EditFauxVideo
