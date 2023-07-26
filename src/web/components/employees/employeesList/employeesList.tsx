import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination, { PaginationProps } from '../../../common/footer/pagination'
import ListHeaderItem from '../../../common/listHeaderItem'
import EmployeesPageWrapper from '../employeesPageWrapper'
import { Employee } from '../types'
import EmployeeItem from './employeeItem'
import { StyledHeaderCell, StyledTable } from './styled'

// TODO remove mockData when loading from API
const mockData: Employee[] = [
  {
    email: 'john@wayne.com',
    firstName: 'John',
    id: 'Emp1',
    lastName: 'Wayne',
    photo: ''
  },
  {
    email: 'bill@murray.com',
    firstName: 'Bill',
    id: 'Emp2',
    lastName: 'Murray',
    photo: ''
  }
]

interface EmployeesListViewProps {
  employees: Employee[]
  onSortClick: () => void
  isSortReverse: boolean
}

const EmployeesListView: React.FunctionComponent<EmployeesListViewProps & PaginationProps> = props => (
  <>
    <StyledTable>
      <tbody>
        <tr>
          <StyledHeaderCell>
            <ListHeaderItem
              label={'Users'}
              active
              reverseSort={props.isSortReverse}
              onSort={props.onSortClick}
            />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label={'Actions'} />
          </StyledHeaderCell>
        </tr>
        {props.employees.map(employee => (
          <EmployeeItem
            key={employee.id}
            employee={employee}
          />
        ))}
      </tbody>
    </StyledTable>
    <Pagination />
  </>
)

interface EmployeesListState {
  reverseSort: boolean
}

class EmployeesList extends React.PureComponent<RouteComponentProps, EmployeesListState> {
  state: EmployeesListState = ({
    reverseSort: false
  })

  handleSort = () => {
    // TODO add logic for getting sorted data
    log.debug('sort')
    this.setState(prevState => ({
      reverseSort: !prevState.reverseSort
    }))
  }

  handlePageChange = (page: number) => {
    log.debug('page changed', page)
  }

  render () {
    // TODO fill pagination props with data from API
    const paginationProps = {
      maxButtons: 7,
      onPageChange: this.handlePageChange,
      pageLimit: 10,
      totalRecords: 100
    }

    return (
      <EmployeesPageWrapper>
        <EmployeesListView
          employees={mockData}
          onSortClick={this.handleSort}
          isSortReverse={this.state.reverseSort}
          {...paginationProps}
        />
      </EmployeesPageWrapper>
    )
  }
}

export default EmployeesList
