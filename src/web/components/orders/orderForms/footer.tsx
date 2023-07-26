import Button from '#veewme/web/common/buttons/basicButton'
import HideForRole from '#veewme/web/common/hideForRole'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { LAST_STEP } from './orderForm'
import { PaymentSubmitButtons, StyledFooter, StyledFooterSpan, StyledFooterText } from './styled'
import { OrderPaymentType } from './types'

export type setPaymentMethod = (type: OrderPaymentType) => void
interface StepFooterProps {
  step: number
  enableNext?: boolean
  orderTotal?: number
  setPaymentMethod?: setPaymentMethod
}

const StepFooter: React.FunctionComponent<StepFooterProps & RouteComponentProps> = props => (
  <StyledFooter alignRight={props.step === 0}>
    {props.step === 0 &&
      <StyledFooterText>Your current order total: <StyledFooterSpan>${props.orderTotal}</StyledFooterSpan></StyledFooterText>
    }
    {props.step > 0 &&
      <Button to={String(props.step - 1)} buttonTheme='action' label='Previous Step'/>
    }
    {props.step < LAST_STEP - 1 &&
      <Button to={props.enableNext ? String(props.step + 1) : '#'} disabled={!props.enableNext} buttonTheme='action' full label='Next Step' />
    }
    {props.step === LAST_STEP - 1 &&
      <Button to={props.enableNext ? String(props.step + 1) : '#'} disabled={!props.enableNext} buttonTheme='action' full label='Continue to confirmation' />
    }
    {props.step === LAST_STEP && (
      <>
        <HideForRole action='hide' roles={['AGENT']}>
          <Button
            type='submit'
            buttonTheme='action'
            full
            label='Submit'
          />
        </HideForRole>
        <HideForRole action='hide' roles={['AFFILIATE']}>
          <PaymentSubmitButtons>
            <Button
              type='submit'
              buttonTheme='action'
              full
              label='Submit (Company Pay)'
              onClick={() => {
                if (props.setPaymentMethod) {
                  props.setPaymentMethod('COMPANY_PAY')
                }
              }}
            />
            <Button
              type='submit'
              buttonTheme='action'
              full
              label='Submit (On Order Payment)'
              onClick={() => {
                if (props.setPaymentMethod) {
                  props.setPaymentMethod('ON_ORDER')
                }
              }}
            />
            <Button
              type='submit'
              buttonTheme='action'
              full
              label='Submit (Split Payment)'
              onClick={() => {
                if (props.setPaymentMethod) {
                  props.setPaymentMethod('SPLIT_PAYMENT')
                }
              }}
            />
          </PaymentSubmitButtons>
        </HideForRole>
      </>
    )
    }
  </StyledFooter>
)

StepFooter.defaultProps = {
  enableNext: true,
  orderTotal: 0,
  step: 0
}

export default withRouter(StepFooter)
