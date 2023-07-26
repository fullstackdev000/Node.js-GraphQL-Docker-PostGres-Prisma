import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import * as Grid from '#veewme/web/common/grid'
import styled from '#veewme/web/common/styled-components'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { RGBColor } from 'react-color'
import BannerDetails from './bannerDetails'

export const StyledFormWrapper = styled.div`
  input {
    max-width: 100%;

    &[type='number'] {
      -moz-appearance:textfield;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
  }
`

export const StyledGridWrapper = styled(Grid.Wrapper) `
  padding:0 0 60px;
  &:before {
    width: 100%;
    left: 0;
  }
`

interface CustomProps {
  heading: string
  initialValues: FormValues
  onSubmit: (options: FormValues) => void
}

export interface FormValues {
  label: string
  color: RGBColor
  blackText?: boolean
}

type TourBannerFormProps = FormikProps<FormValues> & CustomProps

const TourBannerForm: React.FunctionComponent<TourBannerFormProps> = props => {
  const { touched, values } = props
  return (
    <StyledFormWrapper>
      <NavigationWarning touched={touched} />
      <StyledGridWrapper as={Form} >
        <Grid.Heading>
          <h1>{props.heading}</h1>
        </Grid.Heading>
        <Grid.MainColumn>
          <BannerDetails
            values={values}
          />
        </Grid.MainColumn>
        <Grid.Footer />
      </StyledGridWrapper>
    </StyledFormWrapper>
  )
}

export default withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => (props.initialValues)
})(TourBannerForm)
