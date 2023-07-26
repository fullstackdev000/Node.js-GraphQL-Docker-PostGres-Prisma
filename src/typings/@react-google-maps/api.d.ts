import '@react-google-maps/api'
import { LatLng } from '#veewme/lib/types'

declare module '@react-google-maps/api' {
  import * as React from 'react'

  export interface StreetViewPanoramaProps {
    position: LatLng
    visible?: boolean
  }


}
