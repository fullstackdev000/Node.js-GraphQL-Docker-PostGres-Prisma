import { UnreachableCaseError } from '#veewme/lib/error'
import styled from '#veewme/web/common/styled-components'
import { differenceInDays, endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear, subYears } from 'date-fns'
import * as React from 'react'
import { Check } from 'styled-icons/fa-solid'
import { DateChart } from './dateChart'
import { StyledHeaderLabel, StyledStatsBaseBox } from './statsBox'

// TODO replace with fetch data from server
export const fetchDateRangeSeries = (range: SeriesDateRange) => {
  switch (range.step) {
    case DateRangeStep.Month: {
      return [
        {
          data: Array.from({ length: Math.floor(Math.random() * 8) + 3 }, () => Math.floor(Math.random() * (15000 - 6000 + 1) + 6000)),
          label: 'Current Year',
          range: {
            end: range.end,
            start: range.start,
            step: range.step
          },
          visible: true
        },
        {
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * (15000 - 6000 + 1) + 6000)),
          label: 'Last Year',
          range: {
            end: subYears(range.end, 1).getTime(),
            start: subYears(range.start, 1).getTime(),
            step: range.step
          },
          visible: true
        }
      ]
    }
    case DateRangeStep.Day:
      return [
        {
          data: Array.from({ length: Math.floor(Math.random() * (Math.abs(differenceInDays(range.start, range.end)) - 3)) + 2 }, () => Math.floor(Math.random() * (400 - 90 + 1) + 90)),
          label: 'Current Year',
          range: {
            end: range.end,
            start: range.start,
            step: range.step
          },
          visible: true
        },
        {
          data: Array.from({ length: Math.abs(differenceInDays(subYears(range.start, 1), subYears(range.end, 1))) + 1 }, () => Math.floor(Math.random() * (400 - 90 + 1) + 90)),
          label: 'Last Year',
          range: {
            end: subYears(range.end, 1).getTime(),
            start: subYears(range.start, 1).getTime(),
            step: range.step
          },
          visible: true
        }
      ]
    default: throw new UnreachableCaseError(range.step)
  }
}

export const StyledHeader = styled.header `
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

export const StyledHeaderLabelWrapper = styled.div `
  display: flex;
  align-items: center;
`

const StyledHeaderTabsWrapper = styled.div `
  position: relative;
  display: flex;
  align-items: center;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 3px solid ${props => props.theme.colors.BORDER};
    z-index: 1;
  }
`

const StyledHeaderTab = styled.button<{ selected?: boolean }> `
  position: relative;
  z-index: 2;
  margin-right: 24px;
  padding: 16px 0;
  outline: none;
  border: none;
  background-color: transparent;
  border-bottom: 3px solid transparent;
  border-color: ${props => props.selected ? props.theme.colors.GREEN : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.theme.colors.LABEL_TEXT};
  &:hover, &:active, &:focus {
    color: black;
    border-bottom: 3px solid ${props => props.theme.colors.GREEN};
  };
  &:last-child {
    margin-right: 0;
  };
`

export const StyledChartWrapper = styled.div `
  flex: 1;
  & div {
    height: 100% !important;
  }
`

const StyledFooter = styled.footer `
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 24px 0;
  color: ${props => props.theme.colors.LABEL_TEXT};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 16px 0 0 0;
  }
`

const StyledLegendBar = styled.div `
  display: flex;
  &:last-child {
    margin-right: 0;
  };
`

const StyledLegendItem = styled.div `
  position: relative;
  display: flex;
  margin-right: 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  & > span {
    margin-top: 4px;
  }
  & > span:nth-of-type(1) {
    color: ${props => props.theme.colors.GREEN};
  }
  & > span:nth-of-type(2) {
    margin-left: 8px;
    margin-right: 8px;
    color: black;
  }
  & > span:nth-of-type(3) {
    font-weight: 400;
    font-size: 14px;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }
  &:before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid ${props => props.theme.colors.BORDER};
    margin-right: 8px;
  }
`

const CheckWrapper = styled.div `
  position: absolute;
  left: 4px;
  top: 2px;
  width: 20px;
  height: 20px;
  svg {
    color: ${props => props.theme.colors.GREEN};
    background: transparent
  }
