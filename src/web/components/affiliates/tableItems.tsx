import ListHeaderItem, { ListHeaderItemProps, SortableListHeaderItemProps } from '#veewme/web/common/listHeaderItem'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

export const Table = styled.table`
  width: 100%;
  margin-bottom: 25px;
  padding: 0;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  border-collapse:separate;
  border-spacing: 0 15px;
  font-weight: 500;
  table-layout: fixed;
`

export const HeaderItem = styled.th<{sortable: boolean}>`
  font-size: 11px;
  font-weight: 400;
  padding-left: ${props => props.sortable ? '0' : '4px'};
  padding-right: 4px;
  vertical-align: top;
`

function isSortable (headerElement: ListHeaderItemProps): headerElement is SortableListHeaderItemProps {
  return headerElement.onSort !== undefined
}

export const Header: React.FunctionComponent<ListHeaderItemProps> = props => {
  const { className, ...listHeaderItemProps } = props
  return (
    <HeaderItem sortable={isSortable(listHeaderItemProps)} className={props.className}>
      <ListHeaderItem {...listHeaderItemProps} />
    </HeaderItem>
  )
}

export const RowCell = styled.td<{accountConfirmed: boolean}>`
  margin: 0 0 15px 0;
  background-color: #fff;
  font-size: 11px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  border: 1px solid ${props => props.theme.colors.BORDER};
  position: relative;
  & > table {
    width: 100%;
    table-layout: fixed;
  }
  &:after {
    display: block;
    content: '';
    height: 100%;
    width: 5px;
    border-top: 1px solid ${props => props.theme.colors.BORDER};
    border-bottom: 1px solid ${props => props.theme.colors.BORDER};
    border-right: 4px solid ${props => props.accountConfirmed ? props.theme.colors.GREEN : props.theme.colors.ORANGE};
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: white;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: -5px;
  }
`

export const Row: React.FunctionComponent<{accountConfirmed: boolean, colSpan?: number}> = props => {
  return (
    <tr>
      <RowCell accountConfirmed={props.accountConfirmed} colSpan={props.colSpan}>
        <table>
          {props.children}
        </table>
      </RowCell>
    </tr>
  )
}

export const TableCell = styled.td`
  padding: 8px;
  vertical-align: top;
  &:not(:last-child) {
    border-right: 1px dashed ${props => props.theme.colors.BORDER};
  }
`

export const CellContentWrapper = styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  p {
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-constent: flex-start;
  }
`

export const Cell: React.FunctionComponent<{className?: string, colSpan?: number}> = props => (
  <TableCell colSpan={props.colSpan} className={props.className}>
    <CellContentWrapper>
      {props.children}
    </CellContentWrapper>
  </TableCell>
)

export const ActionRow = styled.tr`
  & > td {
    border-top: 2px solid ${props => props.theme.colors.BORDER};
  }
`

export const ActionCell = styled(Cell)`
  & > div {
    overflow-x: initial;
    justify-content: flex-end;
    & > * {
      margin-left: 10px;
    }
  }
`

export const AffiliateCol = styled.col`width: 19%;`
export const TypeCol = styled.col`width: 7.5%;`
export const CompanyCol = styled.col`width: 10%;`
export const CityCol = styled.col`width: 10%;`
export const StatesCol = styled.col`width: 3.5%`
export const CountryCol = styled.col`width: 7.5%;`
export const WhiteLabelCol = styled.col`width: 5%;`
export const JoinDateCol = styled.col`width: 5%;`
export const LastActiveCol = styled.col`width: 5%;`
export const AgentsCol = styled.col`width: 3.5%;`
export const OrdersCol = styled.col`width: 3.5%;`
export const ContactInformationCol = styled.col`width: 13.5%;`
export const RightBorderCol = styled.col`width: 9px;`

export const ColGroup: React.FunctionComponent = () => {
  return (
    <colgroup>
      <AffiliateCol/>
      <TypeCol/>
      <CompanyCol/>
      <CityCol/>
      <StatesCol/>
      <CountryCol/>
      <WhiteLabelCol/>
      <JoinDateCol/>
      <LastActiveCol/>
      <AgentsCol/>
      <OrdersCol/>
      <ContactInformationCol/>
    </colgroup>
  )
}

export const Cols: React.FunctionComponent = props => {
  return (
    <>
      <ColGroup />
      <tbody>{props.children}</tbody>
    </>
  )
}
