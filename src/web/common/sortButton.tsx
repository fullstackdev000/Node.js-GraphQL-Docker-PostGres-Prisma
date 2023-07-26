import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

interface ArrowButtonProps {
  active?: boolean
}

const StyledArrowUpButton = styled.div<ArrowButtonProps> `
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 7px solid ${props => props.active ? props.theme.colors.BUTTON_BORDER_HOVER : props.theme.colors.BUTTON_BORDER};
`

const StyledArrowDownButton = styled.div `
  width: 0;
  height: 0;
  margin-top: 3px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid ${props => props.theme.colors.BUTTON_BORDER};
  cursor: pointer;
`

export const StyledContainer = styled.div<{ reverse?: boolean}> `
  padding: 4px 2px;
  cursor: pointer;
  margin-right: 2px;
  transform: ${props => props.reverse ? 'rotate(180deg)' : 'rotate(0deg)' };
`

interface SortButtonProps {
  active?: boolean
  reverse?: boolean
  onClick?: () => void // optional because in most cases click event is attached to paren container
}

export const SortButton: React.FunctionComponent<SortButtonProps> = props => (
  <StyledContainer reverse={props.reverse} onClick={props.onClick}>
    <StyledArrowUpButton active={props.active}/>
    <StyledArrowDownButton />
  </StyledContainer>
)
