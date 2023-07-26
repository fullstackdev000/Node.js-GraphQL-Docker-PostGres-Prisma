import { BrokerSignupValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as log from '#veewme/web/common/log'
import { FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Button from '../../../common/buttons/basicButton'
import {
  BasicInformation,
  CompanyInformation,
  ContactInformation,
  RightColumnContent
} from './formElements'
import { AccountForm, FormLeftColumn } from './styled'

type BrokerAccountProps = FormikProps<BrokerSignupValues>

const BrokerAccountForm: React.FunctionComponent<BrokerAccountProps> = props => {
  return (
    <AccountForm>
      <FormLeftColumn>
        <BasicInformation />
        <CompanyInformation />
        <ContactInformation />
        <Button type='submit' label='Sign Up' buttonTheme='info' full size='big' />
      </FormLeftColumn>
      <RightColumnContent />
    </AccountForm>
  )
}

export default withFormik<{}, BrokerSignupValues>({
  handleSubmit: (values, { setSubmitting }) => {
    log.debug(values)
    setSubmitting(false)
  }
})(BrokerAccountForm)
