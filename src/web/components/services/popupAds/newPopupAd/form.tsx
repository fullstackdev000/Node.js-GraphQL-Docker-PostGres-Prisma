import * as Grid from '#veewme/web/common/grid'
import * as log from '#veewme/web/common/log'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { StyledFormWrapper, StyledGridWrapper } from '../../common/styled'
import Details from './details'

interface CustomProps {
}

export interface FormValues {
  actionButtonNote?: string
  description: string
  footNote: string
  imageUrl: string
  region?: string
  headline: string
}

type NewPopupAdFormProps = FormikProps<FormValues> & CustomProps

class NewPopupAdForm extends React.Component<NewPopupAdFormProps, {}> {
  render () {
    const { values } = this.props
    return (
      <StyledFormWrapper>
        <StyledGridWrapper as={Form} >
          <Grid.Heading>
            <h1>Add New Popup</h1>
          </Grid.Heading>
          <Grid.MainColumn>
            <Details
              values={values}
            />
          </Grid.MainColumn>
          <Grid.Footer />
        </StyledGridWrapper>
      </StyledFormWrapper>
    )
  }
}

export default withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting }) => {
    log.debug('submitting: ', values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    description: '',
    footNote: '',
    headline: '',
    imageUrl: ''
  })
})(NewPopupAdForm)
