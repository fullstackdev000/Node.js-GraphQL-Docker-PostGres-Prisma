import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledAction = styled.div `
  grid-area: action;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  border-left: 1px solid ${props => props.theme.colors.INFO_BORDER};
  background-color: ${props => props.theme.colors.ACTIONBAR_BACKGROUND};
  padding: 8px 8px;
  & :first-child {
    margin-bottom: 8px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    border-top: 1px solid ${props => props.theme.colors.INFO_BORDER};
  }
`

interface ActionColumnProps {
  onViewClick?: () => void,
  onMediaClick?: () => void
}

const ActionColumn: React.FunctionComponent<ActionColumnProps> = props => (
  <StyledAction>
    <Button label='View' onClick={props.onViewClick}/>
    <Button label='Media' onClick={props.onMediaClick}/>
  </StyledAction>
)

export default ActionColumn
