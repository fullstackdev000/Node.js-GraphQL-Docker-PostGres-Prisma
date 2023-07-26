import { nameof } from '#veewme/lib/util'
import RadioField from '#veewme/web/common/formikFields/radioInputField'
import { Field } from 'formik'
import * as React from 'react'
import { InlineFields } from '../../common/styled'
import { getServiceTypeLabel } from '../../common/util'
import { FormValues } from '../types'

const ServiceType: React.FunctionComponent = () => {
  return (
    <InlineFields>
      <Field name={nameof<FormValues>('serviceType')} labelPosition='bottom' value={'Primary'} component={RadioField} label={getServiceTypeLabel('Primary')} />
      <Field name={nameof<FormValues>('serviceType')} labelPosition='bottom' value={'AddOn'} component={RadioField} label={getServiceTypeLabel('AddOn')} />
      <Field name={nameof<FormValues>('serviceType')} labelPosition='bottom' value={'Admin'} component={RadioField} label={getServiceTypeLabel('Admin')} />
    </InlineFields>
  )
}

export default ServiceType
