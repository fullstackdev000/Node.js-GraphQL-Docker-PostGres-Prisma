import {
  DeleteDomainMutationVariables,
  DomainsQuery as DomainsData
} from '#veewme/gen/graphqlTypes'
import { DeleteDomain, Domains, Orders } from '#veewme/lib/graphql/queries'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import { Domain, OrderForDomain } from './'
import DomainsList from './domainsList'

const DomainsContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()

  const { data: ordersData, loading: loadingOrders } = useQuery<{
    orders: OrderForDomain[]
  }>(
    Orders,
    {
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
      }
    }
  )

  const { data: domainsData, loading: loadingDomains } = useQuery<DomainsData>(
    Domains,
    {
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
      }
    }
  )

  const [ deleteDomain, { loading: deleting } ] = useMutation<{}, DeleteDomainMutationVariables>(
    DeleteDomain,
    {
      awaitRefetchQueries: true,
      onCompleted: () => {
        addToast('Domain has been deleted', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 })
      },
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
      },
      refetchQueries: ['Domains']
    }
  )

  const loading = loadingOrders || loadingDomains || deleting

  return (
    <div>
      {ordersData && domainsData &&
        <DomainsList
          domains={domainsData.domains}
          orders={ordersData.orders}
          onOrderChange={(id: Domain['id'], orderId: OrderForDomain['id']) => log.debug(`Domain: ${id}. Order changed: ${orderId}`)}
          onDelete={(id: Domain['id']) => deleteDomain({ variables: { id } })}
        />
      }
      <DotSpinnerModal isOpen={loading} />
    </div>
  )
}

export default DomainsContainer
