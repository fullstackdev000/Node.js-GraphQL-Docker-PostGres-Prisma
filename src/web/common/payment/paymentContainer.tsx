import {
  CreatePaymentMutation,
  CreatePaymentMutationVariables,
  FinalizePaymentMutation,
  FinalizePaymentMutationVariables,
  MeLogoQuery,
  MeQuery
} from '#veewme/gen/graphqlTypes'
import { CreatePayment, FinalizePayment, Me, MeLogo } from '#veewme/lib/graphql/queries'
import * as log from '#veewme/web/common/log'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { ConfirmCardPaymentData, loadStripe } from '@stripe/stripe-js'
// import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import PaymentModal, { FormValues, GenericError, PaymentMethod } from './paymentModal'

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC || '')

interface PaymentCommonProps {
  isOpen: boolean
  toggleModal: (value: boolean) => void
  amount: number
  onSuccess?: () => void
  hideSplitPayment?: boolean
  orderId?: number
  showSuccessToast?: boolean
  forceSplitPayment?: boolean
}

interface PaymentBasicProps extends PaymentCommonProps {
  paymentType: CreatePaymentMutationVariables['type']
}

interface PaymentFinalizeProps extends PaymentCommonProps {
  paymentType: 'FINALIZE'
  finalizeId: string
}

type PaymentContainerProps = PaymentFinalizeProps | PaymentBasicProps

const PaymentContainer: React.FunctionComponent<PaymentContainerProps> = props => {
  const { showSuccessToast = true } = props
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = React.useState(false)
  const { addToast } = useToasts()
  const [error, setError] = React.useState<GenericError>('')

  const { data: meData, loading: loadingPaymentMethods } = useQuery<MeQuery>(Me)

  const account = meData && meData.me.account
  let paymentMethods: PaymentMethod[] = []
  if (account && account.__typename === 'Agent') {
    paymentMethods = account.paymentMethods
  }

  /**
   * Loading logo requires separate query in this case. Main `MeQuery` results are cached
   * and other components reads this data from the cache. But there is a problem when `profilePicture` field is not available
   * in query data (because image hasn't been set) because Apollo Cache expects this field to be always present.
   * As a result app crashes.
   * TODO: investigate if there is any other way to fix it.
   */
  const { data: logoData, loading: loadingLogo } = useQuery<MeLogoQuery>(MeLogo, {
    fetchPolicy: 'network-only'
  })

  let logoUrl: string = ''
  if (logoData && logoData.me.account.__typename === 'Affiliate') {
    logoUrl = logoData.me.account.profilePicture ? logoData.me.account.profilePicture.path : ''
  } else if (logoData && logoData.me.account.__typename === 'Agent') {
    logoUrl = logoData.me.account.affiliate.profilePicture ? logoData.me.account.affiliate.profilePicture.path : ''
  }

  const [ createPayment ] = useMutation<CreatePaymentMutation, CreatePaymentMutationVariables>(CreatePayment, {
    onError: err => {
      setProcessing(false)
      setError(err.message)
    }
  })

  const [ finalizePayment ] = useMutation<FinalizePaymentMutation, FinalizePaymentMutationVariables>(FinalizePayment, {
    onError: err => {
      setProcessing(false)
      setError(err.message)
    }
  })

  React.useEffect(() => {
    setError('')
  }, [props.isOpen])

  const handleSubmit = async (values: FormValues) => {
    if (!stripe) {
      return
    }

    setProcessing(true)
    const splitAmount = values.splitAmount || 0
    const actualAmount = values.splitPayment ? splitAmount : props.amount

    let clientSecret: string
    // shape of returned mutation data doen't allow for correct typing when narrowing types
    if (props.paymentType === 'FINALIZE') {
      const paymentIntent = await finalizePayment({
        variables: {
          data: { paymentLinkId: props.finalizeId }
        }
      })

      clientSecret = paymentIntent!.data!.finalizeSplitPayment.clientSecret || ''
    } else {
      const paymentIntent = await createPayment({
        variables: {
          amount: actualAmount,
          orderId: props.orderId,
          type: props.paymentType
        }
      })
      clientSecret = paymentIntent!.data!.createPayment.clientSecret || ''
    }

    if (!clientSecret) {
      setProcessing(false)
      setError('Something went wrong.')
      return
    }

    let paymentMethod: ConfirmCardPaymentData['payment_method']
    if (values.payWithSavedCard === 'yes') {
      paymentMethod = values.paymentMethodId
    } else if (elements) {
      const cardEl = elements.getElement(CardNumberElement)
      if (!cardEl) {
        return
      }
      paymentMethod = {
        billing_details: {
          address: {
            postal_code: values.postalCode
          },
          name: values.fullName || undefined // stripe doesn't accept empty string values
        },
        card: cardEl
      }
      log.debug(paymentMethod)
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
      setup_future_usage: values.payWithSavedCard === 'no' && values.saveCard ? 'off_session' : undefined

    })
    log.debug('Stripe confirmCardPayment response', payload)

    if (payload.error) {
      setProcessing(false)
      setError(payload.error.message || '')
    } else {
      setProcessing(false)
      props.toggleModal(false)
      props.onSuccess && props.onSuccess()
      if (showSuccessToast) {
        addToast(
          `Congratulations. Payment succeeded. It may take a while until payment is registered in our system.`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }
    }
  }

  return (
    <>
      <PaymentModal
        isOpen={props.isOpen}
        toggleModal={props.toggleModal}
        onSubmit={values => handleSubmit(values)}
        processing={processing || loadingPaymentMethods}
        loadingLogo={loadingLogo}
        amount={props.amount}
        error={error}
        setCardError={err => setError(err)}
        hideSplitPayment={props.hideSplitPayment}
        paymentMethods={paymentMethods}
        forceSplitPayment={props.forceSplitPayment}
        logoUrl={logoUrl}
      />
    </>
  )
}

const PaymentStripe: React.FunctionComponent<PaymentContainerProps> = props => {
  return (
    <Elements stripe={stripePromise} options={{ locale: 'en' }} >
      {props.isOpen && <PaymentContainer {...props} />}
    </Elements>
  )
}

export default PaymentStripe
