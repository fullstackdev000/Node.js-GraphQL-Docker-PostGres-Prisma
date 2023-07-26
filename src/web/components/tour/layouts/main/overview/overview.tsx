// import { publicUrls } from '#veewme/lib/urls'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../../types'
import { Container } from '../styled'
import Banner from './banner'
import BannerKenburns from './bannerKenburns'
import ContactBox from './contactBox'
import Description from './description'

// TODO needed just for demo. Remove in future
import { NavLink } from 'react-router-dom'

const DemoLinks = () => {
  return (
    <Container style={{ padding: '20px 0' }}>
      <p style={{ margin: '15px 0' }}>Links to different layout versions (with different config)</p>
      <NavLink to='?v1'>Demo 1 (Price in header)</NavLink><br/>
      <NavLink to='?v2'>Demo 2 (Call agent in header and Kenburns banner)</NavLink><br/>
      <NavLink to='?v3'>Demo 3 (Logo in header)</NavLink>
    </Container>
  )
}

const Wrapper = styled(Container).attrs({
  as: 'main'
})`
  display: grid;
  grid-template-columns: 1fr 300px;
  column-gap: 20px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 100%;
    justify-items: center;
  }
`

interface OverviewProps {
  tour: Tour
}

const Overview: FunctionComponent<OverviewProps> = props => {
  let BannerComponent = (
    <Banner
      photos={props.tour.bannerPhotos}
      customBanner={props.tour.customBanner}
      title={props.tour.title}
      hideTitle={props.tour.hideRealEstateHeadline}
    />
  )

  if (props.tour.bannerType === 'KENBURNS') {
    BannerComponent = (
      <BannerKenburns
        photos={props.tour.bannerPhotos}
        title={props.tour.title}
        audioSrc={props.tour.slideshowAudioSrc}
        hideTitle={props.tour.hideRealEstateHeadline}
      />
    )
  }

  return (
    <>
      {BannerComponent}
      <Wrapper>
        <Description tour={props.tour} />
        <ContactBox
          contactPerson={props.tour.contactPerson}
          contactPerson2={props.tour.contactPerson2}
        />
      </Wrapper>
      <DemoLinks />
    </>
  )
}
export default Overview
