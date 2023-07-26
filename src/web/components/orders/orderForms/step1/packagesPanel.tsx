import { nameof } from '#veewme/lib/util'
import { PackageCard as PackageCardType } from '#veewme/web/components/services/types'
import { Field } from 'formik'
import * as React from 'react'
import Step1Carousel from '../../../../common/carousel/carousel'
import Panel from '../../../../common/panel'
import styled from '../../../../common/styled-components'
import { FormValues } from '../orderForm'
import PackageCard from './packageCard'

const StyledCarouselPanel = styled(Panel)`
  margin: 30px 0;
  padding: 0;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin: 6px 0;
    padding: 0;
    > div {
      padding: 0 10px;
    }
  }
`

const StyledCarouselWrapper = styled.div `
  display: flex;
  justify-content: center;
  /* padding: 20px 0; */
`

const StyledCardWrapper = styled.div `
  margin: 0 12px;
`

const StyledComment = styled.div `
  margin: 20px;
  p {
    font-weight: 500;
    font-size: 14px;
    color: ${props => props.theme.colors.SIDEBAR_ICON};
  }
`

const StyledCarousel = styled(Step1Carousel)`
  min-width: 900px;
  width: 900px;
  height: 330px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    min-width: 625px;
    width: 625px;
  }
`

export interface PackagesPanelProps {
  values: FormValues
  packageCards: PackageCardType[]
}

const PackagesPanel: React.FunctionComponent<PackagesPanelProps> = props => {
  const getActiveIndicators = () => {
    const card = props.packageCards.find(pc => pc.id === props.values.servicePackageId)
    if (card) {
      return [props.packageCards.indexOf(card)]
    } else {
      return []
    }
  }

  return(
    <StyledCarouselPanel heading='Select Package'>
      <StyledCarouselWrapper>
        <StyledCarousel
          showIndicator
          activeIndicators={getActiveIndicators()}
        >
          {props.packageCards.map((card, i) => (
            <StyledCardWrapper key={i}>
              <Field
                name={`${nameof<FormValues>('servicePackageId')}`}
                component={PackageCard}
                id={card.id}
                value={props.values.servicePackageId}
                title={card.title}
                serviceName={card.name}
                services={card.services}
                price={card.price}
                oldPrice={card.totalPrice}
              />
            </StyledCardWrapper>
          ))}
        </StyledCarousel>
      </StyledCarouselWrapper>
      <StyledComment>
        <p>Order a la carte below</p>
      </StyledComment>
    </StyledCarouselPanel>
  )
}

export default PackagesPanel
