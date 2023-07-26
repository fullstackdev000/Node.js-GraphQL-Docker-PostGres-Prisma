import * as React from 'react'
import UrlVideoForm from '../videoForms/urlVideoForm'

import {
  AddUrlVideoMutationVariables
} from '#veewme/gen/graphqlTypes'
import { AddUrlVideo as AddUrlVideoMutation } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
// import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

interface AddUrlVideoProps {
  onSubmitSuccess: () => void
  realEstateId: number
}

const AddUrlVideo: React.FC<AddUrlVideoProps> = props => {

  const { addToast } = useToasts()
  const [addVideo, { loading }] = useMutation<{}, AddUrlVideoMutationVariables>(AddUrlVideoMutation, {
    onCompleted: () => {
      addToast('Video has been added successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      props.onSubmitSuccess()
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      <UrlVideoForm
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

export default AddUrlVideo
