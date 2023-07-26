import ListHeaderItem from '#veewme/web/common/listHeaderItem'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import ListBox, { StyledListItem, StyledListItemCell } from './listBox'

// TODO remove mock data
const mockData: SoldService[] = [
  {
    amount: 50,
    service: 'Tour Activations',
    sold: 987
  },
  {
    amount: 70,
    service: 'Media Activations',
    sold: 1287
  },
  {
    amount: 40,
    service: 'Video Hosting',
    sold: 354
  },
  {
    amount: 60,
    service: 'Faux Video',
    sold: 757
  },
  {
    amount: 20,
    service: 'Other Services with a very long name qwerty qwerty qwerty qwerty qwerty',
    sold: 208
  },
  {
    amount: 70,
    service: 'Media Activations',
    sold: 1287
  },
  {
    amount: 40,
    service: 'Video Hosting',
    sold: 354
  },
  {
    amount: 60,
    service: 'Faux Video',
    sold: 757
  }
]

export const StyledListGrid = styled.div `
  display: grid;
  grid-template-columns: 3fr 1fr 1fr
`

interface ListHeaderItemType {
  label: string
  sortable?: boolean
}

const listHeaderItems: ListHeaderItemType[] = [
  {
    label: 'Service'
  },
  {
    label: 'Sold Number',
    sortable: true
  },
  {
    label: 'Amount',
    sortable: true
  }
]

interface SoldService {
  amount: number
  service: string
  sold: number
}

interface SoldServicesListBoxProps {
  className?: string
  heading: string
}

interface SoldServicesListBoxState {
  activeSortItem: string
  reverseSort: boolean
}

class SoldServicesListBox extends React.PureComponent<SoldServicesListBoxProps, SoldServicesListBoxState> {
  state: SoldServicesListBoxState = {
    activeSortItem: '',
    reverseSort: false
  }

  handleListHeaderItemClick = (label: string) => {
    this.setState(prevState => ({
      activeSortItem: label,
      reverseSort: label === prevState.activeSortItem && !prevState.reverseSort
    }), () => log.debug('sort on ', this.state.activeSortItem, ', reverse sort: ', this.state.reverseSort))
  }

  render () {
    return (
      <ListBox
        className={this.props.className}
        heading={this.props.heading}
        listHeader={
          <StyledListGrid>
            {listHeaderItems.map(item =>
              <ListHeaderItem
                key={item.label}
                label={item.label}
                active={this.state.activeSortItem === item.label}
                reverseSort={this.state.reverseSort}
                onSort={() => this.handleListHeaderItemClick(item.label)}
              />
            )}
          </StyledListGrid>
        }
        listItems={mockData.map((item, index) => (
          <StyledListItem
            key={index}
          >
            <StyledListGrid>
              <StyledListItemCell>
                {item.service}
              </StyledListItemCell>
              <StyledListItemCell>
                {item.sold}
              </StyledListItemCell>
              <StyledListItemCell>
                {item.amount}
              </StyledListItemCell>
            </StyledListGrid>
          </StyledListItem>
        ))}
      />
    )
  }
}

export default SoldServicesListBox
