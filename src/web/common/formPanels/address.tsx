import { Role } from '#veewme/gen/graphqlTypes'
import { Countries, States } from '#veewme/lib/constants'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import { Label } from '#veewme/web/common/formikFields/styled'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import PaymentPanel, { generateNextPaymentMethod } from './payment'
import { NewClientValues, PaymentMethod, PaymentMethodValues } from './valuesInterfaces'

const AddressControls = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  input {width: 100%;}
`

const PaymentMethods = styled.div`
  margin-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.BORDER};
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0;
    label {width: auto}
  }
`

interface AddressProps {
  role?: Role
}

class Address extends React.PureComponent<AddressProps> {
  render () {
    const allowAddingPaymentMethods = this.props.role === 'AFFILIATE'
    return (
      <Panel
        heading='Address'
        id='address'
        toggleable
      >
        <AddressControls>
          <Field
            label='Street:'
            component={InputField}
            name={nameof<NewClientValues>('street')}
          />
          <Field
            label='City:'
            component={InputField}
            name={nameof<NewClientValues>('city')}
          />
          <Field
            name={nameof<NewClientValues>('state')}
            label='State:'
            component={SelectField}
            options={States}
            isSearchable
          />
          <Field
            label='Zip/Postal Code:'
            component={InputField}
            name={nameof<NewClientValues>('zip')}
          />
          <Field
            name={nameof<NewClientValues>('country')}
            label='Country:'
            component={SelectField}
            options={Countries}
            isSearchable
          />
        </AddressControls>
        {allowAddingPaymentMethods && <FieldArray
          name={nameof<PaymentMethodValues>('paymentMethods')}
          render={paymentMethodsHelpers => {
            const { paymentMethods } = paymentMethodsHelpers.form.values
            return (
              <PaymentMethods>
                <header>
                  <Label>Payment methods</Label>
                  <Button
                    type='button'
                    // TODO add payment method, waiting for credit card library / method being ready
                    onClick={() => paymentMethodsHelpers.push(generateNextPaymentMethod())}
                    buttonTheme='action'
                    label='Add payment method'
                  />
                </header>
                    {paymentMethods && paymentMethods.map((paymentMethod: PaymentMethod, index: number) => (
                      <PaymentPanel {...paymentMethod} onClick={() => { paymentMethodsHelpers.remove(index) }} key={index} />
                    ))}
              </PaymentMethods>
            )
          }}
        />}
      </Panel>
    )
  }
}

export default Address
