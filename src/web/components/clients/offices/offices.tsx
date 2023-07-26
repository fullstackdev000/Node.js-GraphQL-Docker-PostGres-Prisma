import * as log from '#veewme/web/common/log'
import * as React from 'react'
import Pagination from '../../../common/footer/pagination'
import styled from '../../../common/styled-components'
import ClientPageWrapper from '../clientPageWrapper'
import * as TableItems from '../tableItems'
import Filters from './filters'
import ListHeader from './listHeader'
import OfficeItem, { OfficeItemProps } from './officeItem'
import officesListData from './officesListMock'

const NameCell = styled.col` width: 15% `
const AddressCell = styled.col` width: 29% `
const RegionCell = styled.col` width: 11% `
const CompanyPayCell = styled.col` width: 6% `
const AgentsCell = styled.col` width: 5% `
const AdminCell = styled.col` width: 25% `
const AgentsListCell = styled.col` width: 6% `
const MoreCell = styled.col` width: 3% `

interface OfficesState {
  reverseSort: boolean
}

class Offices extends React.PureComponent<{}, OfficesState> {

  state = {
    reverseSort: false
  }

  handlePageChange (page: number) {
    log.debug('page changed', page)
  }

  handleSort = () => {
    const reverseSort = !this.state.reverseSort
    this.setState({ reverseSort })
  }

  render () {
    return (
      <ClientPageWrapper>
        <Filters onChange={val => log.debug(val)}/>
        <TableItems.Table>
          <colgroup>
            <NameCell />
            <AddressCell />
            <RegionCell />
            <CompanyPayCell />
            <AgentsCell />
            <AdminCell />
            <AgentsListCell />
            <MoreCell />
          </colgroup>
          <ListHeader onSort={this.handleSort} {...this.state} />
          <tbody>
            {officesListData.map((data: OfficeItemProps, i: number) => (
              <OfficeItem {...data} key={i} />
            ))}
          </tbody>
        </TableItems.Table>
        <Pagination />
      </ClientPageWrapper>
    )
  }
}

export default Offices
