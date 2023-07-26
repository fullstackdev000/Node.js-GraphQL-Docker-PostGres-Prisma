import { privateUrls } from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import * as Grid from '#veewme/web/common/grid'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import PaymentModal from '#veewme/web/common/payment'
import * as React from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

const FinalizePayment: React.FC = () => {
  const history = useHistory()
  const { id } = useParams()
  const { search } = useLocation()
  const amountParam = search.split('?amount=')[1]
  const amount = parseFloat(amountParam)

  const [isPaymentOpen, setPaymentModal] = React.useState(false)

  log.debug('payment data:', id, search)

  return (
    <>
      <Grid.PageContainer>
        <Grid.Header>Finalizing Split Payment:</Grid.Header>
        <Grid.MainColumnFullWidth>
          <Panel>
            <Button
              full
              buttonTheme='action'
              label={`Finalize payment: $${amount}`}
              size='big'
              onClick={() => setPaymentModal(true)}
            />
          </Panel>
          <PaymentModal
            isOpen={isPaymentOpen}
            toggleModal={v => setPaymentModal(v)}
            amount={amount}
            onSuccess={() => history.push(privateUrls.orders)}
            paymentType='FINALIZE'
            hideSplitPayment={true}
            finalizeId={id}
          />
        </Grid.MainColumnFullWidth>
      </Grid.PageContainer>
    </>
  )
}

export default FinalizePayment
