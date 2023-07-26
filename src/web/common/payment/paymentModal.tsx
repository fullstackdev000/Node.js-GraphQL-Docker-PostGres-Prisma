import { nameof } from '#veewme/lib/util'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import InputField from '#veewme/web/common/formikFields/inputField'
import RadioField from '#veewme/web/common/formikFields/radioInputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js'
import { StripeElementChangeEvent } from '@stripe/stripe-js'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Button from '../../common/buttons/basicButton'

import Logo from '#veewme/web/assets/svg/logo.svg'

/* START of Form*/
/*
  Besides our custom formik fields Checkout Form also includes Stripe inputs which
  are loaded asynchronously in iframe. Because of this form is a bit 'complicated' and non-standard,
  e.g. formik built-in validation is not used.

  TODO: improve validation
*/
const STRIPE_ELEMENT_BASIC_OPTIONS = {
  placeholder: 'Card number',
  style: {
    base: {
      border: '2px solid #e2e8ef',
      color: '#000',
      fontFamily: 'Montserrat, Open Sans, Segoe UI, sans-serif',
      fontSize: '13.33px',
      fontSmoothing: 'antialiased',
      iconColor: '#c4f0ff'
    }
  }
}

const FieldsWrapper = styled.div`
  margin: 10px 0 14px;

  && + button {
    margin-top: 0;
  }
`

const RadioHolder = styled.div`
  display: flex;
  margin-bottom: 15px;

  > div {
    margin-right: 15px;
  }
`

const StyledForm = styled(Form)`
  button {
    margin-top: 15px;
    width: 100%;
  }

  .StripeElement {
    height: 32px;
    border: 2px solid ${props => props.theme.colors.BORDER};
    padding: 5px 10px;
    border-radius: 5px;
  }
`

const InlineFields = styled.div`
  display: flex;
  justify-content: space-between;

  .StripeElement {
    flex: 1 0 auto;

    &:first-child {
      margin-right: 15px;
    }
  }
`

const Loader = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 150px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const Hint = styled.div`
  padding-top: 5px;
  font-size: 13px;
  font-weight: 400;
`

const ErrorStyled = styled.div`
  color: ${props => props.theme.colors.ALERT};
  padding-top: 15px;
  font-size: 15px;
  white-space: pre-wrap;
`

const SplitAmountInput = styled(InputField)`
  width: 100px;
  margin-left: 5px;
  margin-right: 5px;
  overflow: hidden;

  & > div {
    margin-bottom: 0;
  }

  input {
    max-width: 100%;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  input:invalid {
    box-shadow: none;
  }
}
`
const SplitAmountField = styled.div<{
  hide?: boolean
}>`

  margin-top: 5px;
  font-size: 13px;
  font-weight: 500;
  height: ${props => props.hide ? '0' : '70px'};
  transition: height .5s;
  overflow: hidden;

  & > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`

const LogoContainer = styled.div`
  height: 35px;
  text-align: center;
  margin-bottom: 15px;
  margin-top: -10px;

  svg {
    height: 100%;
  }

  img {
    max-height: 100%;
  }
`

export type GenericError = string | string[]
const Error: React.FC<{
  error: GenericError
}> = ({ error }) => {
  const errorToShow = typeof error === 'string' ? [error] : error
  return (
    <ErrorStyled>
      {
        errorToShow.map((err, i) => (
          <div key={i}>{err}</div>
        ))
      }
    </ErrorStyled>
  )
}

type allowedElementType = Extract<StripeElementChangeEvent['elementType'], 'cardNumber' | 'cardExpiry' | 'cardCvc'>
type CardFieldsMap = {
  [K in allowedElementType]: string
}

/* tslint:disable:object-literal-sort-keys */
const cardValidationErrorsInit: CardFieldsMap = {
  cardNumber: 'Card number is required.',
  cardExpiry: 'Expiration date is required.',
  cardCvc: 'CVC is required.'
}

const cardFieldsFullNames: CardFieldsMap = {
  cardNumber: 'Card number',
  cardExpiry: 'Expiration date',
  cardCvc: 'CVC'
}
/* tslint:enable:object-literal-sort-keys */

interface Card {
  expMonth: number
  expYear: number
  last4: string
}

export interface PaymentMethod {
  id: string
  card: Card
}

interface CustomProps {
  onSubmit: (val: FormValues) => void
  amount: number
  setCardError: (error: GenericError) => void
  paymentMethods: PaymentMethod[]
  hideSplitPayment?: boolean
  forceSplitPayment?: boolean
}

