import { DiscountType, PromoCodeValidity } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import DateField from '#veewme/web/common/formikFields/dateFields/dateSelectField'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from './form'
import { StyledGreenBold, StyledNoteWrapper } from './styled'

const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`

interface ValidityOption {
  label: string
  value: string
}

const getValidityOptions = () => {
  const options: ValidityOption[] = []
  for (const key in PromoCodeValidity) {
    if (PromoCodeValidity[key]) {
      options.push({
        label: PromoCodeValidity[key],
        value: key
      })
    }
  }
  return options
}

interface DiscountOptionsType {
  label: string
  value: DiscountType
}

const DiscountOptions: DiscountOptionsType[] = [
  {
    label: 'Percentage %',
    value: 'percent'
  },
  {
    label: 'Amount',
    value: 'amount'
  }
]

interface DiscountDetailsProps {
  values: FormValues
}

const DiscountDetails: React.FunctionComponent<DiscountDetailsProps> = props => {
  return (
    <Panel heading='Discount Details' id='discount' toggleable>
      <StyledGrid>
        <Field
          name={nameof<FormValues>('serviceId')}
          component={SelectField}
          options={DiscountOptions}
          label='Discount Type:'
          placeholder='Discount type'
        />
        <Field
          name={nameof<FormValues>('discount')}
          component={InputField}
          label='Discount:'
          type='number'
        />
        <div>
          <Field
            name={nameof<FormValues>('expireDate')}
            component={DateField}
            label='Expiration date:'
          />
          <StyledNoteWrapper>
            <p><StyledGreenBold>Note!</StyledGreenBold> Leave this field empty to have no expiration date on this code.</p>
          </StyledNoteWrapper>
        </div>
        <Field
          name={nameof<FormValues>('validity')}
          component={SelectField}
          options={getValidityOptions()}
          label='Validity:'
          placeholder='Validity'
        />
      </StyledGrid>
    </Panel>
  )
}

export default DiscountDetails
