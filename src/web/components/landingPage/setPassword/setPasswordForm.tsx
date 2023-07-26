import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import Input from '#veewme/web/common/formikFields/inputField'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { FormHeader, FormWrapper, PageWrapper } from '../logIn/loginForm/styled'

interface SetPasswordFormCustomProps {
  onSubmit: (values: SetPasswordFormValues) => void
}

interface SetPasswordFormValues {
  user: {
    password: string
  },
  passwordConfirm: string
}

type SetPasswordFormViewProps = FormikProps<SetPasswordFormValues> & SetPasswordFormCustomProps

const SetPasswordFormView: React.FunctionComponent<SetPasswordFormViewProps> = () => {
  return (
    <PageWrapper as={Form}>
      <FormHeader>
        Set New Password
      </FormHeader>
      <FormWrapper>
        <Field
          label='Password'
          component={Input}
          name={`${nameof<SetPasswordFormValues>('user')}.${nameof<SetPasswordFormValues['user']>('password')}`}
          type='password'
        />
        <Field
          label='Confirm Password'
          component={Input}
          name={`${nameof<SetPasswordFormValues>('passwordConfirm')}`}
          type='password'
        />
        <Button type='submit' label='Submit' buttonTheme='info' full size='big' />
      </FormWrapper>
    </PageWrapper>
  )
}

export const FormSchema = Yup.object().shape<SetPasswordFormValues>({
  passwordConfirm: Yup.string().min(6, 'Password must be at least 6 characters').required().passwordConfirm(),
  user: Yup.object().shape({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required()
  })
})

const SetPasswordForm = withFormik<SetPasswordFormCustomProps, SetPasswordFormValues>({
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    passwordConfirm: '',
    user: {
      password: ''
    }
  }),
  validationSchema: FormSchema
})(SetPasswordFormView)

export default SetPasswordForm
