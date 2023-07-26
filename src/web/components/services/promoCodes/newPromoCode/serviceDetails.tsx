import { Service } from '#veewme/graphql/types'
import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import FormikTextarea from '#veewme/web/common/formikFields/textareaField'
import Panel from '#veewme/web/common/panel'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from './form'
import { StyledGreenBold, StyledNoteWrapper } from './styled'

// Mock select options
const ServiceOptions = (services: Array<Pick<Service, 'id' | 'name'>>) => (
  services.map(service => ({
    label: service.name,
    value: service.id
  }))
)

// TODO: validate name length also on backend
export const serviceNameMaxLength = 13

interface DetailsProps {
  values: FormValues
  services: Array<Pick<Service, 'id' | 'name'>> // TODO fetch required Services here
}

const ServiceDetails: React.FunctionComponent<DetailsProps> = props => {
  const { services } = props
  return (
    <Panel heading='Service Details' id='service' toggleable>
      <Field
        name={nameof<FormValues>('serviceId')}
        component={SelectField}
        options={ServiceOptions(services)}
        label='Select Service:'
        placeholder='Service'
        compactMode
      />
      <StyledNoteWrapper>
        <p><StyledGreenBold>Note!</StyledGreenBold> If you don't select a service, promocode will be applied to whole order</p>
      </StyledNoteWrapper>
      <Field
        name={nameof<FormValues>('code')}
        component={InputField}
        label='Promo Code:'
        compactMode
      />
      <StyledNoteWrapper>
        <p><StyledGreenBold>Note!</StyledGreenBold> This is the code that agents will need to write during service purchase. Please note the codes are NOT case-sensitive. Codes 'promo' and 'PROMO' are treated exactly the same.</p>
      </StyledNoteWrapper>
      <Field
        label='Description:'
        name={nameof<FormValues>('description')}
        component={FormikTextarea}
      />
    </Panel>
  )
}

export default ServiceDetails
