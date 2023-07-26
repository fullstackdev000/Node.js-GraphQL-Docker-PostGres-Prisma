import * as React from 'react'
import { Header } from './tableItems'

const TableHeader: React.FunctionComponent = props => {
  return (
    <thead>
      <tr>
        <Header label='Affiliate' />
        <Header label='Affiliate Type' />
        <Header label='Company' />
        <Header label='City' />
        <Header label='State' />
        <Header label='Country' />
        <Header label='White Label' />
        <Header label='Join Date' />
        <Header label='Last Active' />
        <Header label='Agents' />
        <Header label='Orders' />
        <Header label='Contact Information' />
      </tr>
    </thead>
  )
}

export default TableHeader
