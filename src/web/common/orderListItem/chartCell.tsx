import { OrderQueryData } from '#veewme/web/components/orders/types'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as React from 'react'
import styled from '../styled-components'
import { StyledChartCell } from './styled'

const StyledHighchartsReact = styled(HighchartsReact)`
  width: 100px;
  height: 100px;
`

const StyledFullStats = styled.p `
  position: absolute;
  display: block;
  top: 6px;
  right: 10px;
  font-size: 10px;
  color: ${props => props.theme.colors.BLUE};
  cursor: pointer;
`

const chartOptions: Highcharts.Options = {
  credits: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  series: [
    {
      data: [3, 2, 5, 4, 3, 6, 4, 7, 10, 3, 12, 10, 7, 16, 10, 6, 11, 12, 10, 7, 16, 10, 6, 4, 7, 10, 3, 12, 10, 17],
      name: 'Visits',
      type: 'line'
    }
  ],
  title: {
    align: 'left',
    style: {
      fontSize: '12px'
    },
    text: 'Views (last 30 days)'
  },
  xAxis: {
    labels: {
      enabled: false
    }
  },
  yAxis: {
    title: {
      text: null
    }
  }
}

interface ChartCellProps {
  order: OrderQueryData
  onFullStatsClick: () => void
}

const ChartCell: React.FunctionComponent<ChartCellProps> = props => (
  <StyledChartCell>
    <StyledHighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
    <StyledFullStats
      onClick={() => props.onFullStatsClick()}
    >
      Full Stats
    </StyledFullStats>
  </StyledChartCell>
)

export default ChartCell
