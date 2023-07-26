import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledWrapper = styled.div `
  position: absolute;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.75);
  width: 100%;
  height: 100%;
  min-width: 220px;
  min-height: 140px;
  border-radius: 7px 0 0 7px;
  padding: 16px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    border-radius: 0;
    padding: 8px;
  }
`

const StyledContent = styled.div `
  position: relative;
  display: flex;
  flex-direction: column;
  margin-right: 30px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin-right: 20px;
  }
`

const StyledTitle = styled.h6 `
  font-weight: 700;
  font-size: 14px;
  color: ${props => props.theme.colors.GREEN};
  margin-bottom: 4px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 11px;
  }
`

const StyledSubTitle = styled.h6 `
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.theme.colors.ALERT};
  margin-bottom: 8px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 10px;
  }
`

const StyledCost = styled.p `
  font-weight: 700;
  font-size: 14px;
  color: white;
  align-self: flex-end;
  margin-bottom: 12px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 11px;
  }
`

const StyledText = styled.p `
  font-weight: 500;
  font-size: 13px;
  color: white;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 10px;
  }
`

const StyledUrl = styled.a `
  font-weight: 500;
  font-size: 13px;
  color: white;
  text-decoration: underline;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 10px;
  }
`

const StyledOkButton = styled.button `
  position: absolute;
  bottom: 10px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.colors.GREEN};
  border: none;
  outline: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  font-weight: 700px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    right: 10px;
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
`

const StyledCancelButton = styled.button `
  position: absolute;
  top: 10px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  outline: none;
  color: ${props => props.theme.colors.ALERT};
  font-size: 20px;
  font-weight: 700px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    right: 10px;
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`

interface OrderActivationConfirmProps {
  cost: string
  termsURL: string
  onConfirm: () => void
  onCancel: () => void
}

const OrderActivationConfirm: React.FunctionComponent<OrderActivationConfirmProps> = props => {
  return (
    <StyledWrapper>
      <StyledContent>
        <StyledTitle>Note!</StyledTitle>
        <StyledSubTitle>Activating an order.</StyledSubTitle>
        <StyledCost>Cost {props.cost}</StyledCost>
        <StyledText>
          Amount will be added to your daily statement, collected as agreed.
        </StyledText>
        <StyledUrl href={props.termsURL} target='_blank'>View terms</StyledUrl>
      </StyledContent>
      <StyledCancelButton onClick={props.onCancel}>X</StyledCancelButton>
      <StyledOkButton onClick={props.onConfirm}>OK</StyledOkButton>
    </StyledWrapper>
  )
}

export default OrderActivationConfirm
