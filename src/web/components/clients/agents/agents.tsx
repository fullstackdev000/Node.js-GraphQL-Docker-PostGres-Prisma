import {
  AgentsPaginatedQuery as AgentsQuery,
  AgentsPaginatedQueryVariables as AgentsQueryVariables,
  DeleteAgentMutation,
  DeleteAgentMutationVariables,
  ToggleAgentStatusMutation,
  ToggleAgentStatusMutationVariables
} from '#veewme/gen/graphqlTypes'
import { AgentsPaginated, DeleteAgent, ToggleAgentStatus } from '#veewme/lib/graphql/queries'
import { perPaginationPage } from '#veewme/web/common/consts'
import { useComponentDynamicKey } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import Pagination from '../../../common/footer/pagination'
import styled from '../../../common/styled-components'
import ClientPageWrapper from '../clientPageWrapper'
import * as TableItems from '../tableItems'
import AgentItem from './agentItem'
import Filters from './filters'
import ListHeader from './listHeader'

const AgentCol = styled.col`width: 20%;`
const BrokerCol = styled.col`width: 20%;`
const PhoneCol = styled.col`width: 20%;`
const SpecialPriceCol = styled.col`width: 3%;`
const CompanyPayCol = styled.col`width: 3%;`
const RegionCol = styled.col`width: 7%;`
const LastOrderDateCol = styled.col`width: 12%;`
const NewOrderCol = styled.col`width: 1%;`
const ToursCol = styled.col`width: 4%;`
const OrdersCol = styled.col`width: 6%;`
const MoreCol = styled.col`width: 4%;`

interface AgentItemsProps {
  sortState: AgentsState
  onSort: (label: string) => void
}

const AgentItems: React.FunctionComponent<AgentItemsProps> = props => {
  const { addToast } = useToasts()
  const [paginationKey, setPaginationKey] = useComponentDynamicKey()

  const { data, loading: queryLoading, refetch } = useQuery<AgentsQuery, AgentsQueryVariables>(
    AgentsPaginated,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        first: perPaginationPage
      }
    }
  )
  const [deleteAgent, { loading: deleteLoading }] = useMutation<DeleteAgentMutation, DeleteAgentMutationVariables>(
    DeleteAgent,
    {
      awaitRefetchQueries: true,
      onCompleted: result => {
        addToast(
          `Agent was deleted successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 2000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while deleting Affiliate`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: ['AgentsPaginated']
    }
  )
  const [toggleStatus, { loading: toggleStatusLoading }] = useMutation<ToggleAgentStatusMutation, ToggleAgentStatusMutationVariables>(
    ToggleAgentStatus,
    {
      awaitRefetchQueries: true,
      onCompleted: result => {
        addToast(
          `Agent was ${result.updateAgent.status === 'ACTIVE' ? 'unsuspended' : 'suspended'} successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 2000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating Agent status`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: ['AgentsPaginated']
    }
  )

  const agents = (data && data.agentsConnection.agents) || []
  const totalCount = (data && data.agentsConnection.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPaginationPage)

  return (
    <>
      {(queryLoading || toggleStatusLoading || deleteLoading) &&
        <DotSpinnerModal
          isOpen={true}
        />
      }
      {
        agents && (
          <>
            <Filters
              onSubmit={vals => {
                refetch({
                  search: vals.searchPhrase,
                  searchBrokerage: vals.brokerageFilter,
                  skip: 0,
                  where: {
                    officeAdmin: vals.officeAdmin || undefined, // if false (not checked) don't filter by this prop at all
                    region: {
                      id: vals.region
                    }
                  }
                }).catch(e => log.debug(e))

                setPaginationKey()
              }}
            />
            <TableItems.Table>
              <colgroup>
                <AgentCol/>
                <BrokerCol/>
                <PhoneCol/>
                <SpecialPriceCol/>
                <CompanyPayCol/>
                <RegionCol/>
                <LastOrderDateCol/>
                <NewOrderCol/>
                <ToursCol/>
                <OrdersCol/>
                <MoreCol/>
              </colgroup>
              <ListHeader onSort={props.onSort} {...props.sortState} />
              <tbody>
                {agents.map(agent => (
                  <AgentItem
                    agent={agent}
                    key={agent.id}
                    onDelete={() => { deleteAgent({ variables: { id: agent.id } }).catch(e => log.debug(e.message)) }}
                    toggleStatus={() => {
                      toggleStatus({ variables: {
                        id: agent.id,
                        status: agent.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                      }}).catch(e => log.debug(e.message))
                    }}
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
        )
      }

    </>
  )
}

interface AgentsState {
  activeLabel: string
  reverseSort: boolean
}

class AgentsList extends React.PureComponent<{}, AgentsState> {

  state = {
    activeLabel: 'Broker',
    reverseSort: false
  }

  handlePageChange (page: number) {
    log.debug('page changed', page)
  }

  handleSort = (activeLabel: string) => {
    const reverseSort = activeLabel === this.state.activeLabel && !this.state.reverseSort
    this.setState({ activeLabel, reverseSort })
  }

  render () {
    return (
      <ClientPageWrapper>
        <AgentItems sortState={this.state} onSort={this.handleSort}/>
      </ClientPageWrapper>
    )
  }
}

export default AgentsList
