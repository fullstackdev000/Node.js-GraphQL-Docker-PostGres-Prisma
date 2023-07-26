import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import * as Grid from '../../common/grid'
import TabsBar from '../../common/tabsBar'

const ClientPageWrapper: React.FunctionComponent<{}> = props => (
  <Grid.PageContainer>
    <TabsBar
      tabs={[
        { label: 'Agents', plusTo: privateUrls.addAgent, to: privateUrls.agents },
        { label: 'Brokerages', plusTo: privateUrls.addBrokerage, to: privateUrls.brokerages },
        { label: 'Offices', plusTo: privateUrls.addOffice, to: privateUrls.offices }
      ]}
    />
    {props.children}
  </Grid.PageContainer>
)

export default ClientPageWrapper
