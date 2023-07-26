import { UnreachableCaseError } from '#veewme/lib/error'
import { differenceInCalendarMonths, differenceInDays } from 'date-fns'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import * as React from 'react'
import { DateChartSeries, DateRangeStep } from './dateChartStatsBox'

const getPlotIntervalUnit = (step: DateRangeStep) => {
  switch (step) {
    case DateRangeStep.Month:
      return 'month'
    case DateRangeStep.Day:
      return 'day'
    default: throw new UnreachableCaseError(step)
  }
}

const fillSeriesData = (series: DateChartSeries) => {
  switch (series.range.step) {
    case DateRangeStep.Month:
      return Array.from({ length: Math.abs(differenceInCalendarMonths(new Date(series.range.start), new Date(series.range.end))) }, (_, i) => series.data[i] ? series.data[i] : null)
    case DateRangeStep.Day:
      return Array.from({ length: Math.abs(differenceInDays(new Date(series.range.start), new Date(series.range.end))) + 1 }, (_, i) => series.data[i] ? series.data[i] : null)
    default: throw new UnreachableCaseError(series.range.step)
  }
}

const getSeriesMax = (series: DateChartSeries[]) => (
  Math.max(...[...series.map(s => s.data)].reduce((a, b) => a.concat(b)))
)

const getDateFormat = (step: DateRangeStep) => {
  switch (step) {
    case DateRangeStep.Month:
      return '%B'
    case DateRangeStep.Day:
      return '%b %e'
    default: throw new UnreachableCaseError(step)
  }
}

const getHighchartOptionsSeries = (series: DateChartSeries[]) => {
  return series.map<Highcharts.SeriesAreaOptions>((s, index) => ({
    data: fillSeriesData(s),
    name: s.label,
    pointIntervalUnit: getPlotIntervalUnit(series[0].range.step),
    pointStart: series[0].range.start,
    type: 'area',
    visible: s.visible,
    zIndex: series.length - index
  }))
}

interface DateChartProps {
  series: DateChartSeries[]
  valuePrefix?: string
}

// To avoid unnecessary update keep all options in the state.
// https://www.npmjs.com/package/highcharts-react-official#optimal-way-to-update
interface DateChartState {
  chartOptions: Highcharts.Options
}

export class DateChart extends React.PureComponent<DateChartProps, DateChartState> {
  state: DateChartState = {
    chartOptions: {
      colors: ['#E5F3FF', '#CCE8FF'],
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          lineColor: '#555555',
          marker: {
            fillColor: '#555555',
            radius: 3,
            states: {
              hover: {
                fillColor: '#FFCC00',
                radius: 5
              }
            },
            symbol: 'circle'
          }
        }
      },
      series: getHighchartOptionsSeries(this.props.series),
      title: {
        text: undefined
      },
      tooltip: {
        headerFormat: '<span style="font-size: 11px"><b>{point.key}</b></span><br/>',
        shared: true,
        valueDecimals: 2,
        valuePrefix: this.props.valuePrefix,
        xDateFormat: getDateFormat(DateRangeStep.Month)
      },
      xAxis: {
        crosshair: {
          color: '#EEEEEE'
        },
        labels: {
          enabled: false
        },
        type: 'datetime'
      },
      yAxis: {
        max: getSeriesMax(this.props.series),
        title: {
          text: null
        }
      }
    }
  }

  componentDidUpdate (prevProps: DateChartProps) {
    if (prevProps.series !== this.props.series) {
      this.setState({
        chartOptions: {
          series: getHighchartOptionsSeries(this.props.series),
          tooltip: {
            xDateFormat: getDateFormat(this.props.series[0].range.step)
          },
          yAxis: {
            max: getSeriesMax(this.props.series)
          }
        }
      })
    }
  }

  render () {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={this.state.chartOptions}
      />
    )
  }
}
