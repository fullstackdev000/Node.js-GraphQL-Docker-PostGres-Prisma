import { ServiceCategory } from '#veewme/gen/graphqlTypes'
import MsgSvg from '#veewme/web/assets/svg/msg.svg'
import Button from '#veewme/web/common/buttons/basicButton'
// import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledPrice = styled.h4<{ category: ServiceCategory, suspended?: boolean }> `
  display: inline-block;
  font-weight: 600;
  font-size: 22px;
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : '#fff'};
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
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : 'inherit'} !important;
  border-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.category.color} !important;
  cursor: ${props => props.suspended ? 'default' : 'pointer'}
  &:hover {
    // color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.category.color} !important;
    // border-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.category.color} !important;
    background: #fff !important;
  }
  background: #fff;
`

interface ServiceCardFooterContentProps {
  category: ServiceCategory
  suspended?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface ServiceCardFrontFooterContentProps extends ServiceCardFooterContentProps {
  price: string
}

export const ServiceCardFrontFooterContent: React.FunctionComponent<ServiceCardFrontFooterContentProps> = props => (
  <StyledFooterContent>
    <StyledPrice
      category={props.category}
      suspended={props.suspended}
    >
      {props.price}
    </StyledPrice>
    <StyledIcon icon={MsgSvg} />
  </StyledFooterContent>
)

export const ServiceCardBackFooterContent: React.FunctionComponent<ServiceCardFooterContentProps> = props => {
  return (
    <StyledBackFooterContent>
      <StyledFlipBackButton
        label='Flip to front'
        onClick={props.suspended ? undefined : props.onClick}
        category={props.category}
        suspended={props.suspended}
      />
    </StyledBackFooterContent>
  )
}
