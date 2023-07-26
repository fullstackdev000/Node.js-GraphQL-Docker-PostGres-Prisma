import { Role } from '#veewme/gen/graphqlTypes'
import { NavHashLink } from '#veewme/web/common/hashLink'
import SecondaryNavigation from '#veewme/web/common/secondaryNavigation'
import * as React from 'react'

export default (props: {role: Role}) => {
  const onAffiliateAccount = props.role === 'AFFILIATE'
  return (
    <SecondaryNavigation>
      <li><NavHashLink to='#realEstateSiteMediaShowcase'>Property Site / Tour Gallery</NavHashLink></li>
      {onAffiliateAccount && <li><NavHashLink to='#notifications'>Notifications</NavHashLink></li>}
      <li><NavHashLink to='#defaultColorScheme'>Color scheme</NavHashLink></li>
      <li><NavHashLink to='#siteTourSettings'>Property Site / Tour Settings</NavHashLink></li>
      {onAffiliateAccount && <li><NavHashLink to='#realEstateFlyerLayout'>Property Flyer Layout</NavHashLink></li>}
    </SecondaryNavigation>
  )
}
