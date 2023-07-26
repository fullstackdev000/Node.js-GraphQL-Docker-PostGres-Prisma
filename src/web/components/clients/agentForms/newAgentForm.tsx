import { CreateAgentMutation, CreateAgentMutationVariables, MeQuery } from '#veewme/gen/graphqlTypes'
import { CreateAgent, Me } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import { prepareEditorValueForStorage } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import { templateOptions } from '#veewme/web/common/consts'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import { isAffiliateAccount, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import AgentForm from './agentForm'

const WarningPanel = styled(Panel)`
  width: 100%;
  margin: 30px;
  align-self: flex-start;

  div {
    margin-top: 15px;
  }
`

type MeData = NoNullableFields<MeQuery>

const NewAgentForm: React.FunctionComponent<RouteComponentProps> = props => {
  const { addToast } = useToasts()

  const { data, loading: meLoading } = useQuery<MeData>(Me, {
    fetchPolicy: 'network-only'
  })

  let affiliateWithoutBrokers = false
  if (data && isAffiliateAccount(data.me.account) && data.me.account.brokerages && !data.me.account.brokerages.length) {
    affiliateWithoutBrokers = true
  }

  const [createAgent, { loading: createLoading }] = useMutation<CreateAgentMutation, CreateAgentMutationVariables>(
    CreateAgent,
    {
      onCompleted: result => {
        addToast(
          `Agent ${result.createAgent.user.email} was created successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
        )
        props.history.push(`${privateUrls.agents}?allowRedirect`)
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

  if (data && data.me && data.me.account.__typename === 'Affiliate') {
    const brokerages = data.me.account.brokerages
    if (affiliateWithoutBrokers) {
      return (
        <WarningPanel heading='No Brokerages found'>
          Before adding Agent please add at least one Brokerage.
          <div>
            <Button
              buttonTheme='action'
              full
              label='Add Brokerage'
              size='medium'
              to={privateUrls.addBrokerage}
            />
          </div>
        </WarningPanel>
      )
    }
    return (
      <>
        <AgentForm
          role='AFFILIATE'
          onSubmit={variables => {
            const selectedBroker = brokerages.find(b => b.id === variables.brokerageId)
            const selectedBrokerTemplateId = selectedBroker ? selectedBroker.templateId : templateOptions[0].value
            createAgent({ variables: {
              ...variables,
              affiliateId: data.me.accountId,
              bio: prepareEditorValueForStorage(variables.bio),
              templateId: selectedBrokerTemplateId
            }}).catch(e => { log.debug(e.message) })
          }}
          affiliate={data.me.account}
        />
      </>
    )
  } else {
    return <DotSpinnerModal isOpen={createLoading || meLoading} />
  }
}

export default withRouter(NewAgentForm)
