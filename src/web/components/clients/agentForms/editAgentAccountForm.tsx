import { AgentAccountQueryVariables, UpdateAgentAccountMutation, UpdateAgentAccountMutationVariables } from '#veewme/gen/graphqlTypes'
import { AgentAccount, UpdateAgentAccount } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import { prepareEditorValueForStorage } from '#veewme/lib/util'
import { AgentAccountValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { convertFromRaw, EditorState } from 'draft-js'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import AgentForm from './agentForm'
import { AgentAccountQuery } from './types'

interface EditAgentAccountFormProps extends RouteComponentProps {
  agentId: AgentAccountQuery['agent']['id']
}
const EditAgentAccountForm: React.FunctionComponent<EditAgentAccountFormProps> = props => {
  const { addToast } = useToasts()

  const { data, loading: queryLoading } = useQuery<AgentAccountQuery, AgentAccountQueryVariables>(AgentAccount, {
    onError: error => log.debug('Query AgentAccount error:', error.message),
    variables: {
      id: props.agentId
    }
  })

  const [updateAgentAccount, { client, loading: updateLoading }] = useMutation<UpdateAgentAccountMutation, UpdateAgentAccountMutationVariables>(
    UpdateAgentAccount,
    {
      onCompleted: result => {
        addToast(
          `Agent ${result.updateAgent.user.email} was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        client && client.writeData({ data: {
          me: {
            __typename: 'Account',
            firstName: result.updateAgent.user.firstName,
            lastName: result.updateAgent.user.lastName
          }
        }})
        props.history.push(`${privateUrls.dashboard}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating Agent`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        log.debug(error.message)
      }
    }
  )

  if (data && data.agent) {
    const {
      affiliate,
      brokerage,
      ...agent
    } = data.agent

    return (
      <>
        <AgentForm
          affiliate={affiliate}
          name={`${agent.user.firstName} ${agent.user.lastName}`}
          initialData={{
            ...agent,
            bio: agent.bio ? EditorState.createWithContent(convertFromRaw(agent.bio)) : EditorState.createEmpty(),
            brokerageId: brokerage && brokerage.id,
            socialMedia: {
              facebookLink: agent.facebookLink,
              instagramLink: agent.instagramLink,
              linkedinLink: agent.linkedinLink,
              pinterestLink: agent.pinterestLink,
              twitterLink: agent.twitterLink
            }
          }}
          onSubmit={(values: AgentAccountValues) => {
            const variables = {
              ...values,
              affiliateId: affiliate && affiliate.id,
              bio: prepareEditorValueForStorage(values.bio),
              id: agent.id
            }
            updateAgentAccount({ variables }).catch(error => addToast(
              `Error ${error.message} while updating Agent`,
              { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
            ))
          }}
          role='AGENT'
        />
        <DotSpinnerModal isOpen={queryLoading || updateLoading} />
      </>
    )
  }
  return <DotSpinnerModal isOpen={queryLoading || updateLoading} />
}

export default withRouter(EditAgentAccountForm)
