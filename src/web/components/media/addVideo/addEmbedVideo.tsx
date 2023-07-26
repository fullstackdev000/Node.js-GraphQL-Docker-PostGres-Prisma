import * as React from 'react'
import EmbedVideoForm from '../videoForms/embedVideoForm'

import {
  AddEmbedVideoMutationVariables
} from '#veewme/gen/graphqlTypes'
import { AddEmbedVideo as AddEmbedVideoMutation } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
// import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

interface AddEmbedVideoProps {
  onSubmitSuccess: () => void
  realEstateId: number
}

const AddEmbedVideo: React.FC<AddEmbedVideoProps> = props => {

  const { addToast } = useToasts()
  const [addVideo, { loading }] = useMutation<{}, AddEmbedVideoMutationVariables>(AddEmbedVideoMutation, {
    onCompleted: () => {
      addToast('Video has been added successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      props.onSubmitSuccess()
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      <EmbedVideoForm
        onSubmit={values => addVideo({
          variables: {
            ...values,
            realEstateId: props.realEstateId
          }
        })}
      />
      <DotSpinnerModal isOpen={loading} />
    </>
  )
}

export default AddEmbedVideo
