import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import RadioField from '#veewme/web/common/formikFields/radioInputField'
import { Label } from '#veewme/web/common/formikFields/styled'
import PaymentPanel, { generateNextPaymentMethod } from '#veewme/web/common/formPanels/payment'
import { PaymentMethod } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { BillingValues } from '../../components/affiliates/editAffiliate/types'
import { StyledNote, StyledNoteHighlight, StyledSection } from './styles'

const note = 'Contact Ogle Media for longer than daily billing terms. Dependent from volume/credit history.'

const StyledHeader = styled.header `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  label {width: auto;}
`

const InlineFields = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  margin-bottom: 5px;
`

export const InlineLabel = styled.label`
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  margin: 13px 16px 13px 0;
  display: flex;
  align-items: center;
`

const Billing: React.FunctionComponent = () => (
  <Panel
    heading='Billing'
    id='address'
    toggleable
  >
    <StyledSection>
      <StyledHeader>
        <Label>Payment processing</Label>
        <Button
          type='button'
          onClick={() => log.debug('Payment processing clicked')}
          buttonTheme='action'
          label='Setup automatic payment processing'
        />
      </StyledHeader>
    </StyledSection>
    <StyledSection>
      <FieldArray
        name={nameof<BillingValues>('paymentMethods')}
        render={paymentMethodsHelpers => {
          const { paymentMethods } = paymentMethodsHelpers.form.values
          return (
            <>
              <StyledHeader>
                <Label>Payment methods</Label>
                <Button
                  type='button'
                  // TODO add payment method, waiting for credit card library / method being ready
                  onClick={() => paymentMethodsHelpers.push(generateNextPaymentMethod())}
                  buttonTheme='action'
                  label='Add payment method'
                />
              </StyledHeader>
                  {paymentMethods && paymentMethods.map((paymentMethod: PaymentMethod, index: number) => (
                    <PaymentPanel {...paymentMethod} onClick={() => { paymentMethodsHelpers.remove(index) }} key={index} />
                  ))}
            </>
          )
        }}
      />
      <InlineFields>
        <InlineLabel>Billing frequency:</InlineLabel>
        <Field name={nameof<BillingValues>('billingFrequency')} labelPosition='right' value={'DAILY'} component={RadioField} label='Daily' size='s'/>
        <Field name={nameof<BillingValues>('billingFrequency')} labelPosition='right' value={'WEEKLY'} component={RadioField} label='Weekly' size='s'/>
        <Field name={nameof<BillingValues>('billingFrequency')} labelPosition='right' value={'BIWEEKLY'} component={RadioField} label='Bi-weekly' size='s'/>
        <Field name={nameof<BillingValues>('billingFrequency')} labelPosition='right' value={'MONTHLY'} component={RadioField} label='Monthly' size='s'/>
      </InlineFields>
      <StyledNote>
        <StyledNoteHighlight>Note! </StyledNoteHighlight>
        {note}
      </StyledNote>

    </StyledSection>
  </Panel>
)

export default Billing
