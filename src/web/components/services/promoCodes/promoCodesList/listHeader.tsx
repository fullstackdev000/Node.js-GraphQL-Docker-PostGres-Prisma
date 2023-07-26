import ListHeaderItem from '#veewme/web/common/listHeaderItem'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { StyledGrid } from './styled'

const StyledGridCell = styled.div<{gridArea: string}> `
  grid-area: ${props => props.gridArea};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const StyledSecondRowCell = styled(StyledGridCell) `
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    border-top: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  }
`

const StyledHeader = styled(StyledGrid) `
  width: 100%;
  margin-top: 10px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

interface ListHeaderProps {
  activeItemLabel: string
  onItemClick: (label: string) => void
  reverseSort: boolean
}

const ListHeader: React.FunctionComponent<ListHeaderProps> = props => (
  <StyledHeader>
    <StyledGridCell
      gridArea='code'
    >
      <ListHeaderItem
        label='Code'
        active={props.activeItemLabel === 'Code'}
        reverseSort={props.reverseSort}
        onSort={props.onItemClick}
      />
    </StyledGridCell>
    <StyledGridCell
      gridArea='service'
    >
      <ListHeaderItem
        label='Service'
        active={props.activeItemLabel === 'Service'}
        reverseSort={props.reverseSort}
        onSort={props.onItemClick}
      />
    </StyledGridCell>
    <StyledGridCell
      gridArea='validity'
    >
      <ListHeaderItem
        label='Validity'
        active={props.activeItemLabel === 'Validity'}
        reverseSort={props.reverseSort}
        onSort={props.onItemClick}
      />
    </StyledGridCell>
    <StyledSecondRowCell
      gridArea='description'
    >
      <ListHeaderItem
        label='Description'
      />
    </StyledSecondRowCell>
    <StyledGridCell
      gridArea='discount'
    >
      <ListHeaderItem
        label='Discount'
        active={props.activeItemLabel === 'Discount'}
        reverseSort={props.reverseSort}
        onSort={props.onItemClick}
      />
    </StyledGridCell>
    <StyledSecondRowCell
      gridArea='expiration'
    >
      <ListHeaderItem
        label='Expiration'
        active={props.activeItemLabel === 'Expiration'}
        reverseSort={props.reverseSort}
        onSort={props.onItemClick}
      />
    </StyledSecondRowCell>
    <StyledSecondRowCell
      gridArea='used'
    >
      <ListHeaderItem
        label='Times used'
        active={props.activeItemLabel === 'Times used'}
        reverseSort={props.reverseSort}
        onSort={props.onItemClick}
      />
    </StyledSecondRowCell>
    <StyledGridCell
      gridArea='action'
    />
  </StyledHeader>
)

export default ListHeader
