import * as React from 'react'
import { Header } from '../tableItems'

interface ListHeaderProps {
  onSort: () => void
  reverseSort: boolean
}

const ListHeader: React.FunctionComponent<ListHeaderProps> = props => {
  return (
    <thead>
      <tr>
        <Header label='Name' active {...props} />
        <Header label='Address' />
        <Header label='Region' />
        <Header label='Company Pay' />
        <Header label='Special Price' />
        <Header label='Offices' />
        <Header label='Agents' />
      </tr>
    </thead>
  )
}

export default ListHeader
