import {
  Agent,
  Brokerage,
  BrokeragesPaginatedQuery,
  BrokeragesPaginatedQueryVariables,
  BrokeragesQuery,
  DeleteBrokerageMutation,
  DeleteBrokerageMutationVariables,
  MoveBrokerAgentsMutationVariables,
  Office,
  Region,
  UpdateBrokerageMutation,
  UpdateBrokerageMutationVariables
} from '#veewme/gen/graphqlTypes'
import { Brokerages, BrokeragesPaginated, DeleteBrokerage, MoveBrokerAgents, UpdateBrokerage } from '#veewme/lib/graphql/queries'
import { perPaginationPage } from '#veewme/web/common/consts'
import { useComponentDynamicKey } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import Pagination from '../../../common/footer/pagination'
import styled from '../../../common/styled-components'
import ClientPageWrapper from '../clientPageWrapper'
import * as TableItems from '../tableItems'
import BrokerItemView from './brokerItem'
import Filters from './filters'
import ListHeader from './listHeader'

// TODO remove when API 'region' fixed
import { BrokerageData } from './brokers'

const NameCell = styled.col` width: 19%`
const AddressCell = styled.col` width: 29%`
const RegionCell = styled.col` width: 14%`
const CompanyPayCell = styled.col` width: 6%`
const SpecialPriceCell = styled.col` width: 6%`
const OfficesCell = styled.col` width: 5%`
const AgentsCell = styled.col` width: 5%`
const ActionsCell = styled.col` width: 7%`
const OfficesListCell = styled.col`width: 6%`
const MoreCell = styled.col`width: 3%`

export type BrokerageData =
  Pick<Brokerage,
    | 'id'
    | 'city'
    | 'companyName'
    | 'country'
    | 'state'
    | 'status'
    | 'street'
    | 'zip'
  > & {
    agents: Array<Pick<Agent, 'id'>>
    companyPay?: boolean
    offices: Array<Pick<Office, 'id'>>
    region: Pick<Region, 'label'>
    specialPricing?: boolean
    profilePicture?: { path: string }
  }

interface BrokersData {
  brokeragesConnection: {
    totalCount: number
    brokerages: NoNullableArrayItems<NoNullableFields<BrokeragesPaginatedQuery['brokeragesConnection']['brokerages']>>
  }
}

const Brokers: React.FunctionComponent<{}> = () => {
  const { addToast } = useToasts()
  const [paginationKey, setPaginationKey] = useComponentDynamicKey()

  const [reverseSort, setReverseSort] = useState<boolean>(false)

  const { data: allBrokerages } = useQuery<BrokeragesQuery, {}>(Brokerages)

  const { loading : loadingBrokerages, data, refetch } = useQuery<BrokersData, BrokeragesPaginatedQueryVariables>(BrokeragesPaginated,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        first: perPaginationPage
      }
    }
  )

  const [moveBrokerAgents, { loading: movingAgents }] = useMutation<{}, MoveBrokerAgentsMutationVariables>(MoveBrokerAgents)

  const [deleteBrokerage, { loading: loadingDelete }] = useMutation<DeleteBrokerageMutation, DeleteBrokerageMutationVariables>(
    DeleteBrokerage,
    {
      awaitRefetchQueries: true,
      onCompleted: () => {
        addToast(
          `Brokerage was deleted successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while deleting the brokerage`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: [
        'Brokerages',
        'BrokeragesPaginated'
      ]
    }
  )

  const handleDeleteBrokerage = async (id: Brokerage['id'], newAgentsOwnerId?: Brokerage['id']) => {
    if (newAgentsOwnerId) {
      await moveBrokerAgents({
        variables: {
          fromId: id,
          toId: newAgentsOwnerId
        }
      })
    }

    deleteBrokerage({
      variables: { id }
    }).catch(e => log.debug(e.message))
  }

  const [toggleStatus, { loading: toggleStatusLoading }] = useMutation<UpdateBrokerageMutation, UpdateBrokerageMutationVariables>(
    UpdateBrokerage,
    {
      awaitRefetchQueries: true,
      onCompleted: result => {
        addToast(
          `Brokerage was ${result.updateBrokerage.status === 'ACTIVE' ? 'unsuspended' : 'suspended'} successfully.`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating Brokerage status.`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: ['BrokeragesPaginated']
    }
  )

  const handleSort = () => {
    setReverseSort(!reverseSort)
  }

  const loading = loadingBrokerages || loadingDelete || movingAgents
  const brokers = (data && data.brokeragesConnection.brokerages) || []
  const totalCount = (data && data.brokeragesConnection.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPaginationPage)

  const brokersOptions = React.useMemo(() => {

    return allBrokerages ? allBrokerages.brokerages.map(broker => ({
      label: broker!.companyName, // broker for sure exists - just generated query types are not guite correct
      value: broker!.id
    })) : []
  }, [allBrokerages])

  const showLoader = toggleStatusLoading || loading

  return (
    <ClientPageWrapper>
      {showLoader &&
        <DotSpinnerModal
          isOpen={showLoader}
        />
      }
      <Filters
        onSubmit={vals => {
          refetch({
            search: vals.search,
            skip: 0,
            where: {
              companyPay: vals.companyPay || undefined // if false (not checked) don't filter by this prop at all
            }
          }).catch(e => log.debug(e))

          setPaginationKey()
        }}
      />
      {brokers.length === 0 && 'No matching data found'}
      {brokers.length > 0 &&
        <>
          <TableItems.Table>
            <colgroup>
              <NameCell />
              <AddressCell />
              <RegionCell />
              <CompanyPayCell />
              <SpecialPriceCell />
              <OfficesCell />
              <AgentsCell />
              <ActionsCell />
              <OfficesListCell />
              <MoreCell />
            </colgroup>
            <ListHeader
              onSort={handleSort}
              reverseSort={reverseSort}
            />
            <tbody>
              {brokers.map(brokerage => (
                <BrokerItemView
                  key={brokerage.id}
                  item={brokerage}
                  onDelete={(newAgentsOwnerId?: number) => handleDeleteBrokerage(brokerage.id, newAgentsOwnerId)}
                  onSuspend={() => {
                    toggleStatus({ variables: {
                      id: brokerage.id,
                      status: brokerage.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                    }}).catch(e => log.debug(e.message))
                  }}
                  brokers={brokersOptions}
                />
              ))}
            </tbody>
          </TableItems.Table>
          <Pagination
            pageCount={pageCount}
            key={paginationKey}
            onChange={page => {
              const skip = page * perPaginationPage
              refetch({
                first: perPaginationPage,
                skip
              }).catch(e => log.debug(e))
            }}
          />
        </>
      }
    </ClientPageWrapper>
  )
}

export default Brokers
