import * as log from '#veewme/web/common/log'
import PaymentModal from '#veewme/web/common/payment'
import * as React from 'react'
import Button from '../../common/buttons/basicButton'
import styled from '../../common/styled-components'

const Wrapper = styled.div`
  padding: 30px;

  button {
    margin-top: 20px;
  }

  p {
    margin: 10px 0;
    line-height: 26px;
  }
`

const ToastExample: React.FunctionComponent = () => {
  const [isOpen, setOpen] = React.useState(false)

  return (
    <Wrapper>
      <Button
        buttonTheme='action'
        label='Pay $10'
        onClick={() => setOpen(true)}
      />
      <p>
        Test card data:
      </p>
      <p>
        <strong>Success card number</strong>: 4242 4242 4242 4242 <br/>
        <strong>Fail card number</strong>: 4000 0000 0000 9995 <br/>
        <strong>Exp date</strong>: any future date <br/>
        <strong>CVC</strong>: any 3 digits <br/>
      </p>
      <PaymentModal
        isOpen={isOpen}
        toggleModal={v => setOpen(v)}
        onSuccess={() => log.debug('payment success')}
        amount={10}
        paymentType='GENERIC'
      />
    </Wrapper>
  )
}

export default ToastExample
