import styled from '#veewme/web/common/styled-components'
import { subMonths, subYears } from 'date-fns'
import * as React from 'react'
import { StyledH4, StyledMainWrapper } from '../../common/styled'
import { DateChartBox } from './dateChartStatsBox'
import FeesListBox from './feesListBox'
import { PieChartBox } from './pieChartStatsBox'
import SoldServicesListBox from './soldServicesListBox'
import { ListStatsBox, RangeValues, SimpleStatsBox, StatsLabelledValue, StyledStatsBaseBox, TrendStatsBox, TwoColumnsStatsBox } from './statsBox'

const StyledGrid = styled.div `
  display: grid;
  grid-auto-rows: 130px;
  grid-gap: 16px;
  justify-items: stretch;
  align-items: stretch;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const StyledAgentGrid = styled(StyledGrid) `
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StyledChartBoxWrapper = styled(StyledStatsBaseBox) `
  grid-column-end: span 3;
  grid-row-end: span 3;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-column-end: span 2;
    grid-row-end: span 2;
  }
`

const StyledDateChartBox = styled(DateChartBox) `
  grid-column-end: span 3;
  grid-row-end: span 3;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-column-end: span 2;
    grid-row-end: span 2;
  }
`

const StyledSoldServicesListBox = styled(SoldServicesListBox) `
  margin: 16px 0;
`

const StyledFeesListBox = styled(FeesListBox) `
  margin: 16px 0;
`

const StyledTitle = styled(StyledH4) `
  margin: 16px 0;
`

const MockGridHeader = styled.header `
  margin: 40px 0 16px;
`

interface AgentDashboardData {
  twelveMonthsVisitors: RangeValues
  todayRevenue: RangeValues
  monthRevenue: RangeValues
  monthServicesSell: RangeValues
  currency: string
}

const agentMockData: AgentDashboardData = {
  currency: '$',
  monthRevenue: {
    endValue: 11897,
    startValue: 10000
  },
  monthServicesSell: {
    endValue: 24,
    startValue: 24
  },
  todayRevenue: {
    endValue: 120,
    startValue: 95
  },
  twelveMonthsVisitors: {
    endValue: 20,
    startValue: 22
  }
}

interface AffiliateMockData {
  activeOrders: number
  clients: number
  monthRevenue: RangeValues
  todayRevenue: RangeValues
  monthServicesSell: RangeValues
  todayServicesSell: RangeValues
  currency: string
}

const affiliateMockData: AffiliateMockData = {
  activeOrders: 5,
  clients: 11,
  currency: '$',
  monthRevenue: {
    endValue: 11897,
    startValue: 10000
  },
  monthServicesSell: {
    endValue: 24,
    startValue: 24
  },
  todayRevenue: {
    endValue: 120,
    startValue: 95
  },
  todayServicesSell: {
    endValue: 3,
    startValue: 4
  }
}

interface AdminMockData {
  monthRevenue: RangeValues
  monthTourViews: RangeValues
  basicAffiliates: StatsLabelledValue
  proAffiliates: StatsLabelledValue
  currency: string
  clients: StatsLabelledValue[]
}

const adminMockData: AdminMockData = {
  basicAffiliates: {
    label: 'Basic:',
    value: 5
  },
  clients: [
    {
      label: 'Affiliate agents:',
      value: 5
    },
    {
      label: 'Self-service agents:',
      value: 15
    },
    {
      label: 'Self-service brokers:',
      value: 11
    }
  ],
  currency: '$',
  monthRevenue: {
    endValue: 11897,
    startValue: 10000
  },
  monthTourViews: {
    endValue: 24,
    startValue: 24
  },
  proAffiliates: {
    label: 'Pro:',
    value: 5
  }
}

