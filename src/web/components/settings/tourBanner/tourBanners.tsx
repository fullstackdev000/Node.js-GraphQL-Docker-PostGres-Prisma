import { DeleteTourBannerMutation, DeleteTourBannerMutationVariables, TourBannersQueryVariables } from '#veewme/gen/graphqlTypes'
import { DeleteTourBanner, TourBanners as TourBannersQuery } from '#veewme/lib/graphql/queries'
import { TourBanner } from '#veewme/lib/types'
import ListFooter from '#veewme/web/common/footer/listFooter'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { arrayMove } from 'react-sortable-hoc'
import { useToasts } from 'react-toast-notifications'
import SortableTourBannersList from './tourBannersList'

interface TourBannersData {
  tourBanners: TourBanner[]
}

const TourBanners: React.FunctionComponent<{}> = () => {
  const { addToast } = useToasts()

  const [sortedBanners, setSortedBanners] = useState<TourBanner[]>([])

  const { loading: loadingQuery, data } = useQuery<TourBannersData, TourBannersQueryVariables>(TourBannersQuery)

  const [deleteTourBanner, { loading: loadingDelete }] = useMutation<DeleteTourBannerMutation, DeleteTourBannerMutationVariables>(
    DeleteTourBanner,
    {
      awaitRefetchQueries: true,
      onCompleted: result => {
        addToast(
          `Tour banner ${result.deleteTourBanner.label} was deleted successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while deleting the tour banner`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: ['TourBanners']
    }
  )

  useEffect(() => {
    if (data) {
      setSortedBanners(data.tourBanners)
    }
  }, [data])

  const handleDeleteBanner = (id: TourBanner['id']) => {
    deleteTourBanner({
      variables: { id }
    }).catch(e => log.debug(e.message))
  }

  const handleSort = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    setSortedBanners(arrayMove(sortedBanners, oldIndex, newIndex))
  }

  const loading = loadingQuery || loadingDelete

  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      {data && data.tourBanners.length > 0 &&
        <>
          <SortableTourBannersList
            banners={sortedBanners}
            onDelete={handleDeleteBanner}
            onSortEnd={handleSort}
            useDragHandle
          />
          <ListFooter
            totalRecords={data.tourBanners.length}
            pageLimit={30}
            maxButtons={7}
            onPageChange={(page: number) => log.debug('page change')}
          />
        </>
      }
    </>
  )
}

export default TourBanners
