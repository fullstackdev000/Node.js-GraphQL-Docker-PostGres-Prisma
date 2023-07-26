import * as React from 'react'
import { Link } from 'react-router-dom'
import * as Meta from '../../../common/metaData'
import SecondaryNavigation from '../../../common/secondaryNavigation'

const Aside: React.FunctionComponent<{}> = () => {
  return (
    <>
      <SecondaryNavigation>
        <li><Link to='#abc'>Abc</Link></li>
        <li><Link to='#cba'>Cba</Link></li>
      </SecondaryNavigation>
      <Meta.Container>
        <li>
          <Meta.Label>Date Joined:</Meta.Label>
          <Meta.Data>02/06/18 1:58 p.m.</Meta.Data>
        </li>
        <li>
          <Meta.Label>Last Login:</Meta.Label>
          <Meta.Data>02/06/18 1:58 p.m.</Meta.Data>
        </li>
        <li>
          <Meta.Label>Username:</Meta.Label>
          <Meta.Data>JamesDan</Meta.Data>
        </li>
      </Meta.Container>
    </>
  )
}

export default Aside
