import DropDownButton from '#veewme/web/common/buttons/dropDownButton'
import ListHeaderItem from '#veewme/web/common/listHeaderItem'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { format } from 'date-fns'
import * as React from 'react'
import Filters, { FiltersFormValues } from './feesListBoxFilters'
import ListBox, { StyledListItem, StyledListItemCell } from './listBox'

// TODO remove mock data
const mockData: Fee[] = [
  {
    agent: 'Marylin Monroe',
    amount: 50,
    dateCharged: new Date().getTime(),
    description: 'MMMM MMMM MMMMMMM MMMM MMMMMM',
    id: 'f1',
    orderId: '834',
    tourAddress: '127 Ford Rd, Plymounth, MI, 48170'
  },
  {
    agent: 'Simon Templar',
    amount: 70,
    dateCharged: new Date().getTime(),
    description: 'Trip Charge',
    id: 'f2',
    orderId: '554',
    tourAddress: '37802 Woodview Drive Clinton Township MI 48105'
  },
  {
    agent: 'Victor Hugo',
    amount: 40,
    dateCharged: new Date().getTime(),
    description: 'Trip Charge',
    id: 'f3',
    orderId: '316',
    tourAddress: '300 J St, Sacramento, Sacramento, CA 95814'
  },
  {
    agent: 'King Kong',
    amount: 60,
    dateCharged: new Date().getTime(),
    description: 'Trip Charge',
    id: 'f4',
    orderId: '255',
    tourAddress: '122 Gone With The Wind Blvd, Savannah, GA 45123'
  }
]

export const StyledListGrid = styled.div `
  display: grid;
  grid-template-columns: 80px 2fr 3fr 70px 250px 80px 60px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: 80px 2fr 3fr 70px 150px 80px 60px;
  }
`

const StyledListHeader = styled.div `
  margin-bottom: 4px;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
`

const StyledActionListItemCell = styled(StyledListItemCell)`
  justify-content: center;
  padding: 0;
`

interface ListHeaderItemType {
  label: string
  sortable?: boolean
}

const listHeaderItems: ListHeaderItemType[] = [
  {
    label: 'Order ID',
    sortable: true
  },
  {
    label: 'Agent',
    sortable: true
  },
  {
    label: 'Tour Address'
  },
  {
    label: 'Fee',
    sortable: true
  },
  {
    label: 'Description',
    sortable: true
  },
  {
    label: 'Date',
    sortable: true
  },
  {
    label: 'Action'
  }
]

interface Fee {
  id: string
  agent: string
  amount: number
  dateCharged: number
  description: string
  orderId: string
  tourAddress: string
}

interface FeesListBoxProps {
  className?: string
  heading: string
  dateFormat: string
}

interface FeesListBoxState {
  activeSortItem: string
  reverseSort: boolean
}

class FeesListBox extends React.PureComponent<FeesListBoxProps, FeesListBoxState> {
  static defaultProps = {
    dateFormat: 'MM/DD/YY'
  }

  state: FeesListBoxState = {
    activeSortItem: '',
    reverseSort: false
  }

  actions = [ 'Action 1', 'Action 2', 'Action 3']

  handleListHeaderItemClick = (label: string) => {
    this.setState(prevState => ({
      activeSortItem: label,
      reverseSort: label === prevState.activeSortItem && !prevState.reverseSort
    }), () => log.debug('sort on ', this.state.activeSortItem, ', reverse sort: ', this.state.reverseSort)) // TODO Remove log.debug
  }

  handleActionClick = (feeId: Fee['id'], action: string) => {
    log.debug('Clicked on', action, 'in item', feeId)
  }

  handleFiltersChange (values: FiltersFormValues) {
    log.debug('filters change - ', JSON.stringify(values))
  }

  render () {
    return (
      <ListBox
        className={this.props.className}
        heading={this.props.heading}
        filtersBar={<Filters onFiltersChange={this.handleFiltersChange}/>}
        listHeader={
          <StyledListHeader>
            <StyledListGrid>
              {listHeaderItems.map(item => {
                if (item.sortable) {
                  return (
                    <ListHeaderItem
                      key={item.label}
                      label={item.label}
                      active={this.state.activeSortItem === item.label}
                      reverseSort={this.state.reverseSort}
                      onSort={() => this.handleListHeaderItemClick(item.label)}
                    />
                  )
                } else {
                  return (
                    <ListHeaderItem
                      key={item.label}
                      label={item.label}
                    />
                  )
                }
              })}
            </StyledListGrid>
          </StyledListHeader>
        }
        listItems={mockData.map((item, index) => (
          <StyledListItem
            key={index}
          >
            <StyledListGrid>
              <StyledListItemCell>
                {item.orderId}
              </StyledListItemCell>
              <StyledListItemCell>
                {item.agent}
              </StyledListItemCell>
              <StyledListItemCell>
                {item.tourAddress}
              </StyledListItemCell>
              <StyledListItemCell>
                {item.amount}
              </StyledListItemCell>
              <StyledListItemCell>
                {item.description}
              </StyledListItemCell>
              <StyledListItemCell>
                {format(item.dateCharged, this.props.dateFormat)}
              </StyledListItemCell>
              <StyledActionListItemCell>
                <DropDownButton
                  list={[
                    {items: this.actions.map(action => ({
                      label: action,
                      onClick: () => this.handleActionClick(item.id, action)
                    }))}
                  ]}
                />
              </StyledActionListItemCell>
            </StyledListGrid>
          </StyledListItem>
        ))}
      />
    )
  }
}

export default FeesListBox
