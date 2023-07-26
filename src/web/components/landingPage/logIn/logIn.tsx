import { LogInMutation, LogInMutationVariables, MeQuery, Role } from '#veewme/gen/graphqlTypes'
import { LogIn as LogInReq, Me } from '#veewme/lib/graphql/queries'
import * as urls from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useLocation } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import LoginForm from './loginForm/loginForm'

export type RolesRedirections = {[K in Role]: string}

const rolesRedirections: RolesRedirections = {
  ADMIN: urls.privateUrls.panel,
  AFFILIATE: urls.privateUrls.panel,
  AGENT: urls.privateUrls.panel,
  DEVELOPER: urls.privateUrls.panel,
  PHOTOGRAPHER: urls.privateUrls.photographerOrders,
  PROCESSOR: urls.privateUrls.jobs,
  SELFSERVICEAGENT: urls.privateUrls.panel
}

const LogIn: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const history = useHistory()
  const { search } = useLocation()

  const isDevMode = search.indexOf('dev') > -1

  useQuery<MeQuery>(Me, {
    onCompleted: data => {
      if (data && data.me) {
        const redirectUrl = rolesRedirections[data.me.role]
        history.push(redirectUrl)
      }
    }
  })

  const [logIn, { error, loading }] = useMutation<LogInMutation, LogInMutationVariables>(LogInReq, {
    onCompleted: ({
      logIn: { role }
    }) => {
      const redirectUrl = rolesRedirections[role]
      history.push(redirectUrl)
    },
    onError: err => {
      addToast(err.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
    }
  })

  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      <LoginForm
        onSubmit={values => logIn({ variables: values })}
      />
      {/* TODO remove below component later. Leave it for now for quick login*/}
      {isDevMode && (
        <div style={{ margin: '20px 10%' }}>
          <div>Temporary quick login test buttons. Will be removed later</div>
          <Button
            label='Non-existing user'
            onClick={() => {
              logIn({ variables: {
                email: 'non-existing',
                password: 'password'
              }}).catch()
            }}
          />
          <Button
            label='Admin'
            onClick={() => {
              logIn({ variables: {
                email: 'admin@2.veewme.com',
                password: 'password'
              }}).catch()
            }}
          />
          <Button
            label='Developer'
            onClick={() => {
              logIn({ variables: {
                email: 'developer@2.veewme.com',
                password: 'password'
              }}).catch()
            }}
          />
          <Button
            label='Affiliate'
            onClick={() => {
              logIn({ variables: {
                email: 'affiliate1@2.veewme.com',
                password: 'password'
              }}).catch()
            }}
          />
          <Button
            label='Agent'
            onClick={() => {
              logIn({ variables: {
                email: 'agent1@2.veewme.com',
                password: 'password'
              }}).catch()
            }}
          />
          <Button
            label='Photographer'
            onClick={() => {
              logIn({ variables: {
                email: 'photographer@2.veewme.com',
                password: 'password'
              }}).catch()
            }}
          />
          <Button
            label='Processor'
            onClick={() => {
              logIn({ variables: {
                email: 'processor@2.veewme.com',
                password: 'password'
              }}).catch()
            }}
          />
          {error &&
            <div>
              Bad credentials
            </div>
          }
        </div>
      )}

    </>
  )
}

export default LogIn
