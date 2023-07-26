// TODO remove import from mockPromoCodes
import { PromoCode } from '#veewme/lib/types'
import ListFooter from '#veewme/web/common/footer/listFooter'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { promoCodes as data } from '#veewme/web/components/orders/orderForms/mockData'
import * as React from 'react'
import Filters, { FiltersFormValues } from './filtersBar'
import ListHeader from './listHeader'
import PromoCodesListItem from './promoCodesListItem'

const StyledList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  list-style: none;
`

interface PromoCodesListContainerState {
  activeSortItemLabel: string
  reverseSort: boolean
}

class PromoCodesListContainer extends React.PureComponent<{}, PromoCodesListContainerState> {
  state: PromoCodesListContainerState = ({
    activeSortItemLabel: 'Code',
    reverseSort: false
  })

  handlePageChange = (page: number) => {
    log.debug('page changed', page)
  }

  handleCodeEditClick = (code: PromoCode) => {
    log.debug('edit promo code: ', code.code)
  }

  handleCodeDeleteClick = (code: PromoCode) => {
    log.debug('delete promo code: ', code.code)
  }

  handleFiltersChange = (values: FiltersFormValues) => {
    log.debug('filters change: ', values)
  }

  handleListHeaderItemClick = (label: string) => {
    this.setState(prevState => ({
      activeSortItemLabel: label,
      reverseSort: label === prevState.activeSortItemLabel && !prevState.reverseSort
    }), () => log.debug('sort on ', this.state.activeSortItemLabel, this.state.reverseSort)) // TODO Remove log.debug
  }

  render () {
    return (
      <>
        <Filters onChange={this.handleFiltersChange}/>
        <ListHeader
          activeItemLabel={this.state.activeSortItemLabel}
          reverseSort={this.state.reverseSort}
          onItemClick={this.handleListHeaderItemClick}
        />
        <StyledList>
          {data.map(code => (
            <PromoCodesListItem
              key={code.code}
              code={code}
              onEditClick={this.handleCodeEditClick}
              onDeleteClick={this.handleCodeDeleteClick}
            />
          ))}
        </StyledList>
        <ListFooter
          totalRecords={data.length}
          pageLimit={30}
          maxButtons={7}
          onPageChange={this.handlePageChange}
        />
      </>
    )
  }
}

export default PromoCodesListContainer
