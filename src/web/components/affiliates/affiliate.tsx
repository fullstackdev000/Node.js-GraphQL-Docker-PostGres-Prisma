import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import EditAffiliate from './editAffiliate/editAffiliate'

const Affiliate: React.FunctionComponent<RouteComponentProps<{ affiliateId: string }>> = props => {
  const { match: { params: { affiliateId } } } = props

  if (affiliateId) {
    return (
      <EditAffiliate affiliateId={parseInt(affiliateId, 10)}/>
    )
  } else {
    // TODO error management
    log.debug('Edit Affiliate error: no affiliate id')
    props.history.push(privateUrls.affiliates)
    return null
  }
}

export default withRouter(Affiliate)
