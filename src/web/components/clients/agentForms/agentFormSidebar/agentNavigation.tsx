import { Role } from '#veewme/gen/graphqlTypes'
import * as React from 'react'
import { NavHashLink } from '../../../../common/hashLink'
import SecondaryNavigation from '../../../../common/secondaryNavigation'

export default (props: {role: Role}) => {
  const onAffiliateAccount = props.role === 'AFFILIATE'
  return (
    <SecondaryNavigation>
      <li><NavHashLink to='#account'>Account</NavHashLink></li>
      <li><NavHashLink to='#brokerage'>Brokerage</NavHashLink></li>
      <li><NavHashLink to='#address'>Address</NavHashLink></li>
      {onAffiliateAccount && <li><NavHashLink to='#notifications'>Notifications</NavHashLink></li>}
      <li><NavHashLink to='#syndication'>Syndication</NavHashLink></li>
      {onAffiliateAccount && <li><NavHashLink to='#pluginTracking'>Plugin / Tracking</NavHashLink></li>}
      <li><NavHashLink to='#socialMedia'>Social media</NavHashLink></li>
    </SecondaryNavigation>
  )
}
