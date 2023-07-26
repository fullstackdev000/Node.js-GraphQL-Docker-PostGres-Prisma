import MsgSvg from '#veewme/web/assets/svg/msg.svg'
import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledPrice = styled.h4<{ color: string }> `
  display: inline-block;
  font-weight: 600;
  font-size: 22px;
  color: #fff;
`

const StyledFooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`

const StyledBackFooterContent = styled(StyledFooterContent)`
  justify-content: center;
`

const StyledIcon = styled(props => <props.icon className={props.className} />)`
  width: 24px;
  height: 20px;
  fill: ${props => props.theme.colors.BUTTON}
`

const StyledFlipBackButton = styled(props => <Button {...props} />)`
  &:hover {
    color: #000 !important;
    // border-color: ${props => props.color} !important;
    background: #fff !important;
  }
  background: #fff;
`

interface ServiceCardFooterContentProps {
  color: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface ServiceCardFrontFooterContentProps extends ServiceCardFooterContentProps {
  price: string
}

export const ServiceCardFrontFooterContent: React.FunctionComponent<ServiceCardFrontFooterContentProps> = props => (
  <StyledFooterContent>
    <StyledPrice color={props.color}>{props.price}</StyledPrice>
    <StyledIcon icon={MsgSvg} />
  </StyledFooterContent>
)

export const ServiceCardBackFooterContent: React.FunctionComponent<ServiceCardFooterContentProps> = props => {
  return (
    <StyledBackFooterContent>
      <StyledFlipBackButton label='Flip to front' onClick={props.onClick} color={props.color} />
    </StyledBackFooterContent>
  )
}
