import GoogleMap from '#veewme/web/common/map'
// import styled, { keyframes } from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import { MapWrapper } from '../common/styled'

interface MapProps {
  tour: Tour
}

const Map: FunctionComponent<MapProps> = ({ tour }) => {
  return (
    <MapWrapper>
      <GoogleMap
        center={tour.coordinates}
        markerPosition={tour.coordinates}
      />
    </MapWrapper>
  )
}
export default Map
