import { LatLng } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import GoogleMap, { StreetView } from '#veewme/web/common/map'
import styled, { keyframes } from '#veewme/web/common/styled-components'
import { NoNullableFields } from '#veewme/web/common/util'
import { Field } from 'formik'
import React, { FunctionComponent } from 'react'
import Panel from '../../../../common/panel'
import { FormValues } from '../orderForm'

import { CoordinatesMutation, CoordinatesMutationVariables } from '#veewme/gen/graphqlTypes'
import { Coordinates } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

import * as log from '#veewme/web/common/log'

import Map from '#veewme/web/assets/svg/map.svg'

const MapPlaceholder = styled.div`
  height: 300px;
  background: ${props => props.theme.colors.BACKGROUND};
`

const MapWrapper = styled.div`
  width: 400px;
  margin-top: 30px;
  border: 3px solid ${props => props.theme.colors.GREY};
  border-radius: 5px;

  & + & {
    margin-left: 20px;
  }
`

const Heading = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 20px;
  }
`

const expand = keyframes`
  from {
    max-height: 0;
  }

  to {
    max-height: 600px;
  }
`

const InnerWrapper = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.BORDER};
  max-height: 0;
  overflow: hidden;
  animation-duration: 0.5s;
  animation-name: ${expand};
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards
`

const Text = styled.div`
  h5 {
    margin-bottom: 0;
    padding-bottom: 0;
    font-size: 16px;
    font-weight: 500;
  }

  p {
    margin: 5px 0 15px 0;
    font-size: 14px;
  }
`

const MapsHolder = styled.div`
  display: flex;
`

const LatLng = styled.div`
  display: flex;
  margin-top: 10px;

  > div {
    margin-right: 15px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
`

type CoordinatesQueryResponse = NoNullableFields<CoordinatesMutation>

interface MapProps {
  coordinates?: LatLng
  address: string
  onCoordinatesUpdate: (c: LatLng) => void
  showMap?: boolean
}

const MapPanel: FunctionComponent<MapProps> = ({
  address,
  coordinates,
  onCoordinatesUpdate,
  showMap
}) => {
  const { addToast } = useToasts()
  const [streetViewOk, setStreetViewStatus] = React.useState(false)
  const [getCoordinates, { loading }] = useMutation<CoordinatesQueryResponse, CoordinatesMutationVariables>(Coordinates, {
    onCompleted: ({ coordinates: { latitude, longitude } }) => {
      onCoordinatesUpdate({
        lat: latitude,
        lng: longitude
      })
    },
    onError: error => addToast(
      `Error ${error.message} while creating Order.`,
      { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
    )
  })

  return (
    <>
      <Panel heading=''>
        <Heading>
          <Map width='50' height='50' />
          <Field
            name={`${nameof<FormValues>('realEstate')}.${nameof<FormValues['realEstate']>('showOnMap')}`}
            component={SwitchField}
            label='Allow Map on Property Website'
            labelFirst
            compactMode={true}
          />
        </Heading>
        {
          showMap && (
            <InnerWrapper>
              <Text>
                <h5>Property Location</h5>
                <p>
                  Please verify Google is displaying the marker at the correct location.<br />
                  If not drag the figure to the correct location, then verify Street View is displaying the correct property.
                </p>
              </Text>
              <Button
                type='button'
                disabled={!address}
                full
                label='Update address on map'
                buttonTheme='action'
                onClick={() => {
                  getCoordinates({
                    variables: {
                      address
                    }
                  }).catch(e => log.debug(e))
                }}
              />
              <MapsHolder>
                <MapWrapper>
                  {
                    coordinates ? (
                      <GoogleMap
                        center={coordinates}
                        markerPosition={coordinates}
                        height='300px'
                        markerDraggable
                        onMarkerDragEnd={onCoordinatesUpdate}
                        setStreetViewStatus={status => setStreetViewStatus(status)}
                      />
                      ) : <MapPlaceholder />
                  }

                </MapWrapper>
                <MapWrapper>
                  {
                    coordinates ? (
                      <StreetView
                        center={coordinates}
                        markerPosition={coordinates}
                        height='300px'
                        viewAvailable={streetViewOk}
                      />
                      ) : <MapPlaceholder />
                  }

                </MapWrapper>
              </MapsHolder>
              <LatLng>
                <Field
                  name={`${nameof<FormValues>('realEstate')}.${nameof<FormValues['realEstate']>('customLatitude')}`}
                  component={InputField}
                  type='number'
                  label='Latitude:'
                />
                <Field
                  name={`${nameof<FormValues>('realEstate')}.${nameof<FormValues['realEstate']>('customLongitude')}`}
                  component={InputField}
                  type='number'
                  label='Longitude:'
                />
              </LatLng>
            </InnerWrapper>
          )
        }

      </Panel>
      <DotSpinnerModal isOpen={loading} />
    </>
  )
}
export default MapPanel
