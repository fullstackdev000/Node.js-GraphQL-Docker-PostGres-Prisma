// import styled from '#veewme/web/common/styled-components'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as React from 'react'
import { StyledChartWrapper, StyledHeader, StyledHeaderLabelWrapper } from './dateChartStatsBox'
import { StyledHeaderLabel } from './statsBox'

interface PieChartData {
  label: string
  value: number
}

interface PieChartBoxProps {
  className?: string
  headerLabel: string
  series: PieChartData[]
}

// To avoid unnecessary update keep all options in the state.
// https://www.npmjs.com/package/highcharts-react-official#optimal-way-to-update
interface PieChartBoxState {
  chartOptions: Highcharts.Options
}

export class PieChartBox extends React.PureComponent<PieChartBoxProps, PieChartBoxState> {
  state: PieChartBoxState = {
    chartOptions: {
      credits: {
        enabled: false
      },
      legend: {
        align: 'right',
        itemMarginBottom: 5,
        layout: 'vertical',
        verticalAlign: 'middle',
        x: -100,
        y: 0
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          point: {
            events: {
              legendItemClick () {
                return false
              }
            }
          },
          showInLegend: true
        }
      },
      responsive: {
        rules: [{
          chartOptions: {
            legend: {
              align: 'right',
              itemStyle: {
                fontSize: '10'
              },
              x: -80
            }
          },
          condition: {
            maxWidth: 799
          }
        }]
      },
      series: [{
        colorByPoint: true,
        data: this.props.series.map<Highcharts.SeriesPieDataOptions>(s => ({
          name: s.label,
          y: s.value
        })),
        name: this.props.headerLabel,
        type: 'pie'
      }],
      title: {
        text: undefined
      },
      tooltip: {
        headerFormat: '<span style="font-size: 11px"><b>{series.name}</b></span><br/>',
        pointFormat: '{point.name}: <b>{point.percentage:.1f} %</b>',
        valueDecimals: 2
      }
    }
  }

  render () {
    return (
      <>
        <StyledHeader>
          <StyledHeaderLabelWrapper>
            <StyledHeaderLabel>
              {this.props.headerLabel}
            </StyledHeaderLabel>
          </StyledHeaderLabelWrapper>
        </StyledHeader>
        <StyledChartWrapper>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.state.chartOptions}
          />
        </StyledChartWrapper>
      </>
    )
  }
}
