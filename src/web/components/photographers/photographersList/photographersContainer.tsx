import {
  PhotographersQuery
} from '#veewme/gen/graphqlTypes'
import { DeletePhotographer, Photographers } from '#veewme/lib/graphql/queries'
import { perPaginationPage } from '#veewme/web/common/consts'
import { useComponentDynamicKey } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Photographer } from '../common/types'
import { FiltersFormValues } from './filters'
import PhotographersListView from './photographersList'

interface PhotographersData {
  photographersConnection: {
    totalCount: PhotographersQuery['photographersConnection']['totalCount']
    photographers: NoNullableArrayItems<NoNullableFields<PhotographersQuery['photographersConnection']['photographers']>>
  }
}

const PhotographersListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const [isReverseSort, setSortOrder] = React.useState(false)
  const { addToast } = useToasts()
  const [paginationKey, setPaginationKey] = useComponentDynamicKey()

  const handlePinClick = (id: Photographer['id']) => {
    log.debug('Pin photographer action', id) //tslint:disable-line
  }

  const handleSort = () => {
    // here will be logic responsible for sending request for sorted data
    log.debug('sort')
    setSortOrder(prevState => !prevState)
  }

  const handleFiltersChange = ({ photographerName, ...whereValues }: FiltersFormValues) => {
    refetch({
      search: photographerName,
      skip: 0,
      where: {
        regionId: {
          id: whereValues.region
        }
      }
    }).catch(e => log.debug(e))

    setPaginationKey()
  }

  const { data, loading, refetch } = useQuery<PhotographersData>(Photographers,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        first: perPaginationPage
      }
    }
  )

  const [ deletePhotographer, { loading: deleting } ] = useMutation<{}, {
    id: Photographer['id']
  }>(
    DeletePhotographer,
    {
      awaitRefetchQueries: true,
      onCompleted: () => {
        addToast('Photographer has been deleted', { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
      },
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
      },
      refetchQueries: ['Photographers']
    }
  )

  const photographers = (data && data.photographersConnection.photographers) || []
  const totalCount = (data && data.photographersConnection.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPaginationPage)

  return (
    <>
      {data &&
        <PhotographersListView
          paginationKey={paginationKey}
          pageCount={pageCount}
          photographers={photographers}
          onPinClick={handlePinClick}
          onSortClick={handleSort}
          isSortReverse={isReverseSort}
          onFiltersChange={handleFiltersChange}
          onDelete={id => deletePhotographer({ variables: { id } })}
          onPageChange={page => {
            const skip = page * perPaginationPage
            refetch({
              first: perPaginationPage,
              skip
            }).catch(e => log.debug(e))
          }}
        />
      }
      <DotSpinnerModal isOpen={loading || deleting} />
    </>
  )
}

export default PhotographersListContainer
