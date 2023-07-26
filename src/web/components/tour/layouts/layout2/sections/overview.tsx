// import { publicUrls } from '#veewme/lib/urls'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../../types'
import Menu from '../menu'
import { bannerLeftIndentation, Container } from '../styled'
import Banner from './banner'
import Description, { DescriptionText, StyledArticle } from './description'

const OverviewWrapper = styled.div`
  position: relative;
  padding-left: 0;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-left: ${bannerLeftIndentation};
  }
`

interface OverviewProps {
  tour: Tour
}

const Overview: FunctionComponent<OverviewProps> = props => {
  const description = props.tour.descriptionText && (
    <DescriptionText>
      <StyledArticle content={props.tour.descriptionText} />
    </DescriptionText>
  )

  return (
    <>
      <OverviewWrapper id='overview'>
        <Menu tour={props.tour} />
        <Banner
          photos={props.tour.bannerPhotos}
          customBanner={props.tour.customBanner}
          title={props.tour.title}
          hideTitle={props.tour.hideRealEstateHeadline}
        />
        <Description tour={props.tour} />
      </OverviewWrapper>
      <Container>
        {description}
      </Container>
    </>
  )
}
export default Overview