export interface FormValuesCommon {
  splitPayment?: boolean
  splitAmount: number
  acceptTerms: boolean
}
export interface FormValuesSavedCard extends FormValuesCommon {
  paymentMethodId: string
  payWithSavedCard: 'yes' // can't be boolean in this case because Formik RadioButton doesn't support boolean values
}

export interface FormValuesNewCard extends FormValuesCommon {
  saveCard?: boolean
  fullName?: string
  postalCode?: string
  payWithSavedCard: 'no' // can't be boolean in this case because Formik RadioButton doesn't support boolean values
}

export type FormValues = FormValuesNewCard | FormValuesSavedCard

type PaymentFormViewProps = FormikProps<FormValues> & CustomProps
type PaymentFormInnerViewProps = PaymentFormViewProps & {
  commonPanel: JSX.Element
  buttonLabelValue: number
}

const PaymentNewCard: React.FunctionComponent<PaymentFormInnerViewProps> = props => {
  const [cardValidationErrors, setCardErrors] = React.useState(cardValidationErrorsInit)

  const handleChange = async (event: StripeElementChangeEvent) => {
    const elementType: allowedElementType = event.elementType as allowedElementType
    const fieldFullName = cardFieldsFullNames[elementType]
    let errorMessage = event.complete ? '' : `${fieldFullName} is required.`
    if (event.error) {
      errorMessage = event.error.message
    }
    setCardErrors(prev => ({
      ...prev,
      [event.elementType]: errorMessage
    }))
    log.debug(event)
  }

  const cardError = React.useMemo(() =>
    Object.values<string>(cardValidationErrors).filter(v => v),
  [cardValidationErrors])

  return (
    <>
      <FieldsWrapper>
        <CardNumberElement
          onChange={handleChange}
          options={{
            ...STRIPE_ELEMENT_BASIC_OPTIONS,
            placeholder: 'Card number'
          }}
        />
      </FieldsWrapper>
      <FieldsWrapper>
        <InlineFields>
          <CardExpiryElement
            onChange={handleChange}
            options={{
              ...STRIPE_ELEMENT_BASIC_OPTIONS,
              placeholder: 'MM/YY'
            }}
          />
          <CardCvcElement
            onChange={handleChange}
            options={{
              ...STRIPE_ELEMENT_BASIC_OPTIONS,
              placeholder: 'CVC'
            }}
          />
        </InlineFields>
      </FieldsWrapper>
      <FieldsWrapper>
        <Field
            name={`${nameof<FormValuesNewCard>('fullName')}`}
            placeholder='Name on card'
            component={InputField}
            compactMode={false}
        />
        <InlineFields>
          <Field
            name={`${nameof<FormValuesNewCard>('postalCode')}`}
            placeholder='Postal code'
            component={InputField}
            compactMode={false}
          />
          <Field
            name={`${nameof<FormValuesNewCard>('saveCard')}`}
            label='Save card'
            component={CheckboxField}
          />
        </InlineFields>
        {props.commonPanel}
      </FieldsWrapper>
      <Button
        full
        buttonTheme='action'
        label={`Pay $${props.buttonLabelValue}`}
        size='big'
        onClick={() => {
          const errors: string[] = []
          errors.push(...cardError, ...validateCommonFields(props.values, props.amount))
          if (errors.length) {
            props.setCardError(errors)
            return
          }
          props.onSubmit(props.values)
        }}
      />
    </>
  )
}

const PaymentSavedCard: React.FunctionComponent<PaymentFormInnerViewProps> = props => {
  const { values } = props
  const options = props.paymentMethods.map(pm => {
    const expMonth = pm.card.expMonth < 10 ? '0' + pm.card.expMonth : pm.card.expMonth
    return {
      label: `⚹⚹⚹⚹ ${pm.card.last4} - Expires ${expMonth}/${pm.card.expYear}`,
      value: pm.id
    }
  })

  return (
    <>
      <FieldsWrapper>
        <Field
          name={`${nameof<FormValuesSavedCard>('paymentMethodId')}`}
          placeholder='Select card'
          component={SelectField}
          options={options}
        />
        {props.commonPanel}
      </FieldsWrapper>
      <Button
        full
        buttonTheme='action'
        label={`Pay $${props.buttonLabelValue}`}
        size='big'
        onClick={() => {
          const errors: string[] = []
          if (values.payWithSavedCard === 'yes' && !values.paymentMethodId) {
            errors.push('Please select card.')
          }
          errors.push(...validateCommonFields(props.values, props.amount))

          if (errors.length) {
            props.setCardError(errors)
            return
          }
          props.onSubmit(props.values)
        }}
      />
    </>
  )
}

