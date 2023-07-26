import { publicUrls } from '#veewme/lib/urls'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Tour } from '../../types'
import { PreviewLayer } from '../common/styled'
import { TourContext } from './'
import Footer from './footer'
import Header from './header'
import Interactives from './interactives'
import Overview from './overview'
import Panorama from './panorama'
import Photos from './photos'
import Video from './video'

const Wrapper = styled.div<{
  previewMode?: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 105px;
  min-height: 100vh;

  ${props => props.previewMode && PreviewLayer}

  &:after {
    top: 105px;
  }


  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-top: 48px;

    &:after {
      top: 48px;
    }
  }

  main {
    flex: 1 0 auto;
    padding: 20px 0;
  }
`

interface LayoutProps {
  tour: Tour
}

const Layout: FunctionComponent<LayoutProps> = props => {
  const mainColor = rgbaToString(props.tour.mainColor)
  const contextData = {
    mainColor
  }

  return (
    <TourContext.Provider value={contextData}>
      <Wrapper previewMode={props.tour.previewMode}>
        <Header tour={props.tour} />
        <Switch>
          <Route exact path={publicUrls.tour} render={() => <Overview tour={props.tour} />} />
          <Route
            path={publicUrls.tourPhotos}
            render={() => (
              <Photos
                photos={props.tour.photos}
                slideshowAudioSrc={props.tour.slideshowAudioSrc}
              />
            )}
          />
          <Route
            path={publicUrls.tourVideo}
            render={({ match: { params: { id } } }) => (
              <Video tour={props.tour} id={id}/>
            )}
          />
          <Route
            path={publicUrls.tourPanorama}
            render={() => (
              <Panorama tour={props.tour} />
            )}
          />
          <Route
            path={publicUrls.tourInteractives}
            render={({ match: { params } }) => {
              return (
                <Interactives tour={props.tour} />
              )
            }}
          />
        </Switch>
        <Footer tour={props.tour} />
      </Wrapper>
    </TourContext.Provider>
  )
}
export default Layout
