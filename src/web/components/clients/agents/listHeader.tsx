import * as React from 'react'
import * as TableItems from '../tableItems'

interface ListHeaderProps {
  activeLabel: string
  onSort: (label: string) => void
  reverseSort: boolean
}

const ListHeader: React.FunctionComponent<ListHeaderProps> = props => {
  return (
    <thead>
      <tr>
        <TableItems.Header label='Agent' />
        <TableItems.Header
          label='Broker'
          active={props.activeLabel === 'Broker'}
          {...props}
        />
        <TableItems.Header label='Phone' />
        <TableItems.Header label='Special Price' />
        <TableItems.Header label='Company Pay' />
        <TableItems.Header label='Region' />
        <TableItems.Header
          label='Last Order Date'
          active={props.activeLabel === 'Last Order Date'}
          {...props}
        />
      </tr>
    </thead>
  )
}

export default ListHeader
