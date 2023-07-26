import { nameof } from '#veewme/lib/util'
import PhoneField from '#veewme/web/common/formikFields/phoneField'
import { Field } from 'formik'
import * as React from 'react'
import InputField from '../../../common/formikFields/inputField'
import Panel from '../../../common/panel'
import styled from '../../../common/styled-components'
import { ProfileValues } from './profileForm'

const CustomizedPanel = styled(Panel)`
  input {width: 100%;}
`

const ContactInformation: React.FunctionComponent<{}> = () => {
  return (
    <CustomizedPanel heading='Contact Information' toggleable>
      <Field name={nameof<ProfileValues>('phone')} component={PhoneField} label='Phone:' />
      <Field type='email' name={`${nameof<ProfileValues>('user')}.${nameof<ProfileValues['user']>('email')}`} component={InputField} label='Email:' />
      <Field type='url' name={nameof<ProfileValues>('website')} component={InputField} label='Website:' />
    </CustomizedPanel>
  )
}

export default ContactInformation
