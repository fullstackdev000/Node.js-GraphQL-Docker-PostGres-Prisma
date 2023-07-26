import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import TexareaField from '#veewme/web/common/formikFields/textareaField'
import withErrors, { FormPropsWithErrors } from '#veewme/web/common/formikFields/withErrors'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikErrors, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import * as Yup from 'yup'

const RegionOptions = [{
  label: 'Region #1',
  value: 'North'
}, {
  label: 'Region #2',
  value: 'South'
}, {
  label: 'Region #3',
  value: 'East'
}, {
  label: 'Region #4',
  value: 'West'
}]

const Wrapper = styled.div`
  margin: 30px;
  min-width: 500px;
`

const Buttons = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
`

const FieldsHolder = styled.div`
  margin: 15px 0;;
`

const Alert = styled.div`
  max-width: 100%;
  color: ${props => props.theme.colors.ALERT};
  font-size: 14px;
  margin: 10px 0;
  height: 18px;
`

const StyledP = styled.p`
  margin-top: 20px;
  font-size: 14px;
  line-height: 21px;
`

// Example validation Schema that can be reused on frontend and backend
const FormSchema = Yup.object().shape<FormValues>({
  email: Yup.string()
    .email()
    .required(),
  name: Yup.string()
    .required(),
  note: Yup.string()
    .required(),
  processing: Yup.boolean()
    .required()
    .oneOf([true]),
  region: Yup.string()
    .required(),
  terms: Yup.boolean()
    .required()
    .oneOf([true])
})

// Example of calling validation programatically (e.g. on backend)
FormSchema.validate({
  email: '',
  name: '',
  note: '',
  processing: false,
  region: '',
  terms: false
}, {
  abortEarly: false
}).catch(err => {
  log.debug(err.inner)
})

export interface FormValues {
  name: string
  email: string
  note: string
  region: string
  terms: boolean
  processing: boolean
}

interface CustomProps {
  onSubmit: (values: FormValues) => void
}

type FormViewProps = FormikProps<FormValues> & CustomProps

class FormView extends React.Component<FormViewProps, {}> {
  render () {
    const { isValid, submitCount } = this.props
    const showErrorAlert = !isValid && !!submitCount

    return (
      <Form>
        <Panel heading='Example'>
          <FieldsHolder>
            <Field
              name={nameof<FormValues>('name')}
              component={InputField}
              autoComplete='off'
              label='First name'
              required
            />
            <Field
              name={nameof<FormValues>('region')}
              placeholder='Region'
              component={SelectField}
              options={RegionOptions}
              label='Region'
              required
            />
            <Field
              name={nameof<FormValues>('email')}
              component={InputField}
              autoComplete='off'
              label='E-mail address'
              required
            />
            <Field
              name={nameof<FormValues>('note')}
              component={TexareaField}
              label='Note'
              required
            />
            <Field
              name={`${nameof<FormValues>('terms')}`}
              label='Accept terms and conditions'
              component={CheckboxField}
              compactMode={false}
            />
            <Field
              name={`${nameof<FormValues>('processing')}`}
              label='Processing'
              component={SwitchField}
              compactMode={false}
            />
          </FieldsHolder>
          <Buttons>
            <Button type='reset' buttonTheme='action' label='Reset'/>
            <Button type='submit' full buttonTheme='action' label='Submit'/>
          </Buttons>
          <Alert>{showErrorAlert && 'There are some errors. Pleae fix them.'}</Alert>
          <StyledP>
            Validation errors can be also defined outside form component and passed to it as prop.<br/>
            This is especially useful for displaying errors coming from server side validation.<br/>
            To see it in action make sure the above form is valid and email is set to "<strong>test@test.com</strong>" and click 'Submit' button. You will see
            custom error saying that email is not unique.
          </StyledP>
        </Panel>
      </Form>
    )
  }
}

const initialData: FormValues = {
  email: '',
  name: '',
  note: '',
  processing: false,
  region: '',
  terms: false
}

const FormExample = withFormik<FormPropsWithErrors<CustomProps, FormValues>, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    ...initialData
  }),
  validateOnChange: false,
  validationSchema: FormSchema
})(withErrors(FormView))

export default () => {
  const { addToast } = useToasts()
  const [ errors, setErrors ] = React.useState<FormikErrors<FormValues>>({})

  return (
    <Wrapper>
      <FormExample
        customErrors={errors}
        onSubmit={values => {
          log.debug(values)
          // Submit handler just for demo purpose.
          // Normally such erros will be returned by server and handled outside submit handler.
          // Important: No validation logic should be in submit handler.
          if (values.email === 'test@test.com') {
            const ErrorMsg = (
              <div>
                There are some errors:<br />
                Email {values.email} already exists.
              </div>
            )
            addToast(ErrorMsg, { appearance: 'error' })
            setErrors({
              email: 'Email is not unique'
            })
          } else {
            addToast(`Congratulations. You've submitted valid form.`, { appearance: 'success', autoDismiss: true })
          }
        }}
      />
    </Wrapper>
  )
}
