import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import Input from '#veewme/web/common/formikFields/inputField'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { FormHeader, FormWrapper, HeadingP, PageWrapper } from '../logIn/loginForm/styled'

interface ResetFormCustomProps {
  onSubmit: (values: ResetFormValues) => void
}

interface ResetFormValues {
  userName: string
}

type ResetFormViewProps = FormikProps<ResetFormValues> & ResetFormCustomProps

const ResetFormView: React.FunctionComponent<ResetFormViewProps> = () => {
  return (
    <PageWrapper as={Form}>
      <FormHeader>
        Reset Password
      </FormHeader>
      <HeadingP>
        Type in your username and click submit.
        You will then receive a password reset link to your inbox and change password quickly!
      </HeadingP>
      <FormWrapper>
        <Field
          label='User name (e-mail)'
          component={Input}
          name={`${nameof<ResetFormValues>('userName')}`}
          type='text'
        />
        <Button type='submit' label='Reset' buttonTheme='info' full size='big' />
      </FormWrapper>
    </PageWrapper>
  )
}

export const FormSchema = Yup.object().shape<ResetFormValues>({
  userName: Yup.string()
    .email()
    .required()
})

const ResetForm = withFormik<ResetFormCustomProps, ResetFormValues>({
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    userName: ''
  }),
  validationSchema: FormSchema
})(ResetFormView)

export default ResetForm
