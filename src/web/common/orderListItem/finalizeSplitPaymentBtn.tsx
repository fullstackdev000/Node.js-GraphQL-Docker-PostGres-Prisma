import Button from '#veewme/web/common/buttons/basicButton'
// import * as log from '#veewme/web/common/log'
import PaymentModal from '#veewme/web/common/payment'
import { OrderQueryData } from '#veewme/web/components/orders/types'

import { MeQuery } from '#veewme/gen/graphqlTypes'
import { Me } from '#veewme/lib/graphql/queries'
import { useQuery } from '@apollo/react-hooks'

import * as React from 'react'

type Payments = OrderQueryData['payments']
interface FinalizeSplitPayment {
  order: OrderQueryData
}
const FinalizePaymentBtn: React.FC<FinalizeSplitPayment> = props => {
  const [isPaymentOpen, setPaymentModal] = React.useState(false)

  const { data: meData } = useQuery<MeQuery>(Me, {
    fetchPolicy: 'cache-only'
  })

  const paymentToFinalize = React.useMemo(() => {
    let payments: Payments = []
    let agentId: number
    if (meData && props.order) {
      agentId = meData.me.accountId
      payments = props.order.payments
    }

    return payments.find(p => {
      if (p.agentSecondary && p.agentSecondary.id === agentId && p.paymentLinkId && p.status === 'UNPAID') {
        return true
      } else {
        return false
      }
    })
  }, [props.order, meData])

  if (!paymentToFinalize) {
    return null
  }

  return (
    <>
      <Button
        label='Finalize payment'
        size='medium'
        onClick={() => setPaymentModal(true)}
      />
      <PaymentModal
        isOpen={isPaymentOpen}
        toggleModal={v => setPaymentModal(v)}
        amount={paymentToFinalize.amount}
        paymentType='FINALIZE'
        hideSplitPayment={true}
        finalizeId={paymentToFinalize.paymentLinkId}
      />
    </>
  )
}

export default FinalizePaymentBtn
