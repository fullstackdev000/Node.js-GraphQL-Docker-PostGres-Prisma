import * as React from 'react'
import AffiliateForm from './affiliateForm'
import AgentForm from './agentForm'
import BrokerForm from './brokerForm'
import { AccountPage, FormHeader } from './styled'

interface AccountFormProps {
  onClick: () => void
  selectedAccount: string
}

const AccountForm: React.FunctionComponent<AccountFormProps> = props => {
  return (
    <AccountPage>
      <FormHeader>
        <h2>{props.selectedAccount} signup</h2>
        <label onClick={props.onClick}>Back to choosing account type</label>
      </FormHeader>
      {props.selectedAccount === 'affiliate/photographer' && <AffiliateForm />}
      {props.selectedAccount === 'agent' && <AgentForm/>}
      {props.selectedAccount === 'broker' && <BrokerForm />}
    </AccountPage>
  )
}

export default AccountForm
