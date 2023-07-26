import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { SortButton } from './sortButton'

/*
  This component is extracted from Order component.
  TODO: find all places where this component can be re-used and refactor them.
  Such refactoring should be done in separate PR
*/

const StyledListHeaderItem = styled.div<{ active?: boolean, sortable?: boolean}> `
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: ${props => props.sortable ? 'pointer' : 'auto'};
  user-select: none;
  & > p {
    padding-left: 4px;
    color: ${props => props.active ? props.theme.colors.LABEL_TEXT_HOVER : props.theme.colors.LABEL_TEXT}
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 10px;
    & + div {
      border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
    }
  }
`

interface BaseListHeaderItemProps {
  className?: string
  label: string
}

interface UnsortableListHeaderItemProps extends BaseListHeaderItemProps {
  onSort?: never
}

export interface SortableListHeaderItemProps extends BaseListHeaderItemProps {
  onSort: (label: string) => void
  active: boolean
  reverseSort: boolean
}

export type ListHeaderItemProps = UnsortableListHeaderItemProps | SortableListHeaderItemProps

const ListHeaderItem: React.FunctionComponent<ListHeaderItemProps> = props => {
  const handleClick = () => {
    if (props.onSort) {
      props.onSort(props.label)
    }
  }

  return (
    <StyledListHeaderItem
      className={props.className}
      active={props.onSort && props.active}
      sortable={props.onSort !== undefined}
      onClick={handleClick}
    >
      {
        props.onSort &&
        <SortButton
          active={props.active}
          reverse={props.reverseSort}
        />
      }
      <p>{props.label}</p>
    </StyledListHeaderItem>
  )
}

export default ListHeaderItem
