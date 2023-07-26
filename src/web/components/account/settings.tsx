import { MeQuery } from '#veewme/graphql/types'
import { UnreachableCaseError } from '#veewme/lib/error'
import { Me } from '#veewme/lib/graphql/queries'
// import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import AffiliateForm from '#veewme/web/components/affiliates/editAffiliate/settings/editAffiliateSettings'
import BrokerForm from '#veewme/web/components/clients/broker/brokerSettingsContainer'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import AgentForm from '../clients/agentForms/settingsForms/editAgentSettings'

interface RouteParams {
  type: 'agent' | 'affiliate' | 'broker'
}

const Settings: React.FunctionComponent = () => {
  const { data } = useQuery<MeQuery>(Me)
  const { type } = useParams<RouteParams>()

  if (data) {
    switch (type) {
      case 'affiliate': return(<AffiliateForm />)
      case 'agent': return (<AgentForm role={data.me.role} />)
      case 'broker': return (<BrokerForm role={data.me.role} />)
      default: throw new UnreachableCaseError(type)
    }
  } else {
    return <DotSpinnerModal isOpen />
  }

}

export default Settings
