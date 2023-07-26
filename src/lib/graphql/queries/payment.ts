import gql from 'graphql-tag'

export const CreatePayment = gql`
  mutation CreatePayment($amount: Float!, $type: PaymentType!, $orderId: Int) {
    createPayment(data: {amount: $amount, type: $type, orderId: $orderId}) {
      clientSecret
    }
  }
`

export const FinalizePayment = gql`
  mutation FinalizePayment($data: FinalizeSplitPaymentInput!) {
    finalizeSplitPayment(data: $data) {
      clientSecret
    }
  }
`
