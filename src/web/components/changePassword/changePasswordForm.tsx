import { nameof } from '#veewme/lib/util'
import Input from '#veewme/web/common/formikFields/inputField'
import * as Grid from '#veewme/web/common/grid'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'

interface ChangePasswordFormCustomProps {
  onSubmit: (values: ChangePasswordFormValues) => void
}

interface ChangePasswordFormValues {
  oldPassword: string
  user: {
    password: string
  },
  passwordConfirm: string
}

type ChangePasswordFormViewProps = FormikProps<ChangePasswordFormValues> & ChangePasswordFormCustomProps

const ChangePasswordFormView: React.FunctionComponent<ChangePasswordFormViewProps> = () => {
  return (
    <Grid.Wrapper as={Form} >
      <Grid.Heading hideButtons>
        <h1>Change password</h1>
      </Grid.Heading>
      <Grid.MainColumn>
        <Field
          label='Password'
          component={Input}
          name={`${nameof<ChangePasswordFormValues>('oldPassword')}`}
          type='password'
        />
        <Field
          label='New Password'
          component={Input}
          name={`${nameof<ChangePasswordFormValues>('user')}.${nameof<ChangePasswordFormValues['user']>('password')}`}
          type='password'
        />
        <Field
          label='Confirm New Password'
          component={Input}
          name={`${nameof<ChangePasswordFormValues>('passwordConfirm')}`}
          type='password'
        />
        <Grid.Footer />
      </Grid.MainColumn>
    </Grid.Wrapper>
  )
}

export const FormSchema = Yup.object().shape<ChangePasswordFormValues>({
  oldPassword: Yup.string().required(),
  passwordConfirm: Yup.string().min(6, 'Password must be at least 6 characters').required().passwordConfirm(),
  user: Yup.object().shape({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required()
  })
})

const ChangePasswordForm = withFormik<ChangePasswordFormCustomProps, ChangePasswordFormValues>({
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    oldPassword: '',
    passwordConfirm: '',
    user: {
      password: ''
    }
  }),
  validationSchema: FormSchema
})(ChangePasswordFormView)

export default ChangePasswordForm
