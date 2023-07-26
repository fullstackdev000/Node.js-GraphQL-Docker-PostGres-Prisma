import {
  RequestResetPasswordMutation,
  RequestResetPasswordMutationVariables
} from '#veewme/gen/graphqlTypes'
import { RequestResetPassword } from '#veewme/lib/graphql/queries'
// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import ResetForm from './resetPasswordForm'

import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

const ResetContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const [requestResetPassword, { loading }] = useMutation<RequestResetPasswordMutation, RequestResetPasswordMutationVariables>(RequestResetPassword, {
    onCompleted: () => {
      addToast('Reset password link has been sent.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 })
    },
    onError: err => {
      addToast(err.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
    }
  })

  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      <ResetForm
        onSubmit={({ userName }) => requestResetPassword({
          variables: {
            data: {
              email: userName
            }
          }
        })}
      />
    </>
  )
}

export default ResetContainer
