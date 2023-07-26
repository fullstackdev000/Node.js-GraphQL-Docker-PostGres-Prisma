import PubSub from 'pubsub-js'
import * as React from 'react'
import { AddFormValues, AddHostedVideoForm } from '../videoForms/hostedVideoForm'
import { VideoDisableOverlay } from '../videoForms/styled'
import { subscriptionTopicName, UploadProgressData } from '../videoForms/videoUpload'

import {
  AddHostedVideoMutationVariables,
  MediaManagementPhotosQuery,
  MediaManagementPhotosQueryVariables
} from '#veewme/gen/graphqlTypes'
import { AddHostedVideo as AddHostedVideoMutation, MediaManagementPhotosQuery as PhotosQuery, UploadRealEstatePhotoProgress } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

interface PhotosData {
  photos: NoNullableArrayItems<NoNullableFields<MediaManagementPhotosQuery['photos']>>
}

interface AddHostedVideoProps {
  onSubmitSuccess: () => void
  realEstateId: number
}

const AddHostedVideo: React.FC<AddHostedVideoProps> = props => {

  const { addToast } = useToasts()

  const { data, loading } = useQuery<PhotosData, MediaManagementPhotosQueryVariables>(PhotosQuery, {
    variables: {
      realEstateId: Number(props.realEstateId)
    }
  })

  useSubscription<UploadProgressData>(UploadRealEstatePhotoProgress, {
    onSubscriptionData: options => {
      PubSub.publish(subscriptionTopicName, options.subscriptionData.data)
    },
    variables: { realEstateId: props.realEstateId }
  })

  const [addVideo, { loading: adding }] = useMutation<{}, AddHostedVideoMutationVariables>(AddHostedVideoMutation, {
    onCompleted: () => {
      addToast('Video has been added successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      props.onSubmitSuccess()
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      {
        data && <AddHostedVideoForm
          photos={data.photos}
          onSubmit={values => addVideo({
            variables: {
              // Assure that 'file' field is sent.
              // If it was required field on form level it would require mocking empty file in initial data
              ...values as Required<AddFormValues>,
              realEstateId: props.realEstateId
            }
          })}
        />
      }
      <DotSpinnerModal isOpen={loading} />
      {adding && <VideoDisableOverlay />}
    </>
  )
}

export default AddHostedVideo
