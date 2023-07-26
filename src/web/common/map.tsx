
import { LatLng } from '#veewme/lib/types'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { GoogleMap, Marker, StreetViewPanorama, StreetViewService, useJsApiLoader } from '@react-google-maps/api'
import * as React from 'react'
import Geocode from 'react-geocode'

const NoStreetViewPlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: ${props => props.theme.colors.BACKGROUND};
`

type StreetViewServiceProps = React.ComponentProps<typeof StreetViewService>
type OnLoadStreetViewService = StreetViewServiceProps['onLoad']

export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAPS_API_KEY || ''

export interface MapProps {
  center?: LatLng
  zoom?: number
  markerPosition: LatLng
  height?: string
  markerDraggable?: boolean
  onMarkerDragEnd?: (c: LatLng) => void
  setStreetViewStatus?: (status: boolean) => void
}

const Map: React.FC<MapProps> = props => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_API_KEY
  })

  const streetViewRef = React.useRef<google.maps.StreetViewService | null>(null)

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  const checkStreetViewStatus = () => {
    const svService = streetViewRef.current
    if (svService) {
      svService.getPanorama({
        location: props.markerPosition,
        radius: 50
      }, (data, status) => {
        props.setStreetViewStatus && props.setStreetViewStatus(status === 'OK')
      }).catch(e => log.debug(e))
    }
  }

  const onStreetViewServiceLoad: OnLoadStreetViewService = svService => {
    if (svService) {
      streetViewRef.current = svService
      checkStreetViewStatus()
    }
  }

  React.useEffect(() => {
    checkStreetViewStatus()
  }, [props.markerPosition])

  return (
    <>
    {
      isLoaded && (
      <GoogleMap
        mapContainerStyle={{
          height: props.height || '600px',
          width: '100%'
        }}
        center={props.center}
        zoom={15}
        options={{ scrollwheel: false, styles: [{
          stylers: [{
            saturation: -100
          }]
        }] }}
      >
        <Marker
          position={props.markerPosition}
          draggable={props.markerDraggable}
          onDragEnd={e => {
            if (e && e.latLng && props.onMarkerDragEnd) {
              props.onMarkerDragEnd({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              })
            }
          }}
        />
        <StreetViewService
          onLoad={onStreetViewServiceLoad}
        />
      </GoogleMap>
      )
    }
    </>
  )
}

type StreetViewProps = Omit<MapProps, 'onMarkerDragEnd' | 'markerDraggable'> & {
  viewAvailable?: boolean
}
export const StreetView: React.FC<StreetViewProps> = props => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_API_KEY
  })

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  if (!props.viewAvailable) {
    return <NoStreetViewPlaceholder>No Street View</NoStreetViewPlaceholder>
  }

  return (
    <>
    {
      isLoaded && (
      <GoogleMap
        mapContainerStyle={{
          height: props.height || '600px',
          width: '100%'
        }}
        center={props.center}
        zoom={15}
        options={{ scrollwheel: false, styles: [{
          stylers: [{
            saturation: -100
          }]
        }] }}
      >
        {
          props.viewAvailable && (
            <StreetViewPanorama
              position={props.markerPosition}
              visible
            />
          )
        } />
      </GoogleMap>
      )
    }
    </>
  )
}

export const addressToLatLng = async (address: string) => {
  Geocode.setApiKey(GOOGLE_MAP_API_KEY)
  try {
    const response = await Geocode.fromAddress(address)
    const { lat, lng } = response.results[0].geometry.location
    return { lat, lng }
  } catch (error) {
    log.error(error)
    throw new Error(error.message)
  }
}

export default React.memo(Map)
