import {
  SetPasswordMutation,
  SetPasswordMutationVariables
} from '#veewme/gen/graphqlTypes'
import { SetPassword } from '#veewme/lib/graphql/queries'
import * as urls from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PasswordForm from './setPasswordForm'

import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

const SetPasswordContainer: React.FunctionComponent = () => {
  const { search } = useLocation()
  const history = useHistory()
  const token = search.split('?token=')[1]

  log.debug(token)

  const { addToast } = useToasts()
  const [setPassword, { loading }] = useMutation<SetPasswordMutation, SetPasswordMutationVariables>(SetPassword, {
    onCompleted: () => {
      addToast('Password has been set.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 })
      history.push(urls.publicUrls.login)
    },
    onError: err => {
      addToast(err.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
    }
  })

  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      <PasswordForm
        onSubmit={values => setPassword({
          variables: {
            data: {
              password: values.user.password,
              resetToken: token
            }
          }
        })}
      />
    </>
  )
}

export default SetPasswordContainer
