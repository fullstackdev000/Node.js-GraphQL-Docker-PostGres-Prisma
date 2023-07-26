import GoogleMap from '#veewme/web/common/map'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { Tour } from '../../../types'
import { MapWrapper } from '../../common/styled'
import { Container, SectionTitle } from '../styled'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding-top: 30px;
  padding-bottom: 50px;

  ${SectionTitle} + div {
    position: relative;

    > div {
      :after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        box-shadow: inset 0px 0px 10px 3px rgba(0, 0, 0, 0.5);
        pointer-events: none;
      }
    }
  }
`

interface MapProps {
  tour: Tour
}

const Map: FunctionComponent<MapProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <MapWrapper>
      <Wrapper mainColor={mainColor}>
        <SectionTitle mainColor={mainColor}>Map</SectionTitle>
        <div>
          <GoogleMap
            center={tour.coordinates}
            markerPosition={tour.coordinates}
          />
        </div>
      </Wrapper>
    </MapWrapper>
  )
}
export default Map
