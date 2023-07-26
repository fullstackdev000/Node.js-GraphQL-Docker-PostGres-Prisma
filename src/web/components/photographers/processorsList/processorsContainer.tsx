import {
  ProcessorsQuery
} from '#veewme/gen/graphqlTypes'
import { DeleteProcessor, Processors } from '#veewme/lib/graphql/queries'
import { perPaginationPage } from '#veewme/web/common/consts'
import { useComponentDynamicKey } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Processor } from '../common/types'
import { FiltersFormValues } from './filters'
import ProcessorsListView from './processorsList'

interface ProcessorssData {
  processorsConnection: {
    totalCount: ProcessorsQuery['processorsConnection']['totalCount']
    processors: Processor[]
  }
}

const ProcessorsListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const [isReverseSort, setSortOrder] = React.useState(false)
  const { addToast } = useToasts()
  const [paginationKey, setPaginationKey] = useComponentDynamicKey()

  const handlePinClick = (id: Processor['id']) => {
    log.debug('Pin action', id) //tslint:disable-line
  }

  const handleSort = () => {
    // here will be logic responsible for sending request for sorted data
    log.debug('sort')
    setSortOrder(prevState => !prevState)
  }

  const handleFiltersChange = ({ processorName, ...whereValues }: FiltersFormValues) => {
    refetch({
      search: processorName,
      skip: 0,
      where: {
        regionId: {
          id: whereValues.region
        }
      }
    }).catch(e => log.debug(e))

    setPaginationKey()
  }

  const { data, loading: loadingData, refetch } = useQuery<ProcessorssData>(
    Processors,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        first: perPaginationPage
      }
    }
  )

  const [ deleteProcessor, { loading: deleting } ] = useMutation<{}, {
    id: Processor['id']
  }>(
    DeleteProcessor,
    {
      awaitRefetchQueries: true,
      onCompleted: () => {
        addToast('Processor has been deleted', { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
      },
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
      },
      refetchQueries: ['Processors']
    }
  )

  const loading = loadingData || deleting

  const processors = (data && data.processorsConnection.processors) || []
  const totalCount = (data && data.processorsConnection.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPaginationPage)

  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      {data &&
        <ProcessorsListView
          paginationKey={paginationKey}
          pageCount={pageCount}
          processors={processors} // TODO remove cast
          onPinClick={handlePinClick}
          onSortClick={handleSort}
          isSortReverse={isReverseSort}
          onFiltersChange={handleFiltersChange}
          onDelete={id => deleteProcessor({ variables: { id } })}
          onPageChange={page => {
            const skip = page * perPaginationPage
            refetch({
              first: perPaginationPage,
              skip
            }).catch(e => log.debug(e))
          }}
        />
      }
    </>
  )
}

export default ProcessorsListContainer
