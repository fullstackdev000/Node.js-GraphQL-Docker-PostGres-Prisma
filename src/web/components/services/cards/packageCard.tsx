import CheckMarkSvg from '#veewme/web/assets/svg/checkmark.svg'
import Card from '#veewme/web/common/card'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { PackageCard as PackageCardType } from '../types'

export const StyledServicesWrapper = styled.div `
  height: 160px;
  overflow: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 12px 20px 12px;
  font-size: 11px;
  background: #E6F1C4;
  flex-grow: 1;

  & > div {
    margin: 6px 0;
  }

  & :first-child {
    margin-top: 0;
  }
`

const StyledService = styled.div<{ suspended?: boolean }> `
  display: flex;
  align-items: center;
  margin: 10px 10px 10px 0;
  & p {
    color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.theme.colors.SERVICE_DESCRIPTION};
  }
  & svg {
    fill: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.theme.colors.GREEN};
  }
`

const StyledLabel = styled.p `
  display: inline-block;
  margin-left: 8px;
  font-weight: 500;
`

export const StyledCheckMarkIcon = styled(CheckMarkSvg) `
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  fill: ${props => props.theme.colors.GREEN};
  }
`
const footerTextColor = '#fff'
export const StyledPrice = styled.h4<{ suspended?: boolean }> `
  display: inline-block;
  margin: 0 10px;
  font-weight: 600;
  font-size: 22px;
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : footerTextColor};
`

export const StyledOldPrice = styled(StyledPrice) `
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : footerTextColor};
  text-decoration: line-through;
`

const StyledFooterContent = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;

`

export const StyledTitle = styled.div<{
  suspended?: boolean
}>`
  padding: 0 10px 10px 5px;
  margin: 0 0 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.GREEN};
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  text-align: center;
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : '#000'};
`

interface FooterContentProps {
  card: PackageCardType
  currency: string
}

const FooterContent: React.FunctionComponent<FooterContentProps> = props => (
  <StyledFooterContent>
    {props.card.totalPrice > props.card.price && <StyledOldPrice suspended={props.card.suspended}>{props.currency + ' ' + props.card.totalPrice}</StyledOldPrice>}
    <StyledPrice suspended={props.card.suspended}>{props.currency + ' ' + props.card.price}</StyledPrice>
  </StyledFooterContent>
)

const StyledCard = styled(Card)<{ suspended?: boolean }> `
  background: #E6F1C4;
  margin: 0 12px;
  width: 250px;
  border-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.theme.colors.GREEN};
  & header,
  & footer {
    background-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.theme.colors.GREEN};
    color: #fff;
  }
`

interface PackageCardProps {
  card: PackageCardType
  currency?: string
}

// TODO update ServicePackage with currency field
const PackageCard: React.FunctionComponent<PackageCardProps> = ({ currency = '$', ...props }) => {
  return (
    <StyledCard
      id={props.card.id}
      title={props.card.name}
      suspended={props.card.suspended}
      footerContent={<FooterContent
        card={props.card}
        currency={currency}
      />}
    >
      <StyledServicesWrapper>
        <Scrollbars
          autoHeight={true}
          autoHeightMax='120px'
          autoHeightMin='120px'
        >
          <StyledTitle suspended={props.card.suspended}>{props.card.title}</StyledTitle>
          {props.card.services.map((service, i) => (
            <StyledService
              key={i}
              suspended={props.card.suspended}
            >
              <StyledCheckMarkIcon/>
              <StyledLabel>{service.name}</StyledLabel>
            </StyledService>)
          )}
        </Scrollbars>
      </StyledServicesWrapper>
    </StyledCard>
  )
}

export default PackageCard
