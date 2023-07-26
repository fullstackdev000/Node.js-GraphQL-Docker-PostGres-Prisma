import { MeQuery } from '#veewme/graphql/types'
import { UnreachableCaseError } from '#veewme/lib/error'
import { Me } from '#veewme/lib/graphql/queries'
import { publicUrls } from '#veewme/lib/urls'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Affiliate from '../affiliates/editAffiliate/editAffiliate'
import EditAgentAccountForm from '../clients/agentForms/editAgentAccountForm'
import PhotographerAccount from '../photographers/photographerForm/accountForm'
import ProcessorAccount from '../photographers/processorForm/accountForm'

const AccountDetails: React.FunctionComponent<RouteComponentProps> = props => {
  const { data, loading } = useQuery<MeQuery>(Me,
    { onError: () => props.history.push(publicUrls.login) }
  )
  if (data && data.me && !loading) {
    // TODO replace all nulls with components to render
    switch (data.me.role) {
      case 'ADMIN': return null
      case 'AFFILIATE': return <Affiliate affiliateId={data.me.accountId} accountEdit/>
      case 'AGENT': return <EditAgentAccountForm agentId={data.me.accountId}/>
      case 'DEVELOPER': return null
      case 'PHOTOGRAPHER': return <PhotographerAccount {...props} id={data.me.accountId}/>
      case 'PROCESSOR': return <ProcessorAccount {...props} id={data.me.accountId}/>
      case 'SELFSERVICEAGENT': return null
      default: throw new UnreachableCaseError(data.me.role)
    }
  } else {
    return <DotSpinnerModal isOpen={loading} />
  }
}

export default withRouter(AccountDetails)
