import {
  ChangePasswordMutation,
  ChangePasswordMutationVariables
} from '#veewme/gen/graphqlTypes'
import { ChangePassword } from '#veewme/lib/graphql/queries'
// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import PasswordForm from './changePasswordForm'

import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

const ChangePasswordContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const [changePassword, { loading }] = useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePassword, {
    onCompleted: () => {
      addToast('Password has been changed.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 })
    },
    onError: err => {
      addToast(err.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
    }
  })

  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      <PasswordForm
        onSubmit={values => changePassword({
          variables: {
            data: {
              newPassword: values.user.password,
              oldPassword: values.oldPassword
            }
          }
        })}
      />
    </>
  )
}

export default ChangePasswordContainer
