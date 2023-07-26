import { MeQuery, Role } from '#veewme/graphql/types'
import { Me } from '#veewme/lib/graphql/queries'
import * as log from '#veewme/web/common/log'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'

interface HideForRoleProps {
  roles: Role[]
  action?: 'show' | 'hide'
  fallback?: React.ReactNode
}

export const useRole = () => {
  const { data, loading } = useQuery<MeQuery>(Me, {
    fetchPolicy: 'cache-only'
  })
  log.debug('Hide for Role:', loading)
  return data && data.me.role
}

// Use this component only inside main app section (to make sure required data are already available in apollo cache)
const HideForRole: React.FunctionComponent<HideForRoleProps> = ({
  children,
  fallback,
  action = 'hide',
  roles,
  ...props
}) => {
  const role = useRole()
  const roleIncluded = roles.some(r => r === role)
  const hidden = action === 'hide' ? roleIncluded : !roleIncluded

  return (
    <>{hidden ? fallback : children}</>
  )
}

export default HideForRole
