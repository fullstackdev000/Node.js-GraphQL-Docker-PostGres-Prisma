import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { StyledHeader, StyledHeaderLabel, StyledStatsBaseBox } from './statsBox'

const StyledBox = styled(StyledStatsBaseBox) `
  height: 422px;
  user-select: none;
`

const StyledListBoxHeader = styled(StyledHeader) `
  margin-bottom: 16px;
`

const StyledContent = styled.div `
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.BORDER};
`

const StyledList = styled.ul `
  flex: 1;
`

export const StyledListItem = styled.div `
  border: 1px solid ${props => props.theme.colors.BORDER};
  border-radius: 7px;
  margin: 4px 0;
  & > :last-child {
    border: none;
  }
`

export const StyledListItemCell = styled.div `
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  padding: 16px;
  border-right: 1px dashed ${props => props.theme.colors.BORDER};
`

export interface ListHeaderItemType {
  label: string
  sortable?: boolean
}

export interface AdminListBoxItem {
  amount: number
  service: string
  sold: number
}

interface ListBoxProps {
  className?: string
  heading: string
  filtersBar?: JSX.Element
  listHeader: JSX.Element
  listItems: JSX.Element[]
}

const ListBox: React.FunctionComponent<ListBoxProps> = props => (
  <StyledBox className={props.className}>
    <StyledListBoxHeader>
      <StyledHeaderLabel>
        {props.heading}
      </StyledHeaderLabel>
    </StyledListBoxHeader>
    <StyledContent>
      {props.filtersBar}
      {props.listHeader}
      <StyledList>
        <Scrollbars>
          {props.listItems}
        </Scrollbars>
      </StyledList>
    </StyledContent>
  </StyledBox>
)

export default ListBox
