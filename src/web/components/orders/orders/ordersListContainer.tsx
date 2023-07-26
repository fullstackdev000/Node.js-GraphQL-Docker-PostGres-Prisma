import {
  OrdersPaginatedQueryVariables,
  PublishOrderMutationVariables,
  UpdatePaymentMutationVariables
} from '#veewme/gen/graphqlTypes'
import {
  DeleteOrder,
  OrdersPaginated,
  PublishOrder,
  UpdatePayment
} from '#veewme/lib/graphql/queries/orders'
import { perPaginationPage } from '#veewme/web/common/consts'
import { useComponentDynamicKey, useRole } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, useLocation, withRouter } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { OrderQueryData } from '../types'
import Filters, { FiltersFormValues } from './filtersBar'
import OrdersList from './ordersList'

// TODO remove const after adding termsURL to data from server
const TERMS_URL = 'www.google.com'

interface OrdersConnection {
  totalCount: number
  orders: OrderQueryData[]
}

interface OrderConnectionResponse {
  orders: OrdersConnection
}

type OrdersListContainerProps = RouteComponentProps & {
  canPublish?: boolean
}

const OrdersListContainer: React.FunctionComponent<OrdersListContainerProps> = props => {
  const { addToast } = useToasts()
  const { search } = useLocation()
  const role = useRole()
  const agentIdParam = search.split('agentId=')[1]
  const agentId = Number(agentIdParam)

  const photographerIdParam = search.split('photographerId=')[1]
  const photographerId = Number(photographerIdParam)

  const processorIdParam = search.split('processorId=')[1]
  const processorId = Number(processorIdParam)

  const [paginationKey, setPaginationKey] = useComponentDynamicKey()
  const { data, loading, refetch } = useQuery<OrderConnectionResponse, OrdersPaginatedQueryVariables>(OrdersPaginated, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: perPaginationPage,
      where: {
        realEstateId: {
          agentPrimaryId: {
            id: agentIdParam ? agentId : undefined
          }
        },
        serviceIds_some: {
          event: photographerId ? {
            photographer: {
              id: photographerId
            }
          } : undefined,
          processorId: processorIdParam ? {
            id: processorId
          } : undefined
        },
        statusCompleted_not: role === 'PHOTOGRAPHER' ? true : undefined
      }
    }
  })
  const [ deleteOrder, { loading: deleting }] = useMutation<{}, {
    id: number
  }>(DeleteOrder, {
    awaitRefetchQueries: true,
    refetchQueries: ['OrdersPaginated']
  })

  const [ publishOrder, { loading: publishing }] = useMutation<{}, PublishOrderMutationVariables>(PublishOrder, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      addToast(
        'Congratulations. Order has been published.',
        { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    },
    refetchQueries: ['OrdersPaginated']
  })

  const [ updatePayment, { loading: updating } ] = useMutation<{}, UpdatePaymentMutationVariables>(UpdatePayment, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      addToast(
        'Order marked as paid.',
        { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    },
    onError: error => {
      addToast(
        `Error ${error.message} while creating Order`,
        { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
      )
    },
    refetchQueries: ['OrdersPaginated']
  })

  const handlePageChange = (page: number) => {
    log.debug('page changed', page)
    const skip = page * perPaginationPage
    refetch({
      first: perPaginationPage,
      skip
    }).catch(e => log.debug(e))
  }

  const handleFiltersSubmit = (values: FiltersFormValues) => {
    log.debug('Filters submit: ', values)
    refetch({
      search: values.search,
      skip: 0,
      where: {
        createdAt_gte: values.date && values.date.start,
        createdAt_lte: values.date && values.date.end,
        media: values.mediaType,
        realEstateId: {
          agentPrimaryId: {
            id: values.clientId || undefined,
            region: {
              id: values.regionId
            }
          }
        },
        serviceIds_some: {
          event: values.photographerId ? {
            photographer: {
              id: values.photographerId
            }
          } : undefined,
          processorId: values.processorId ? {
            id: values.processorId
          } : undefined
        },
        statusCompleted_not: values.Uncompleted || undefined,
        statusMediaOnly: values.MediaOnly || undefined,
        statusOverdue: values.Overdue || undefined,
        statusPaid_not: values.Unpaid || undefined,
        statusPublished: values.Published || undefined,
        statusPublished_not: values.Unpublished || undefined,
        statusScheduled_not: values.Unscheduled || undefined
      }
    }).catch(e => log.debug(e))

    setPaginationKey()
  }

  const orders = (data && data.orders.orders) || []
  const totalCount = (data && data.orders.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPaginationPage)

  return (
    <>
      <Filters
        onSubmit={handleFiltersSubmit}
        agentId={agentId}
        photographerId={photographerId}
        processorId={processorId}
      />
      <DotSpinnerModal isOpen={loading || deleting || updating || publishing} />
      {
        data && data.orders
        ? <OrdersList
          onUpdatePayment={id => updatePayment({
            variables: {
              id,
              status: 'PAID'
            }})
          }
          orders={orders}
          pageCount={pageCount}
          termsURL={TERMS_URL} // TODO Replace with data.termsURL
          onPageChange={handlePageChange}
          ordersPerPage={perPaginationPage} // TODO should be data.ordersPerPage?
          onDelete={(id: number) => deleteOrder({
            variables: {
              id
            }
          })}
          paginationKey={paginationKey}
          canPublish={props.canPublish}
          onPublish={id => publishOrder({
            variables: {
              id
            }
          })}
        />
        : <p>No orders</p>
      }
    </>
  )
}

export default withRouter(OrdersListContainer)