`

export const getUTCDate = (date = new Date()) => {
  return date.getTime() - date.getTimezoneOffset() * 60 * 1000
}

const getTabDateRange = (tab: ChartBoxTab) => {
  switch (tab) {
    case ChartBoxTab.Year:
      return ({
        end: getUTCDate(endOfYear(new Date())),
        start: getUTCDate(startOfYear(new Date())),
        step: DateRangeStep.Month
      })
    case ChartBoxTab.Month:
      return ({
        end: getUTCDate(endOfMonth(new Date())),
        start: getUTCDate(startOfMonth(new Date())),
        step: DateRangeStep.Day
      })
    case ChartBoxTab.Week:
      return ({
        end: getUTCDate(endOfWeek(new Date())),
        start: getUTCDate(startOfWeek(new Date())),
        step: DateRangeStep.Day
      })
    default: throw new UnreachableCaseError(tab)
  }
}

export enum DateRangeStep {
  Day,
  Month
}

export interface SeriesDateRange {
  start: number
  end: number
  step: DateRangeStep
}

export interface DateChartSeries {
  label: string
  data: number[]
  range: SeriesDateRange
  visible: boolean
}

export enum ChartBoxTab {
  Year,
  Month,
  Week
}

interface DateChartBoxProps {
  className?: string
  headerLabel: string
  valuePrefix?: string
  selectedTab: ChartBoxTab
}

interface DateChartBoxState {
  selectedTab: ChartBoxTab
  series: DateChartSeries[]
  range: SeriesDateRange
}

export class DateChartBox extends React.PureComponent<DateChartBoxProps, DateChartBoxState> {
  static defaultProps = {
    selectedTab: ChartBoxTab.Year
  }

  state: DateChartBoxState = {
    range: getTabDateRange(this.props.selectedTab),
    selectedTab: this.props.selectedTab,
    series: fetchDateRangeSeries(getTabDateRange(this.props.selectedTab))
  }

  handleTabClick = (tab: ChartBoxTab) => {
    if (tab !== this.state.selectedTab) {
      const range = getTabDateRange(tab)
      this.setState({
        range,
        selectedTab: tab,
        series: fetchDateRangeSeries(range)
      })
    }
  }

  handleLegendButtonClick = (index: number) => {
    if (this.state.series) {
      const series = this.state.series.map((s, i) => {
        if (i === index) {
          return {
            ...s,
            visible: !s.visible
          }
        } else return s
      })
      this.setState({
        series
      })
    }
  }

  render () {
    return (
      <StyledStatsBaseBox className={this.props.className}>
        <StyledHeader>
          <StyledHeaderLabelWrapper>
            <StyledHeaderLabel>
              {this.props.headerLabel}
            </StyledHeaderLabel>
          </StyledHeaderLabelWrapper>
          <StyledHeaderTabsWrapper>
            <StyledHeaderTab
              selected={this.state.selectedTab === ChartBoxTab.Year}
              onClick={() => this.handleTabClick(ChartBoxTab.Year)}
            >
              <span>Year</span>
            </StyledHeaderTab>
            <StyledHeaderTab
              selected={this.state.selectedTab === ChartBoxTab.Month}
              onClick={() => this.handleTabClick(ChartBoxTab.Month)}
            >
              <span>Monthly</span>
            </StyledHeaderTab>
            <StyledHeaderTab
              selected={this.state.selectedTab === ChartBoxTab.Week}
              onClick={() => this.handleTabClick(ChartBoxTab.Week)}
            >
              <span>Weekly</span>
            </StyledHeaderTab>
          </StyledHeaderTabsWrapper>
        </StyledHeader>
        <StyledChartWrapper>
          <DateChart
            series={this.state.series}
          />
        </StyledChartWrapper>
        <StyledFooter>
          <StyledLegendBar>
            {this.state.series && this.state.series.map((s, index) => (
            <StyledLegendItem
              key={index}
              onClick={() => this.handleLegendButtonClick(index)}
            >
              {this.state.series && this.state.series[index].visible &&
                <CheckWrapper>
                  <Check/>
                </CheckWrapper>
              }
              <span>{s.label}:</span>
              <span>{this.props.valuePrefix ? this.props.valuePrefix : ''}{s.data.reduce((sum: number, value: number) => (sum + value), 0)}</span>
              <span>(total)</span>
            </StyledLegendItem>
            ))}
          </StyledLegendBar>
        </StyledFooter>
      </StyledStatsBaseBox>
    )
  }
}
