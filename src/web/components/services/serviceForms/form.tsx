import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import TextareaField from '#veewme/web/common/formikFields/textareaField'
import ImageField from '#veewme/web/common/formikFields/uploadImageField'
import * as Grid from '#veewme/web/common/grid'
import { NavHashLink } from '#veewme/web/common/hashLink'
import Panel from '#veewme/web/common/panel'
import SecondaryNavigation from '#veewme/web/common/secondaryNavigation'
import styled from '#veewme/web/common/styled-components'
import { EditorState } from 'draft-js'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { StyledFormWrapper, StyledGridWrapper, TextInlineFieldsFull } from '../common/styled'
import Details from './formPanels/details'
import Duration from './formPanels/duration'
import Notifications from './formPanels/notifications'
import PackageServices from './formPanels/packageServices'
import Price from './formPanels/price'
import Regions from './formPanels/regions'
import ServiceType from './formPanels/serviceType'
import Settings from './formPanels/settings'
import Source, { DuplicateOptions, DuplicateOptionValue } from './formPanels/source'
import { FormValues, FrontendServiceFeeAdjustedByRegion, ServiceFormOptions } from './types'

const RightColPanel = styled(Panel)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    max-width: 330px;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    max-width: unset;
  }
`

export const convertToRegionFeesAdjusted: (
  regions: Array<{ id: number, label: string }>,
  regionFeesAdjusted?: FrontendServiceFeeAdjustedByRegion[]
) => FrontendServiceFeeAdjustedByRegion[] = (regions, regionFeesAdjusted = []) => {
  return regions.map(region => {
    return regionFeesAdjusted.find(fee => fee.regionId === region.id) || {
      regionId: region.id
    }
  })
}

interface CustomProps {
  onSubmit: (values: FormValues) => void
  formOptions: ServiceFormOptions
  initialData?: Partial<FormValues>
  serviceOptions?: DuplicateOptions
  getDuplicate?: (val: DuplicateOptionValue) => void
  isPackage?: boolean
  edit?: boolean
}

type NewServiceFormViewProps = FormikProps<FormValues> & CustomProps

// TODO: This form requires serious refactoring!
// Instead of one generic form there should be two separate forms for Package and Service
// Unfortunately there is a lot of common types used and refactoring would take some time..
// (there used to be single view for both service and package and this single form is legacy of it)

const NewServiceFormView: React.FunctionComponent<NewServiceFormViewProps> = props => {
  const { formOptions, values, touched } = props
  const isPackage = !!props.isPackage
  const operationLabel = props.edit ? 'Edit' : 'New'
  return (
    <>
      <StyledFormWrapper>
        <StyledGridWrapper as={Form} >
          <Grid.Heading>
            <h1>{`${operationLabel}`} {isPackage ? `Package` : 'Service'}</h1>
          </Grid.Heading>
          <Grid.LeftDesktopAside>
            <SecondaryNavigation>
              <li><NavHashLink to='#details'>Details</NavHashLink></li>
              <li><NavHashLink to='#regions'>Regions</NavHashLink></li>
              <li><NavHashLink to='#settings'>Settings</NavHashLink></li>
              <li><NavHashLink to='#notifications'>Notifications</NavHashLink></li>
            </SecondaryNavigation>
          </Grid.LeftDesktopAside>
          <Grid.MainColumn>
            <Panel id='details' heading='Details'>
              {props.serviceOptions && <Source serviceOptions={props.serviceOptions} getDuplicate={props.getDuplicate} />}
              {!isPackage && <ServiceType />}
              <Details isPackage={isPackage} formOptions={formOptions} isAdmin={values.serviceType === 'Admin'}/>
              {isPackage && <PackageServices values={values} services={formOptions && formOptions.services || []} />}
              <Price isPackage={isPackage} />
              <Duration isPackage={isPackage} />
              {!isPackage && (
                <TextInlineFieldsFull>
                  <Field name={nameof<FormValues>('link')} component={InputField} label='Sample Link' />
                </TextInlineFieldsFull>
              )}
            </Panel>
            <Regions isPackage={isPackage} regions={formOptions.regions} />
            <Settings<FormValues> processors={formOptions.processors} isPackage={isPackage} />
            <Notifications />
          </Grid.MainColumn>
          <Grid.RightAside>
            {!isPackage && (
              <RightColPanel id='image' heading='Service Image'>
                <Field
                  name={nameof<FormValues>('serviceImage')}
                  component={ImageField}
                  imageFullDimensions={{
                    height: 184,
                    width: 300
                  }}
                />
              </RightColPanel>
            )}
             {!isPackage && (
              <RightColPanel id='note' heading='Dismissable Note'>
                <Field
                  name={nameof<FormValues>('note')}
                  placeholder='Write here...'
                  component={TextareaField}
                  label='Will appear when content present if selected on order'
                />
              </RightColPanel>
             )}
          </Grid.RightAside>
          <Grid.Footer />
        </StyledGridWrapper>
      </StyledFormWrapper>
      <NavigationWarning touched={touched} />
    </>
  )
}

const NewServiceForm = withFormik<CustomProps, FormValues>({
  enableReinitialize: true,
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => {
    const initialValues: FormValues = {
      assignable: false,
      categoryId: props.formOptions.serviceCategories[0].id,
      defaultCompensation: 0,
      duration: 0,
      durationUnit: 'Minute',
      link: '',
      longDescription: EditorState.createEmpty(),
      mediaOnly: false,
      name: '',
      note: '',
      orderNotifyEmails: '', // TODO change to array when MultipleValueInputField is ready
      price: 0,
      regionFeesAdjusted: convertToRegionFeesAdjusted(props.formOptions.regions),
      serviceIds: [],
      serviceType: props.isPackage ? 'Package' : 'Primary',
      shortDescription: '',
      tourNotifyEmails: '' // TODO change to array when MultipleValueInputField is ready
    }

    if (props.isPackage) {
      delete initialValues.id
      delete initialValues.categoryId
      delete initialValues.defaultCompensation
      delete initialValues.link
      delete initialValues.serviceImage
      delete initialValues.shortDescription
    } else {
      delete initialValues.serviceIds
    }
    return { ...initialValues, ...props.initialData }
  }
})(NewServiceFormView)

export default NewServiceForm
