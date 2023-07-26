import { Country } from '#veewme/gen/graphqlTypes'
import { Amenity, LatLng } from '#veewme/lib/types'
import * as React from 'react'
import { FormValues } from '../orderForm'
import { ConvertedAgent } from '../types'
import AgentPanel from './agentPanel'
import AmenitiesPanel from './amenitiesPanel'
import MapPanel from './mapPanel'
import RealEstateAddressPanel from './realEstateAddressPanel'
import RealEstateDetailsPanel from './realEstateDetailsPanel'
import ShootInfoPanel from './shootInfo'
import Skip from './skip'

export interface Step2FieldsProps {
  amenities: Amenity[]
}

interface CustomProps {
  values: FormValues
  onUpdateLocation: () => void
  agents: ConvertedAgent[]
  isAgent?: boolean
  country?: Country
  coordinates: Partial<LatLng>
  address: string
  onCoordinatesUpdate: (c: LatLng) => void
  showMap?: boolean
}

type Step2Props = CustomProps & Step2FieldsProps

const Step2: React.FunctionComponent<Step2Props> = props => {
  const { coordinates: { lat, lng } } = props
  const coordinates = (lat && lng) ? { lat, lng } : undefined
  return (
    <>
      <AgentPanel
        agents={props.agents}
        isAgent={props.isAgent}
        primaryAgentId={props.values.realEstate.agentPrimaryId}
      />
      <RealEstateAddressPanel
        onUpdateLocation={props.onUpdateLocation}
        editMode
      />
      <MapPanel
        coordinates={coordinates}
        address={props.address}
        onCoordinatesUpdate={props.onCoordinatesUpdate}
        showMap={props.showMap}
      />
      <ShootInfoPanel />
      <Skip />
      <RealEstateDetailsPanel showCanadianBedrooms={props.country === 'CA'} />
      <AmenitiesPanel
        defaultAmenities={props.amenities}
        values={props.values}
      />
    </>
  )
}

export default Step2
