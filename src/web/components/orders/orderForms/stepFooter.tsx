import * as React from 'react'
import styled from '../../../common/styled-components'

const StyledButton = styled.button `
  outline: none;
  padding: 10px;
  border: none;
  border-radius: 5px;
`

const StyledNextButton = styled(StyledButton) `
  background-color: ${props => props.theme.colors.GREEN};
  color: white;
`

const StyledPrevButton = styled(StyledButton) `
  background-color: transparent;
  border: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
  color: black;
`

const StyledFooter = styled.footer `
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 3px solid ${props => props.theme.colors.BORDER};
  padding: 20px;
  font-weight: 600;
  font-size: 14px;
`

interface StepFooterProps {
  nextButtonLabel: string
  prevButtonLabel?: string
  onPrevClick?: () => void
  onNextClick?: () => void
}

const StepFooter: React.FunctionComponent<StepFooterProps> = props => (
  <StyledFooter>
    {props.prevButtonLabel &&
      <StyledPrevButton onClick={props.onPrevClick}>{props.prevButtonLabel}</StyledPrevButton>
    }
    {props.children}
    <StyledNextButton onClick={props.onNextClick}>{props.nextButtonLabel}</StyledNextButton>
  </StyledFooter>
)

export default StepFooter
