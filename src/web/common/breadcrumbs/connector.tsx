import * as React from 'react'
import styled from '../styled-components'

const StyledConnector = styled.div<{ active?: boolean }> `
  height: 30px;
  width: 4px;
  margin-left: 16px;
  border-right: 4px solid ${props => props.active ? props.theme.colors.BUTTON_BORDER_HOVER : props.theme.colors.BUTTON_BORDER};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    height: 4px;
    width: 30px;
    margin: 0 10px;
    border-top: 4px solid ${props => props.active ? props.theme.colors.BUTTON_BORDER_HOVER : props.theme.colors.BUTTON_BORDER};
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    height: 4px;
    width: 12px;
  }
`

interface ConnectorProps {
  active?: boolean
}

const Connector: React.FunctionComponent<ConnectorProps> = props => (
  <StyledConnector active={props.active}/>
)

export default Connector
