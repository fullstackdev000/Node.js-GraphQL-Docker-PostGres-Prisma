import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import Button from '../../../common/buttons/basicButton'
import InputField from '../../../common/formikFields/inputField'
import RadioField from '../../../common/formikFields/radioInputField'
import { Label } from '../../../common/formikFields/styled'
import * as Grid from '../../../common/grid'
import { NavHashLink } from '../../../common/hashLink'
import Panel from '../../../common/panel'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import { AppearanceHolder } from '../styled'
import { OrderDocumentDetails } from '../types'

interface CustomProps {
  data: OrderDocumentDetails
  onSubmit: (values: OrderDocumentDetails) => void
}

export type FormValues = OrderDocumentDetails

type DocumentEditFormViewProps = FormikProps<FormValues> & CustomProps

class DocumentEditFormView extends React.Component<DocumentEditFormViewProps, {}> {
  render () {
    return (
      <>
        <Grid.Wrapper as={Form} >
          <Grid.Heading>
           <h1>Edit Document</h1>
          </Grid.Heading>
          <Grid.LeftDesktopAside>
            <SecondaryNavigation>
              <li><NavHashLink to='#details'>Document Details</NavHashLink></li>
            </SecondaryNavigation>
          </Grid.LeftDesktopAside>
          <Grid.MainColumn>
            <Panel id='details' heading='Document Details'>
              <Field name={nameof<FormValues>('label')} component={InputField} label='Label' />
              <AppearanceHolder>
                <Label>Appearance on tours</Label>
                <Field
                  name={nameof<FormValues>('appearance')}
                  value='Always'
                  component={RadioField}
                  label='Show Always'
                  size='s'
                />
                <Field
                  name={nameof<FormValues>('appearance')}
                  value='Branded'
                  component={RadioField}
                  label='Only Branded'
                  size='s'
                />
                <Field
                  name={nameof<FormValues>('appearance')}
                  value='Unbranded'
                  component={RadioField}
                  label='Only Unbranded'
                  size='s'
                />
                <Field
                  name={nameof<FormValues>('appearance')}
                  value='Hide'
                  component={RadioField}
                  label='Hide'
                  size='s'
                />
              </AppearanceHolder>
              <Button buttonTheme='primary' label='Preview Document' href={this.props.values.downloadUrl} />
            </Panel>
          </Grid.MainColumn>
          <Grid.Footer />
        </Grid.Wrapper>
      </>
    )
  }
}

const DocumentEditForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => props.data
})(DocumentEditFormView)

export default DocumentEditForm
