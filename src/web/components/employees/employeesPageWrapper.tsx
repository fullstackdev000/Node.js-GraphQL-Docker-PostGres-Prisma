import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import * as Grid from '../../common/grid'
import TabsBar from '../../common/tabsBar'

const tabs = [
  {
    label: 'Users',
    plusTo: privateUrls.addEmployee,
    to: privateUrls.employees
  }
]

const EmployeesPageWrapper: React.FunctionComponent<{}> = props => (
  <Grid.PageContainer>
    <TabsBar tabs={tabs}/>
    {props.children}
  </Grid.PageContainer>
)

export default EmployeesPageWrapper