const Dashboard: React.FunctionComponent<{}> = () => (
  <StyledMainWrapper>
    <StyledTitle>Dashboard</StyledTitle>
    <MockGridHeader>Agent</MockGridHeader>
    <StyledAgentGrid>
      <TrendStatsBox
        header='Visitors Last 12 Months'
        rangeValues={agentMockData.twelveMonthsVisitors}
        toDate={new Date()}
        fromDate={subYears(new Date(), 1)}
      />
      <TrendStatsBox
        header='Services Sold This Month'
        rangeValues={agentMockData.monthServicesSell}
        toDate={new Date()}
        fromDate={subMonths(new Date(), 1)}
      />
      <TrendStatsBox
        header='Revenue Today'
        rangeValues={agentMockData.todayRevenue}
        toDate={new Date()}
        fromDate={new Date()}
        currency={agentMockData.currency}
      />
      <TrendStatsBox
        header='Revenue This Month'
        rangeValues={agentMockData.monthRevenue}
        toDate={new Date()}
        fromDate={subMonths(new Date(), 1)}
        currency={agentMockData.currency}
      />
      <TrendStatsBox
        header='Case start === 0, end === 10'
        rangeValues={{
          endValue: 10,
          startValue: 0
        }}
      />
      <TrendStatsBox
        header='Case start === 10, end === 0'
        rangeValues={{
          endValue: 0,
          startValue: 10
        }}
      />
      <TrendStatsBox
        header='Case start === 0, end === 0'
        rangeValues={{
          endValue: 0,
          startValue: 0
        }}
      />
    </StyledAgentGrid>
    <MockGridHeader>Affiliate</MockGridHeader>
    <StyledGrid>
      <StyledChartBoxWrapper>
        <PieChartBox
          headerLabel='Traffic Sources'
          series={[
            {
              label: 'veewme.com (999 redirections)',
              value: 68.4
            },
            {
              label: 'beta.veewme.com (143 redirections)',
              value: 10.2
            },
            {
              label: 'tours.mixedmediaco.com (106 redirections)',
              value: 7.56
            },
            {
              label: 'trulia.com (41 redirections)',
              value: 2.92
            },
            {
              label: 'direct traffic e-mail and other (27 redirections)',
              value: 1.93
            },
            {
              label: 'media2market.com (21 redirections)',
              value: 1.5
            },
            {
              label: 'reinhatrealtors.com (21 redirections)',
              value: 1.5
            },
            {
              label: 'relator.com (17 redirections)',
              value: 1.21
            },
            {
              label: 'Other',
              value: 4.78
            }
          ]}
        />
      </StyledChartBoxWrapper>
      <TrendStatsBox
        header='Revenue Today'
        rangeValues={affiliateMockData.todayRevenue}
        toDate={new Date()}
        fromDate={new Date()}
        currency={affiliateMockData.currency}
      />
      <TrendStatsBox
        header='Revenue This Month'
        rangeValues={affiliateMockData.monthRevenue}
        toDate={new Date()}
        fromDate={subMonths(new Date(), 1)}
        currency={affiliateMockData.currency}
      />
      <TrendStatsBox
        header='Services Sold Today'
        rangeValues={affiliateMockData.todayServicesSell}
      />
      <TrendStatsBox
        header='Services Sold This Month'
        rangeValues={affiliateMockData.monthServicesSell}
        toDate={new Date()}
        fromDate={subMonths(new Date(), 1)}
      />
      <SimpleStatsBox
        header='Clients'
        value={affiliateMockData.clients}
      />
      <SimpleStatsBox
        header='Active Orders'
        value={affiliateMockData.activeOrders}
      />
    </StyledGrid>
    <StyledFeesListBox
      heading='Admin Fees'
    />
    <MockGridHeader>Admin</MockGridHeader>
    <StyledGrid>
      <StyledDateChartBox
        headerLabel='Revenue'
        valuePrefix='$'
      />
      <TrendStatsBox
        header='Revenue This Month'
        rangeValues={adminMockData.monthRevenue}
        toDate={new Date()}
        fromDate={subMonths(new Date(), 1)}
        currency={adminMockData.currency}
      />
      <TrendStatsBox
        header='Tour Views This Month'
        rangeValues={adminMockData.monthTourViews}
        toDate={new Date()}
        fromDate={subMonths(new Date(), 1)}
      />
      <TwoColumnsStatsBox
        header='Affiliates'
        labelledValue1={adminMockData.basicAffiliates}
        labelledValue2={adminMockData.proAffiliates}
      />
      <ListStatsBox
        header='Clients'
        listItems={adminMockData.clients}
      />
    </StyledGrid>
    <StyledSoldServicesListBox
      heading='Services sold this month'
    />
  </StyledMainWrapper>
)

export default Dashboard
