import { CreateAffiliateComponent } from '#veewme/gen/graphqlTypes'
import { templateOptions } from '#veewme/web/common/consts'
import { AffiliateSignupValues, SurveyFields } from '#veewme/web/common/formPanels/valuesInterfaces'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import Button from '../../../common/buttons/basicButton'
import {
  BasicInformation,
  CompanyInformation,
  ContactInformation,
  PersonalInformation,
  RightColumnContent
} from './formElements'
import { AccountForm, FormLeftColumn } from './styled'

import * as Yup from 'yup'

type AffiliateSignupValidation = Omit<AffiliateSignupValues, 'state' | 'survey'> & {
  survey: {
    heardAboutUsFrom: SurveyFields['heardAboutUsFrom']
  },
  state: string
}

const AffiliateValidationSchema = Yup.object().shape<Partial<AffiliateSignupValidation>>({
  city: Yup.string().required(),
  passwordConfirm: Yup.string().min(6, 'Password must be at least 6 characters').required().passwordConfirm(),
  phone: Yup.string().phone().required(),
  state: Yup.string().required(),
  survey: Yup.object().shape({
    heardAboutUsFrom:  Yup.string().required()
  }),
  user: Yup.object().shape({
    email: Yup.string().email().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required()
  }),
  website: Yup.string().required(),
  zip: Yup.string().required()
})

// type AffiliateSignupFinalValues = Omit<AffiliateSignupValues, 'passwordConfirm'>
interface AffiliateFormCustomProps {
  onSubmit: (values: AffiliateSignupValues) => void
}

type AffiliateFormProps = FormikProps<AffiliateSignupValues> & AffiliateFormCustomProps

const AffiliateForm: React.FunctionComponent<AffiliateFormProps> = props => {
  return (
    <AccountForm>
      <FormLeftColumn>
        <BasicInformation />
        <PersonalInformation />
        <CompanyInformation />
        <ContactInformation />
        <Button type='submit' label='Sign Up' buttonTheme='info' full size='big' />
      </FormLeftColumn>
      <RightColumnContent />
    </AccountForm>
  )
}

const AffiliateFormEnhanced = withFormik<AffiliateFormCustomProps, AffiliateSignupValues>({
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    city: '',
    companyName: '',
    country: 'US',
    passwordConfirm: '',
    phone: '',
    // Ugly hack
    // TODO: correct solution for required 'select' values that use specific type (other than primitives like string etc)
    // but don't have initial value. Such values can't be typed as optional but in such case initial value have to be provided..
    state: '' as AffiliateSignupValues['state'],
    street: '',
    templateId: templateOptions[0].value,
    user: {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    },
    zip: ''
  }),
  validateOnChange: false,
  validationSchema: AffiliateValidationSchema
})(AffiliateForm)

const AffiliateFormContainer: React.FunctionComponent = props => {
  const { addToast } = useToasts()
  return (
    <CreateAffiliateComponent
      onCompleted={data => {
        addToast(
          `Account creation form for affiliate ${data.createAffiliate.companyName} and user name ${data.createAffiliate.user.email} was sent successfully.`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }}
      onError={error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
      }}
    >
      {(submit, { loading }) => {
        return (
          <>
            <DotSpinnerModal isOpen={loading} />
            <AffiliateFormEnhanced
              onSubmit={(values: AffiliateSignupValues) => {
                submit({
                  variables: {
                    ...values,
                    ...values.survey
                  }
                }).catch(() => { return })
              }}
            />
          </>
        )
      }}
    </CreateAffiliateComponent>
  )
}

export default AffiliateFormContainer
