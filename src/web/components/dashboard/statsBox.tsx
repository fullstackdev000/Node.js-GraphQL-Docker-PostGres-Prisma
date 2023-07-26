import { themeColors } from '#veewme/web/common/colors'
import styled from '#veewme/web/common/styled-components'
import { format } from 'date-fns'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'

const getValueChangeColor = (value?: number) => {
  if (value === undefined) {
    return
  } else {
    if (value > 0) return themeColors.OK
    else if (value < 0) return themeColors.ALERT
    else return themeColors.ORANGE
  }
}

const getValueChangeSymbol = (value?: number) => {
  if (value === undefined) {
    return
  } else {
    if (value > 0) return '\u2191 '
    else if (value < 0) return '\u2193 '
    else return '\u2194 '
  }
}

// no negative values
const getPercentChange = (start: number, end: number) => {
  if (start !== 0) {
    return Math.round((end - start) / start * 100)
  } else if (end === 0) {
    return 0
  } else return
}

export const StyledStatsBaseBox = styled.div `
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 5px;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.BORDER};
  padding: 16px;
`

const StyledStatsBox = styled(StyledStatsBaseBox) `
  border-right-width: 3px;
`

const StyledTrendBox = styled(StyledStatsBox)<{ percentChange?: number }> `
  border-right-color: ${props => getValueChangeColor(props.percentChange)};
`

export const StyledHeaderLabel = styled.h2 `
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StyledHeader = styled.header `
  margin-bottom: 24px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const StyledValue = styled.span `
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
`

const StyledTrend = styled.span<{ percentChange?: number }> `
  font-size: 13px;
  font-weight: 600;
  color: ${props => getValueChangeColor(props.percentChange)};
  margin-left: 12px;
  margin-bottom: 4px;
  &:before {
    font-size: 16px;
    font-weight: 700;
    content: '${props => getValueChangeSymbol(props.percentChange)}';
  }
`

const StyledValueTrendWrapper = styled.div `
  display: flex;
  align-items: flex-end;
`

const StyledLegend = styled.span `
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-size: 10px;
  font-weight: 400;
  margin-top: 8px;
`

const StyledTwoColumnsGrid = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  & :nth-child(2) {
    border-left: 1px solid ${props => props.theme.colors.BORDER}
    padding-left: 16px;
  }
`

const StyledList = styled.ul `
  list-style: none;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  & :last-child {
    margin-bottom: 0;
  }
`

const StyledItem = styled.li `
  margin-bottom: 6px;
  & > p:before {
    display: inline-block;
    content: '';
    margin-right: 8px;
    border: 4px solid ${props => props.theme.colors.OK};
    border-radius: 50%;
  }
`

const StyledOkValue = styled.span `
  color: ${props => props.theme.colors.OK}
`

interface StatsBoxProps {
  header: string
}

export interface RangeValues {
  endValue: number
  startValue: number
}

interface SimpleStatsBoxProps extends StatsBoxProps {
  value: number
}

export const SimpleStatsBox: React.FunctionComponent<SimpleStatsBoxProps> = props => (
  <StyledStatsBox>
    <StyledHeader>
      <StyledHeaderLabel>
        {props.header}
      </StyledHeaderLabel>
    </StyledHeader>
    <StyledValue>{props.value}</StyledValue>
  </StyledStatsBox>
)

interface TrendStatsBoxProps extends StatsBoxProps {
  rangeValues: RangeValues
  currency?: string
  fromDate?: Date
  toDate?: Date
  dateFormat?: string
}

export const TrendStatsBox: React.FunctionComponent<TrendStatsBoxProps> = ({ dateFormat = 'MM/DD/YYYY', ...props }) => {
  const percentChange = getPercentChange(props.rangeValues.startValue, props.rangeValues.endValue)
  const decimals = props.currency ? 2 : 0

  return (
    <StyledTrendBox percentChange={percentChange}>
      <StyledHeader>
        <StyledHeaderLabel>
          {props.header}
        </StyledHeaderLabel>
      </StyledHeader>
      <StyledValueTrendWrapper>
        <StyledValue>{props.currency}{props.rangeValues.endValue.toFixed(decimals)}</StyledValue>
        <StyledTrend percentChange={percentChange}>{percentChange !== undefined ? `${percentChange}%` : 'Change N/A'}</StyledTrend>
      </StyledValueTrendWrapper>
      {props.fromDate && props.toDate &&
        <StyledLegend>Dates: {format(props.fromDate, dateFormat)} - {format(props.toDate, dateFormat)}</StyledLegend>
      }
    </StyledTrendBox>
  )
}

export interface StatsLabelledValue {
  label: string
  value: number
}

interface TwoColumnsStatsBoxProps extends StatsBoxProps {
  labelledValue1: StatsLabelledValue
  labelledValue2: StatsLabelledValue
}

export const TwoColumnsStatsBox: React.FunctionComponent<TwoColumnsStatsBoxProps> = props => (
  <StyledStatsBox>
    <StyledHeader>
      <StyledHeaderLabel>
        {props.header}
      </StyledHeaderLabel>
    </StyledHeader>
    <StyledTwoColumnsGrid>
      <p>{props.labelledValue1.label} <StyledOkValue>{props.labelledValue1.value}</StyledOkValue></p>
      <p>{props.labelledValue2.label} <StyledOkValue>{props.labelledValue2.value}</StyledOkValue></p>
    </StyledTwoColumnsGrid>
  </StyledStatsBox>
)

interface ListStatsBoxProps extends StatsBoxProps {
  listItems: StatsLabelledValue[]
}

export const ListStatsBox: React.FunctionComponent<ListStatsBoxProps> = props => (
  <StyledStatsBox>
    <StyledHeader>
      <StyledHeaderLabel>
        {props.header}
      </StyledHeaderLabel>
    </StyledHeader>
    <Scrollbars>
      <StyledList>
        {props.listItems.map(item => (
          <StyledItem key={item.label}>
            <p>{item.label} <StyledOkValue>{item.value}</StyledOkValue></p>
          </StyledItem>
        ))}
      </StyledList>
    </Scrollbars>
  </StyledStatsBox>
)
