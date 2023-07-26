import * as React from 'react'
import ListHeaderItem, { ListHeaderItemProps } from '../../common/listHeaderItem'
import styled from '../../common/styled-components'

export const Table = styled.table`
  width: 100%;
  margin-bottom: 25px;
  padding: 0;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  border-collapse:separate;
  border-spacing: 0 15px;
  font-weight: 500;
`

export const Row = styled.tr<{
  suspended?: boolean
}>`
  margin: 0 0 15px 0;
  background-color: #fff;
  font-size: 11px;
  border-radius: 5px;
  border: 1px solid ${props => props.theme.colors.BORDER};
  color: ${props => props.theme.colors.FIELD_TEXT};

  ${props => props.suspended && `
    background-color: ${props.theme.colors.EXTRA_LIGHT_GREY};
    color: ${props.theme.colors.GREY};

    a {
      color: ${props.theme.colors.GREY} !important;
    }

    img,
    svg {
      opacity: 0.6;
    }
  `}
`

export const TableHeader = styled.th<{sortable: boolean}>`
  font-size: 11px;
  font-weight: 400;
  padding-left: ${props => props.sortable ? '0' : '8px'};
  padding-right: 8px;
  vertical-align: top;
`

export type TableHeaderCellProps = {
  activeLabel?: string
} & ListHeaderItemProps

export const Header: React.FunctionComponent<TableHeaderCellProps> = props => {
  if (props.onSort) {
    const active = props.label === props.activeLabel || props.active
    return (
      <TableHeader sortable={!!props.onSort} className={props.className}>
        <ListHeaderItem
          label={props.label}
          onSort={props.onSort}
          active={active}
          reverseSort={props.reverseSort && active}
        />
      </TableHeader>
    )
  } else {
    return (
      <TableHeader sortable={false}>
        <ListHeaderItem
          label={props.label}
        />
      </TableHeader>
    )
  }
}

export const TableCell = styled.td`
  padding: 8px 15px;
  border: 1px solid ${props => props.theme.colors.BORDER};
  border-width: 1px 1px 1px 0;
  border-right-style: dashed;
  &:first-child {
    border-left: 1px solid ${props => props.theme.colors.BORDER};
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  &:last-child {
    border-right: 1px solid ${props => props.theme.colors.BORDER};
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`

export const CellContentWrapper = styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`

export const Cell: React.FunctionComponent<{className?: string}> = props => (
  <TableCell className={props.className}>
    <CellContentWrapper>
      {props.children}
    </CellContentWrapper>
  </TableCell>
)
