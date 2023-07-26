import * as React from 'react'
import FauxVideoForm from '../videoForms/fauxVideoForm'

import {
  AddFauxVideoMutationVariables,
  MediaManagementPhotosQuery,
  MediaManagementPhotosQueryVariables
} from '#veewme/gen/graphqlTypes'
import { AddFauxVideo as AddFauxVideoMutation, MediaManagementPhotosQuery as PhotosQuery } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

interface AddFauxVideoProps {
  onSubmitSuccess: () => void
  realEstateId: number
}

interface PhotosData {
  photos: NoNullableArrayItems<NoNullableFields<MediaManagementPhotosQuery['photos']>>
}

const AddFauxVideo: React.FC<AddFauxVideoProps> = props => {

  const { addToast } = useToasts()

  const { data, loading } = useQuery<PhotosData, MediaManagementPhotosQueryVariables>(PhotosQuery, {
    variables: {
      realEstateId: Number(props.realEstateId)
    }
  })

  const [addVideo, { loading: adding }] = useMutation<{}, AddFauxVideoMutationVariables>(AddFauxVideoMutation, {
    onCompleted: () => {
      addToast('Video has been added successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      props.onSubmitSuccess()
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      {
        data && <FauxVideoForm
          photos={data.photos}
          onSubmit={values => addVideo({
            variables: {
              ...values,
              realEstateId: props.realEstateId
            }
          })}
        />
      }
      <DotSpinnerModal isOpen={loading || adding} />
    </>
  )
}

export default AddFauxVideo
