import { MeQuery, Role as RoleCore } from '#veewme/graphql/types'
import { Me } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { OrderQueryData } from '../types'

type Role = RoleCore | '*'

interface ActionBase {
  label: string
  roles: Role[]
  hide?: boolean
}
export interface ActionLink extends ActionBase {
  to: string
  onClick?: never
}

export interface ActionClick extends ActionBase {
  onClick: () => void
  to?: never

}

export type OrderAction = ActionLink | ActionClick

const useActionList = (order: OrderQueryData, callbacks?: {
  onDelete?: () => void
  onPublish?: () => void
}) => {
  const { data } = useQuery<MeQuery>(Me, {
    fetchPolicy: 'cache-only'
  })

  const role = data && data.me.role

  const actionsList = React.useMemo(() => {
    const list: OrderAction[] = [{
      label: 'Edit property',
      roles: ['*'],
      to: `${privateUrls.orders}/order/${order.id}/edit`
    }, {
      hide: order.statuses.some(s => s === 'Published'),
      label: 'Publish',
      onClick:  () => callbacks && callbacks.onPublish && callbacks.onPublish(),
      roles: ['ADMIN', 'AFFILIATE']
    }, {
      label: 'Upgrade Media Only to Tour',
      roles: ['ADMIN', 'AFFILIATE', 'AGENT'],
      to: '#'
    }, {
      label: 'Set Tour Banner',
      onClick: () => log.debug('Set banner click'),
      roles: ['AFFILIATE', 'AGENT']
    }, {
      label: 'Purchase Add-on Services',
      onClick: () => log.debug('purchase click'),
      roles: ['AFFILIATE', 'AGENT']
    }, {
      label: 'Asess Admin Fee',
      onClick: () => log.debug('asess click'),
      roles: ['AFFILIATE']
    }, {
      label: 'Purchase Print Materials',
      onClick: () => log.debug('purchase click'),
      roles: ['AFFILIATE', 'AGENT']
    }, {
      label: 'Media Assets',
      onClick: () => log.debug('Media click'),
      roles: ['AFFILIATE', 'AGENT']
    }, {
      label: 'Tour Stats',
      onClick: () => log.debug('Stats click'),
      roles: ['AFFILIATE', 'AGENT']
    }, {
      label: 'Syndication',
      onClick: () => log.debug('Syndication click'),
      roles: ['AFFILIATE', 'AGENT']
    }, {
      label: 'Delete Order',
      onClick: () => callbacks && callbacks.onDelete && callbacks.onDelete(),
      roles: ['ADMIN', 'AFFILIATE']
    }]

    return list.filter(a => !a.hide)
  }, [order])

  const roleList = React.useMemo(() => {
    if (!role) {
      return []
    }

    if (role === 'DEVELOPER') {
      return actionsList
    }

    return actionsList.filter(action => action.roles.includes(role) || action.roles.includes('*'))
  }, [actionsList, role])

  return roleList
}

export default useActionList
