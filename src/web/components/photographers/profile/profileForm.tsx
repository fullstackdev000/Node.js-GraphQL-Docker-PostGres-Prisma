import { unsetNumberId } from '#veewme/web/common/consts'
import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import Address from '#veewme/web/common/formPanels/address'
import { NavHashLink } from '#veewme/web/common/hashLink'
import styled from '#veewme/web/common/styled-components'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Grid from '../../../common/grid'
import * as Meta from '../../../common/metaData'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import { Photographer, Processor } from '../common/types'
import ProfileValidationSchema from '../common/validation'
import ContactInformation from './contactInformation'
import General from './general'
import InternalNote from './internalNote'
import ProfilePicture from './profilePicture'
import Region from './region'
import Settings from './settings'

export const StyledGridWrapper = styled(Grid.Wrapper) `
  padding: 0 0 60px;
  &:before {
    width: 100%;
    left: 0;
  }
`

export type ProfileRole = 'Photographer' | 'Processor'

interface CustomProps {
  accountEdit?: boolean
  role: ProfileRole
  regions: Array<{
    id: number
    label: string
  }>
}

export type ProfileValues = Omit<Processor, 'id'>

export type PhotographerProfileValues = Omit<Photographer, 'id'>

export type ProcessorProfileValues = ProfileValues

type PhotographerProps = CustomProps & {
  initialData?: Partial<PhotographerProfileValues>
  onSubmit: (values: PhotographerProfileValues) => void
}

type ProcessorProps = CustomProps & {
  initialData?: Partial<ProcessorProfileValues>
  onSubmit: (values: ProcessorProfileValues) => void
}

type PhotographerFormProps = FormikProps<PhotographerProfileValues> & PhotographerProps

type ProcessorFormProps = FormikProps<ProcessorProfileValues> & ProcessorProps

type ProfileFormProps = ProcessorFormProps | PhotographerFormProps

const PhotographerForm: React.FunctionComponent<PhotographerFormProps> = props => (
  <ProfileForm
    {...props}
    role='Photographer'
  />
)

const ProcessorForm: React.FunctionComponent<ProcessorFormProps> = props => (
  <ProfileForm
    {...props}
    role='Processor'
  />
)

const ProfileForm: React.FunctionComponent<ProfileFormProps> = props => {
  const accountEdit = props.accountEdit
  const WrapperComponent = accountEdit ? Grid.Wrapper : StyledGridWrapper

  return (
    <>
      <WrapperComponent as={Form} >
        <Grid.Heading>
          <h1>{props.role === 'Photographer' ? `Photographer` : `Processor`}'s profile</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <SecondaryNavigation>
            <li><NavHashLink to='#general'>General</NavHashLink></li>
            <li><NavHashLink to='#address'>Address</NavHashLink></li>
            {!accountEdit && <li><NavHashLink to='#settings'>Settings</NavHashLink></li>}
            {props.role === 'Photographer' &&
              <li><NavHashLink to='#profilePicturePanel'>Profile Picture</NavHashLink></li>
            }
          </SecondaryNavigation>
          <Meta.Container>
            <li>
              <Meta.Label>Username:</Meta.Label>
              <Meta.Data>JamesDan</Meta.Data>
            </li>
          </Meta.Container>
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <General/>
          <Address/>
          {!accountEdit && <Settings role={props.role} />}
          {props.role === 'Photographer' &&
            <ProfilePicture/>
          }
        </Grid.MainColumn>
        <Grid.RightAside>
          <ContactInformation/>
          {!accountEdit && <Region
            options={props.regions.map(region => ({
              label: region.label,
              value: region.id
            }))}
          />
          }
          {!accountEdit && <InternalNote />}
        </Grid.RightAside>
        <Grid.Footer />
      </WrapperComponent>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

const ProfileInitialValues: ProcessorProfileValues = {
  activatable: false,
  city: '',
  country: 'US',
  enableServiceDone: false,
  phone: '',
  regionId: unsetNumberId,
  schedulable: false,
  state: 'AL',
  street: '',
  user: {
    email: '',
    firstName: '',
    lastName: ''
  },
  website: '',
  zip: ''
}

const ProcessorProfileInitialValues = ProfileInitialValues

const PhotographerProfileInitialValues = {
  ...ProfileInitialValues,
  thumb: ''
}

export const ProcessorFormikForm = withFormik<ProcessorProps, ProcessorProfileValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: ({ initialData, regions }) => ({
    ...ProcessorProfileInitialValues,
    regionId: regions && regions && regions[0] && regions[0].id,
    ...initialData
  }),
  validateOnChange: false,
  validationSchema: ProfileValidationSchema
})(ProcessorForm)

export const PhotographerFormikForm = withFormik<PhotographerProps, PhotographerProfileValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: ({ initialData, regions }) => ({
    ...PhotographerProfileInitialValues,
    regionId: regions && regions && regions[0] && regions[0].id,
    ...initialData
  }),
  validateOnChange: false,
  validationSchema: ProfileValidationSchema
})(PhotographerForm)