const SplitPaymentPanel: React.FunctionComponent<PaymentFormViewProps> = props => {
  const { forceSplitPayment, hideSplitPayment, values } = props

  const hidePanel = hideSplitPayment && !forceSplitPayment
  return (
    <>
      {!hidePanel && (
        <>
          <Field
            name={`${nameof<FormValues>('splitPayment')}`}
            label='Split payment'
            component={CheckboxField}
            disabled={forceSplitPayment}
          />
          <SplitAmountField hide={!values.splitPayment}>
            <div>
              Pay
              <Field
                name={`${nameof<FormValues>('splitAmount')}`}
                placeholder='Amount'
                component={SplitAmountInput}
                type='number'
              />
              of ${props.amount}
            </div>
            <Hint>Split amount must be less than $ {props.amount} </Hint>
          </SplitAmountField>
        </>
      )}
      <Field
        name={`${nameof<FormValues>('acceptTerms')}`}
        label='I have read and accepted the Terms and Conditions and Privacy Policy'
        component={CheckboxField}
      />
    </>
  )
}

const PaymentFormView: React.FunctionComponent<PaymentFormViewProps> = props => {
  const { values } = props

  const buttonLabelValue = values.splitPayment ? values.splitAmount : props.amount
  const commonPanel = <SplitPaymentPanel {...props} />
  const panelToShow = props.values.payWithSavedCard === 'no' ?
    <PaymentNewCard {...props} commonPanel={commonPanel} buttonLabelValue={buttonLabelValue} /> :
    <PaymentSavedCard {...props} commonPanel={commonPanel} buttonLabelValue={buttonLabelValue} />

  React.useEffect(() => {
    props.setCardError('')
  }, [values.payWithSavedCard])

  return (
    <>
      <StyledForm>
        <RadioHolder>
          <Field
            name={nameof<FormValues>('payWithSavedCard')}
            value='yes'
            component={RadioField}
            label='Select saved card'
            size='xs'
          />
          <Field
            name={nameof<FormValues>('payWithSavedCard')}
            value='no'
            component={RadioField}
            label='Enter card data'
            size='xs'
          />
        </RadioHolder>
        {panelToShow}
      </StyledForm>
    </>
  )
}

const validateCommonFields = (values: FormValues, amount: number) => {
  const errors: string[] = []
  if (values.splitPayment && ((values.splitAmount >= amount) || (!values.splitAmount))) {
    errors.push('Split payment amount is incorrect.')
  }
  if (!values.acceptTerms) {
    errors.push('Please accept the Terms and Conditions.')
  }
  return errors
}

export const PaymentForm = withFormik<CustomProps, FormValues>({
  enableReinitialize: true,
  handleSubmit:  () => null,
  mapPropsToValues: props => ({
    acceptTerms: false,
    fullName: '',
    paymentMethodId: props.paymentMethods.length ? props.paymentMethods[0].id : '',
    payWithSavedCard: 'yes',
    postalCode: '',
    saveCard: false,
    splitAmount: 1,
    splitPayment: props.forceSplitPayment || false
  })
})(PaymentFormView)
/* END of Form*/

interface PaymentModalProps extends CustomProps {
  isOpen: boolean
  toggleModal: (value: boolean) => void
  processing?: boolean
  error?: GenericError
  logoUrl?: string
  loadingLogo?: boolean
}

const PaymentModal: React.FunctionComponent<PaymentModalProps> = props => {

  return (
    <Modal
      background='LIGHT'
      fullSide
      title='Checkout'
      isOpen={props.isOpen}
      onRequestClose={() => props.toggleModal(false)}
    >
      <LogoContainer>
        {!props.logoUrl && !props.loadingLogo ? <Logo/> : <img src={props.logoUrl} />}
      </LogoContainer>
      <PaymentForm
        onSubmit={props.onSubmit}
        amount={props.amount}
        setCardError={props.setCardError}
        paymentMethods={props.paymentMethods}
        hideSplitPayment={props.hideSplitPayment}
        forceSplitPayment={props.forceSplitPayment}
      />
      {props.error && (
        <Error error={props.error} />
      )}
      {
        props.processing && (
          <Loader>
            <DotSpinner isProcessComplete={false} />
          </Loader>
        )
      }
    </Modal>
  )
}

export default PaymentModal
