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
        <Header label='Broker Office' active {...props} />
        <Header label='Address' />
        <Header label='Region' />
        <Header label='Company Pay' />
        <Header label='Agents' />
        <Header label='Office Admin' />
      </tr>
    </thead>
  )
}

export default ListHeader
