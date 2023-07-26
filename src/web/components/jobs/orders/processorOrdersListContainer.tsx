import {
  OrderedServicesConnectionQuery,
  PublishOrderMutationVariables
} from '#veewme/gen/graphqlTypes'
import {
  OrderedServicesConnection,
  PublishOrder
} from '#veewme/lib/graphql/queries'
import { perPaginationPage } from '#veewme/web/common/consts'
import Pagination from '#veewme/web/common/footer/pagination'
import { useComponentDynamicKey } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import Filters, { FiltersFormValues, FilterStatus } from './filtersBar'
import ProcessorOrdersList from './processorOrdersList'

type OrderedServicesConnection = OrderedServicesConnectionQuery['orderedServicesConnection']
interface ServicesData {
  orderedServicesConnection: {
    totalCount: OrderedServicesConnection['totalCount']
    orderedServices: NoNullableArrayItems<NoNullableFields<OrderedServicesConnection['orderedServices']>>
  }
}

const ProcessorOrdersListContainer: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const [paginationKey, setPaginationKey] = useComponentDynamicKey()
  // TODO use Processor (or Processor and Photographer because they are similar) dedicated Orders query
  const { data, loading, refetch } = useQuery<ServicesData>(OrderedServicesConnection, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: perPaginationPage
    }
  })

  const [ publishOrder, { loading: publishing }] = useMutation<{}, PublishOrderMutationVariables>(PublishOrder, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      addToast(
        'Congratulations. Order has been published.',
        { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    },
    refetchQueries: ['OrderedServicesConnection']
  })

  const handleFiltersSubmit = (values: FiltersFormValues) => {
    log.debug('Filters submit: ', values)
    let status: FilterStatus | undefined
    if (values.Completed && !values.Pending) {
      status = 'Completed'
    }

    if (!values.Completed && values.Pending) {
      status = 'Pending'
    }
    refetch({
      search: values.search,
      skip: 0,
      where: {
        createdAt_gte: values.date && values.date.start,
        createdAt_lte: values.date && values.date.end,
        // media: values.mediaType,
        status
      }
    }).catch(e => log.debug(e))
    setPaginationKey()
  }

  const services = data && data.orderedServicesConnection.orderedServices || []
  const totalCount = (data && data.orderedServicesConnection.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPaginationPage)

  return (
    <>
      <Filters
        onSubmit={handleFiltersSubmit}
      />
      <DotSpinnerModal isOpen={loading || publishing} />
      {
        services && (
          <>
            <ProcessorOrdersList
              services={services}
              onPublish={id => publishOrder({
                variables: {
                  id
                }
              })}
            />
            <Pagination
              key={paginationKey}
              pageCount={pageCount}
              onChange={page => {
                const skip = page * perPaginationPage
                refetch({
                  first: perPaginationPage,
                  skip
                }).catch(e => log.debug(e))
              }}
            />
          </>
        )
      }
    </>
  )
}

export default ProcessorOrdersListContainer
