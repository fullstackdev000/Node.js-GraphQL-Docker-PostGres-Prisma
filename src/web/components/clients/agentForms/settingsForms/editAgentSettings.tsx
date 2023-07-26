import { AgentQuery, AgentQueryVariables, Role, UpdateAgentMutation, UpdateAgentMutationVariables } from '#veewme/gen/graphqlTypes'
import { Agent, UpdateAgent } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import AgentForm from './agentForm'
import { AgentSettings } from './types'
// import { AgentQuery } from './types'

import { NoNullableFields } from '#veewme/web/common/util'

type AgentData = NoNullableFields<AgentQuery>

interface EditAgentSettingsProps {
  role: Role
}

const EditAgentSettings: React.FunctionComponent<EditAgentSettingsProps> = props => {
  const { addToast } = useToasts()
  const { id } = useParams<{
    id: string
  }>()

  const agentId = Number(id)
  const { data, loading: queryLoading } = useQuery<AgentData, AgentQueryVariables>(Agent, { variables: { id: agentId } })
  const history = useHistory()

  const [updateAgent, { loading: updateLoading }] = useMutation<UpdateAgentMutation, UpdateAgentMutationVariables>(
    UpdateAgent,
    {
      onCompleted: result => {
        addToast(
          `Agent ${result.updateAgent.user.email} was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
        )
        history.push(`${privateUrls.dashboard}?allowRedirect`)
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
      region,
      ...agent
    } = data.agent

    return (
      <>
        <AgentForm
          name={`${agent.user.firstName} ${agent.user.lastName}`}
          initialData={{
            ...agent
          }}
          onSubmit={(values: AgentSettings) => {
            const variables = {
              ...values,
              affiliateId: affiliate.id,
              id: agent.id
            }
            updateAgent({ variables }).catch(error => addToast(
              `Error ${error.message} while updating Agent`,
              { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
            ))
          }}
          role={props.role}
        />
        <DotSpinnerModal isOpen={updateLoading} />
      </>
    )
  } else {
    return <DotSpinnerModal isOpen={queryLoading} />
  }
}

export default EditAgentSettings
