import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import PhoneField from '#veewme/web/common/formikFields/phoneField'
import { StyledFieldsGrid } from '#veewme/web/common/formPanels/styles'
import Panel from '#veewme/web/common/panel'
import { Field } from 'formik'
import * as React from 'react'
import { AffiliateContactInfoValues, EditAffiliateValues, UserValues } from '../../components/affiliates/editAffiliate/types'

const Contact: React.FunctionComponent<{}> = () => (
  <Panel
    heading='Contact'
    id='contact'
    toggleable
  >
    <StyledFieldsGrid>
      <Field
        name={`${nameof<EditAffiliateValues>('user')}.${nameof<UserValues>('firstName')}`}
        label='First name:'
        component={InputField}
      />
      <Field
        name={`${nameof<EditAffiliateValues>('user')}.${nameof<UserValues>('lastName')}`}
        label='Last name:'
        component={InputField}
      />
      <Field
        name={nameof<AffiliateContactInfoValues>('phone')}
        label='Phone number:'
        component={PhoneField}
      />
      <Field
        name={`${nameof<EditAffiliateValues>('user')}.${nameof<UserValues>('email')}`}
        label='Email:'
        component={InputField}
      />
    </StyledFieldsGrid>
  </Panel>
)

export default Contact
