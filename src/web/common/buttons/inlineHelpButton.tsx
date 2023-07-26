import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledInlineHelpButton = styled.button `
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 13px;
  font-weight: 700;
  background-color: ${props => props.theme.colors.BUBBLE_BACKGROUND};
  cursor: pointer;
`

interface InlineHelpButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const InlineHelpButton: React.FunctionComponent<InlineHelpButtonProps> = props => (
  <StyledInlineHelpButton type='button' onClick={props.onClick}>
    <p>?</p>
  </StyledInlineHelpButton>
)

export default InlineHelpButton
