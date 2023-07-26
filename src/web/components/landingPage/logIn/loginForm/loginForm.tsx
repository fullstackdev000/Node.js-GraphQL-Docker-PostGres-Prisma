import { LogInMutationVariables } from '#veewme/gen/graphqlTypes'
import { publicUrls } from '#veewme/lib/urls'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import Input from '#veewme/web/common/formikFields/inputField'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { ForgotLink, FormHeader, FormWrapper, PageWrapper } from './styled'

interface LoginFormCustomProps {
  onSubmit: (values: LogInMutationVariables) => void
}

type LoginFormValues = LogInMutationVariables
type LoginFormViewProps = FormikProps<LoginFormValues> & LoginFormCustomProps

const LoginFormView: React.FunctionComponent<LoginFormViewProps> = () => {
  return (
    <PageWrapper as={Form}>
      <FormHeader>
        Log In
      </FormHeader>
      <FormWrapper>
        <Field
          label='User name (e-mail)'
          component={Input}
          name={`${nameof<LogInMutationVariables>('email')}`}
          type='text'
        />
        <Field
          label='Password'
          component={Input}
          name={`${nameof<LogInMutationVariables>('password')}`}
          type='password'
        />
        <ForgotLink to={publicUrls.reset}>
          Forgot your Password or User Name? Don't fret, just reset.
          Reset your password here.
        </ForgotLink>
        <Button type='submit' label='Log In' buttonTheme='info' full size='big' />
      </FormWrapper>
    </PageWrapper>
  )
}

export const FormSchema = Yup.object().shape<LoginFormValues>({
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string()
    .required()
})

const LoginForm = withFormik<LoginFormCustomProps, LoginFormValues>({
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    email: '',
    password: ''
  }),
  validationSchema: FormSchema

})(LoginFormView)

export default LoginForm
