import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled, { createGlobalStyle } from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import MainFooter from '../common/footer'
import { PreviewLayer } from '../common/styled'
import { TourContext } from './'
import Header, { height as headerHeight } from './header'
import Additional from './sections/additional'
import Agents from './sections/agents'
import Amenities from './sections/amenities'
import Interactives from './sections/interactives'
import Overview from './sections/overview'
import Panorama from './sections/panorama'
import Photos from './sections/photos'
import Videos from './sections/videos'

const GlobalStyles = createGlobalStyle`
  div, span, section, p, a, li, article {
    font-family: 'Helvetica', 'Arial', sans-serif;
  }

`
const Wrapper = styled.div<{
  previewMode?: boolean
}>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: ${headerHeight};
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, transparent 1px, #f9f9f9 5px, transparent 8px),
    linear-gradient(to bottom, transparent 1px, #f9f9f9 5px, transparent 8px);

  ${props => props.previewMode && PreviewLayer}

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    padding-top: 0;
  }

  main {
    flex: 1 0 auto;
    padding: 20px 0;
  }
`

const ScrollContext = styled.div`
  position: relative
`

interface LayoutProps {
  tour: Tour
}

// https://styled-components.com/docs/faqs#note-regarding-css-import-and-createglobalstyle
const font = "@import url('http://fonts.cdnfonts.com/css/american-typewriter')"

const Layout: FunctionComponent<LayoutProps> = props => {
  const mainColor = rgbaToString(props.tour.mainColor)
  const contextData = {
    mainColor
  }

  return (
    <TourContext.Provider value={contextData}>
      <style>
       {`${font}`}
      </style>
      <GlobalStyles />
      <Wrapper previewMode={props.tour.previewMode}>
        <Header tour={props.tour} />
        <ScrollContext>
          <Overview tour={props.tour} />
          {props.tour.amenities.length > 0 && <Amenities tour={props.tour} />}
          <Photos
            photos={props.tour.photos}
            slideshowAudioSrc={props.tour.slideshowAudioSrc}
            mainColor={mainColor}
          />
          {props.tour.panoramas.length > 0 && <Panorama tour={props.tour} />}
          {props.tour.videos.length > 0 && <Videos tour={props.tour} />}
          {props.tour.interactives.length > 0 && <Interactives tour={props.tour} />}
          <Additional tour={props.tour} />
          <Agents
            contactPerson={props.tour.contactPerson}
            contactPerson2={props.tour.contactPerson2}
          />
        </ScrollContext>
        <MainFooter tour={props.tour} />
      </Wrapper>
    </TourContext.Provider>
  )
}
export default Layout
