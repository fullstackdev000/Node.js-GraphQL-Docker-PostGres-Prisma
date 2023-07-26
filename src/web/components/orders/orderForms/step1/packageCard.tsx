import { PackageCard as PackageCardType } from '#veewme/lib/types'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import FormikCard, { FormikCardProps } from '../../../../common/formikFields/cardField'
import styled from '../../../../common/styled-components'

import { StyledCheckMarkIcon, StyledOldPrice, StyledPrice, StyledServicesWrapper, StyledTitle } from '#veewme/web/components/services/cards/packageCard'

const StyledService = styled.div `
  display: flex;
  align-items: center;
  margin: 10px 10px 10px 0;
`

const StyledLabel = styled.p `
  display: inline-block;
  margin-left: 8px;
  font-weight: 500;
  color: ${props => props.theme.colors.SERVICE_DESCRIPTION};
`

const StyledFooterContent = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface FooterContentProps {
  price: number
  oldPrice?: number
}

const FooterContent: React.FunctionComponent<FooterContentProps> = props => (
  <StyledFooterContent>
    {props.oldPrice && <StyledOldPrice>{'$ ' + props.oldPrice}</StyledOldPrice>}
    <StyledPrice>{'$ ' + props.price}</StyledPrice>
  </StyledFooterContent>
)

const StyledCard = styled(FormikCard) `
  background: #E6F1C4;
  width: 250px;
  height: 300px;
  border-color: ${props => props.theme.colors.GREEN};
  & header,
  & footer {
    background-color: ${props => props.theme.colors.GREEN};
  }
`
// TODO: property `title` in Card component should be renamed because there is a conflict with `service.title` property
type PackageCardProps = PackageCardType & FormikCardProps & {
  serviceName: string
}

const PackageCard: React.FunctionComponent<PackageCardProps> = props => {
  const { form, field } = props
  return (
    <StyledCard
      field={field}
      form={form}
      id={props.id}
      title={props.serviceName}
      footerContent={<FooterContent price={props.price} oldPrice={props.oldPrice}/>}
    >
      <StyledServicesWrapper>
        <Scrollbars
          autoHeight={true}
          autoHeightMax='120px'
          autoHeightMin='120px'
        >
          <StyledTitle>{props.title}</StyledTitle>
          {props.services.map((service, i) => (
            <StyledService key={i}>
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
