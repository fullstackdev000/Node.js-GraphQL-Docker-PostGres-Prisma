import { MediaAccess as MediaAccessQuery } from '#veewme/lib/graphql/queries/orders'
import { perPaginationPage } from '#veewme/web/common/consts'
import * as Grid from '#veewme/web/common/grid'
import { useComponentDynamicKey } from '#veewme/web/common/hooks'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import MediaList from './mediaList'
import {
  MediaAccessData,
  MediaAccessQueryVariables
} from './types'

import * as log from '#veewme/web/common/log'

const perPage = perPaginationPage

const MediaAccess: React.FunctionComponent = () => {
  const [paginationKey, setPaginationKey] = useComponentDynamicKey()

  const { data, loading, refetch } = useQuery<MediaAccessData, MediaAccessQueryVariables>(MediaAccessQuery, {
    notifyOnNetworkStatusChange: true,
    /* TODO: very strange but adding onError cause that refetch queries are called twice with different variables (actual and initial)
    onError: (error: Error) => {
      addToast(
        `Error ${error.message} while fetching MediaAccess`,
        { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
      )
    },
    */
    variables: {
      first: perPage
    }
  })
  const orders = (data && data.ordersConnection.orders) || []
  const totalCount = (data && data.ordersConnection.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPage)

  return (
    <Grid.PageContainer>
      <Grid.Header>Media Assets</Grid.Header>
      <MediaList
        paginationKey={paginationKey}
        onFiltersSubmit={vals => {
          refetch({
            search: vals.search,
            skip: 0,
            where: {
              realEstateId: {
                agentPrimaryId: {
                  id: vals.clientId,
                  region: {
                    id: vals.regionId
                  }
                }
              },
              serviceIds_every: {
                serviceId: {
                  mediaOnly: vals.mediaOnly || undefined// if false (not checked) don't filter by this prop at all
                }
              }
            }
          }).catch(e => log.debug(e))

          setPaginationKey()
        }}
        orders={orders}
        pageCount={pageCount}
        perPage={perPage}
        refetch={skip => refetch({
          first: perPage,
          skip
        })}
      />
      <DotSpinnerModal isOpen={loading} />
    </Grid.PageContainer>
  )
}

export default MediaAccess
