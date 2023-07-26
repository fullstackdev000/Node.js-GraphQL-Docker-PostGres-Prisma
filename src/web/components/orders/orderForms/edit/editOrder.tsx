import TourTemplate from '#veewme/web/common/formPanels/tourTemplate'
import * as Grid from '#veewme/web/common/grid'
import { NavHashLink } from '#veewme/web/common/hashLink'
import SecondaryNavigation from '#veewme/web/common/secondaryNavigation'
import { differenceInDays } from 'date-fns'
import { EditorState } from 'draft-js'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { ValidationAlert } from '../styled'
import { CreateOrderFormValues, UpdateOrderFormInitValues, UpdateOrderFormValues } from '../types'

import { amenitiesList } from '../step2/amenities'
import AmenitiesPanel from '../step2/amenitiesPanel'
import MapPanel from '../step2/mapPanel'
import RealEstateAddressPanel from '../step2/realEstateAddressPanel'
import RealEstateDetailsPanel from '../step2/realEstateDetailsPanel'
import ShootInfoPanel from '../step2/shootInfo'

interface CustomProps {
  data: UpdateOrderFormInitValues
  agentTemplateHint?: JSX.Element
  onSubmit: (values: UpdateOrderFormValues) => void
  showCanadianBedrooms: boolean
}

const orderAgeAllowingEdit = 30
export type FormValues = UpdateOrderFormValues

type EditOrderFormViewProps = FormikProps<FormValues> & CustomProps

const EditOrderFormView: React.FC<EditOrderFormViewProps> = props => {
  const orderAgeinDays = differenceInDays(new Date(), props.data.createdAt)
  const allowAddressEdit = orderAgeinDays <= orderAgeAllowingEdit
  const showErrorAlert = !props.isValid && !!props.submitCount

  const {
    customLatitude: lat,
    customLongitude: lng,
    city,
    country,
    street,
    zip
} = props.values.realEstate
  const coordinates = (lat && lng) ? { lat, lng } : undefined
  const address = `${zip} ${street}, ${city}, ${country}`

  return (
    <>
      <Grid.Wrapper as={Form} >
        <Grid.Heading>
          <h1>Edit Order</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <SecondaryNavigation>
            <li><NavHashLink to='#address'>Address</NavHashLink></li>
            <li><NavHashLink to='#shoot'>Shoot Info</NavHashLink></li>
            <li><NavHashLink to='#details'>Property Details</NavHashLink></li>
            <li><NavHashLink to='#amenities'>Amenities</NavHashLink></li>
          </SecondaryNavigation>
        </Grid.LeftDesktopAside>
        <Grid.MainColumnFullWidth>
          <RealEstateAddressPanel
            onUpdateLocation={() => null}
            editMode={allowAddressEdit}
          />
          <MapPanel
            coordinates={coordinates}
            address={address}
            onCoordinatesUpdate={c => {
              props.setFieldValue('realEstate.customLatitude', c.lat)
              props.setFieldValue('realEstate.customLongitude', c.lng)
            }}
            showMap={props.values.realEstate.showOnMap}
          />
          <ShootInfoPanel />
          <RealEstateDetailsPanel
            isOpen
            showCanadianBedrooms={props.showCanadianBedrooms}
          />
          <AmenitiesPanel
            isOpen
            defaultAmenities={amenitiesList}
            values={props.values as unknown as CreateOrderFormValues}
          />
          <TourTemplate
            hideColorField
            templateRequired={false}
            agentTemplateHint={props.agentTemplateHint}
          />
          {showErrorAlert && (
            <ValidationAlert to='#'>
              There are some errors or omissions
            </ValidationAlert>

          )}
        </Grid.MainColumnFullWidth>
        <Grid.Footer />
      </Grid.Wrapper>
    </>
  )
}

const defaultValues: UpdateOrderFormValues = {
  createdAt: '',
  realEstate: {
    amenities: [],
    bedrooms: 0,
    city: '',
    country: 'US',
    fullBathrooms: 0,
    halfBathrooms: 0,
    lockBox: false,
    occupied: false,
    state: 'AL',
    street: '',
    tour: {
      descriptionFull: EditorState.createEmpty()
    },
    zip: ''
  }
}

type RealEstateRequiredFields = Pick<FormValues['realEstate'],
  | 'city'
  | 'street'
  | 'zip'
 >

interface RequiredFields {
  realEstate: RealEstateRequiredFields
}

export const FormSchema = Yup.object().shape<RequiredFields>({
  realEstate: Yup.object().shape({
    city:  Yup.string().required(),
    street: Yup.string().required(),
    zip:  Yup.string().required()
  })
})

const EditOrderForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    const val = values
    props.onSubmit(val)
    setSubmitting(false)
  },
  mapPropsToValues: props => {
    const valuesCopy = {
      ...props.data
    }

    delete valuesCopy.realEstate.agentPrimary

    return {
      ...defaultValues,
      ...valuesCopy
    }
  },
  validateOnChange: false,
  validationSchema: FormSchema
})(EditOrderFormView)

export default EditOrderForm
