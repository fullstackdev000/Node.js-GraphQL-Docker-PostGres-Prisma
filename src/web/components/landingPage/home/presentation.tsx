import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { H1, H3, Section } from './styled'
import withImage, { WrappedComponentPropsWithRef } from './withImage'

const PresentationSection = styled(Section)`
  display: grid;
  grid-template-columns: 46% 46%;
  grid-column-gap: 8%;
  & > * {
    grid-column: 1/-1;
  }
  img {
    max-width: 100%;
    align-self: center;
    justify-self: center;
  }
`

const Column = styled.div`
  &:first-of-type {
    text-align: center;
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      grid-column: 1;
    }
  }
  &:last-child {
    display: grid;
    grid-template-columns: 46% 46%;
    grid-column-gap: 8%;
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      grid-column: 2;
      grid-template-columns: 0;
      grid-column-gap: 0;
    }
  }
`

const TourPhotography = styled.img`
  margin: 20px auto;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 40px auto;
  }
`
const TourVideo = styled.img`
  grid-column: 1;
  margin: 20px auto;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-column: 2;
    margin: 20px auto;
  }
`
const TourNavigation = styled.img`
  grid-column: 2;
  margin: 20px auto;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 20px auto;
  }
`

const Presentation: React.FunctionComponent<WrappedComponentPropsWithRef> = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <PresentationSection showImage={props.showImage} ref={ref}>
      <H1>Experience is the new commodity in real estate</H1>
      <H3>A stunning presentation with multiple media makes for a memorable and engaging experience</H3>
      <Column>
        <p>
          Ingenious property “Overview” page allows viewers to <strong>determine if the home viewed is "the one". </strong>
          If they like what they see they can delve in deeper and further engage with
          <strong> photo and other media such as video, floor plans, virtual reality and/or augmented reality.</strong>
        </p>
        <p>Fully responsive property sites for viewing on any device, scalable to full screen HD, just click & drag your browser window to adjust size.</p>
        <TourPhotography src='/public/static/img/real-estate-photography-tour-hosting.jpg' alt='Real Estate Tour Photo Gallery' />
      </Column>
      <Column>
        <TourVideo src='/public/static/img/real-estate-video-tour-hosting.jpg' alt='Video Tour Hosting for Real Estate' />
        <TourNavigation src='/public/static/img/virtual-tour-overview-navigation.gif' alt='HD Real Estate Video Tours' />
      </Column>
    </PresentationSection>
  )
})

export default withImage(Presentation)
