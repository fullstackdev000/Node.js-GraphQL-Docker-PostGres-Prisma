import Amex from '#veewme/web/assets/svg/amex.svg'
import MasterCard from '#veewme/web/assets/svg/mastercard.svg'
import Visa from '#veewme/web/assets/svg/visa.svg'
import Button from '#veewme/web/common/buttons/basicButton'
import { PaymentMethod } from '#veewme/web/common/formPanels/valuesInterfaces'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const BillingPanel = styled.div`
  padding: 15px;
  margin: 15px 0;
  border: 1px solid ${props => props.theme.colors.BORDER};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  button {
    margin-left: auto;
  }
`

const CardIconWrapper = styled.div`
  border: 1px solid ${props => props.theme.colors.BORDER};
  width: 45px;
  height: 30px;
  padding: 2px;
  & > svg {
    max-width: 100%;
    max-height: 100%;
  }
`

const CardNumber = styled.div`
  margin-left: 10px;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

// TODO add payment method, waiting for credit card library / method being ready
export const generateNextPaymentMethod = (): PaymentMethod => {
  const samples: PaymentMethod[] = [
    { cardName: 'Visa', icon: Visa },
    { cardName: 'MasterCard', icon: MasterCard },
    { cardName: 'American Express', icon: Amex }
  ]
  const randomIndex = Math.floor(Math.random() * (samples.length))
  return samples[randomIndex]
}

interface PaymentPanelProps {
  onClick: () => void
}

const PaymentPanel: React.FunctionComponent<PaymentPanelProps & PaymentMethod> = props => {
  return (
    <BillingPanel>
      <CardIconWrapper><props.icon/></CardIconWrapper>
      <CardNumber>XXXX-XXXX-XXXX-1111 ({props.cardName})</CardNumber>
      {/*TODO change X to an icon when the icon is merged to master*/}
      <Button type='button' onClick={props.onClick} label='X' />
    </BillingPanel>
  )
}

export default PaymentPanel
