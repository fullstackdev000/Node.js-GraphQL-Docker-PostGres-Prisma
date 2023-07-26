import { Country, CreateOrderMutation, CreateOrderMutationVariables, MeQuery, State } from '#veewme/gen/graphqlTypes'
import { UnreachableCaseError } from '#veewme/lib/error'
import { CreateOrder, CreatePayment, Me, OrderFormData } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import { prepareEditorValueForStorage } from '#veewme/lib/util'
import { unsetNumberId } from '#veewme/web/common/consts'
import * as log from '#veewme/web/common/log'
import PaymentModal from '#veewme/web/common/payment'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import mockData from './mockData'
import Form, { FormValues } from './orderForm'
import SubmitModal from './submitModal'
import { ConvertedAgent, OrderFormQueryData as OrderFormQueryDataRaw, OrderPaymentType } from './types'

import {
  CreatePaymentMutation,
  CreatePaymentMutationVariables
} from '#veewme/gen/graphqlTypes'

const convertToCreateOrderMutationVariables = ({
  mlsPrimary,
  mlsSecondary,
  notesForPhotographer,
  prefferedShootDate,
  prefferedShootTime,
  promoCode,
  realEstate: { tour: frontendTour, ...realEstate },
  serviceIds,
  servicePackageId
}: FormValues): CreateOrderMutationVariables => {
  const tour = frontendTour ? {
    ...frontendTour,
    descriptionFull: frontendTour.descriptionFull ? prepareEditorValueForStorage(frontendTour.descriptionFull) : undefined
  } : undefined

  const [hours, minutes]: Array<string | undefined> = prefferedShootTime ? prefferedShootTime.split(':') : []
  if (hours) {
    prefferedShootDate.setHours(parseInt(hours, 10))
  }
  if (minutes) {
    prefferedShootDate.setMinutes(parseInt(minutes, 10))
  }
  return {
    mlsPrimary,
    mlsSecondary,
    notesForPhotographer,
    prefferedShootDate,
    promoCode,
    realEstate: { ...realEstate, tour },
    serviceIds,
    servicePackageId
  }
}

type OrderFormQueryData = NoNullableFields<OrderFormQueryDataRaw>
interface Address {
  country: Country
  state: State
}

const NewOrder: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const { search } = useLocation()
  const { data: meData } = useQuery<MeQuery>(Me)

  const agentIdParam = search.split('agentId=')[1]
  const isAgent = meData && meData.me.role === 'AGENT'
  let agentId = Number(agentIdParam)

  if (meData && isAgent) {
    agentId = meData.me.accountId
  }

  const address: Address = {
    country: 'US',
    state: 'AL'
  }

  const [ createdId, setId ] = React.useState<number>(0)
  const [ isPaymentOpen, setPaymentModal ] = React.useState()
  const [ totalAmount, setTotalAmount ] = React.useState(unsetNumberId)
  const [ paymentMethod, setPaymentMethod ] = React.useState<OrderPaymentType>()

  const { data, loading: dataLoading } = useQuery<OrderFormQueryData>(OrderFormData)

  if (meData && meData.me.role === 'AFFILIATE') {
    const account = meData.me.account
    if (account.__typename === 'Affiliate') {
      address.country = account.country
      address.state = account.state
    }
  } else if (meData && meData.me.role === 'AGENT') {
    const account = meData.me.account
    if (account.__typename === 'Agent') {
      address.country = account.affiliate.country
      address.state = account.affiliate.state
    }
  }

  const [ createPayment, { loading: paying } ] = useMutation<CreatePaymentMutation, CreatePaymentMutationVariables>(CreatePayment, {
    onCompleted: () => {
      toggleCompleted()
    },
    onError: error => {
      addToast(
        `Error ${error.message} while creating Order.`,
        { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    }
  })

  const [createOrder, { loading: sending }] = useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrder, {
    onCompleted: response => {
      setId(response.createOrder.id)
      if (isAgent && paymentMethod) {
        switch (paymentMethod) {
          case 'COMPANY_PAY':
            return createPayment({
              variables: {
                amount: totalAmount,
                orderId: response.createOrder.id,
                type: 'COMPANY_PAY'
              }
            }).catch(e => log.debug(e))
          case 'ON_ORDER':
            return setPaymentModal(true)
          case 'SPLIT_PAYMENT':
            return setPaymentModal(true)
          default:
            throw new UnreachableCaseError(paymentMethod)
        }
      } else {
        toggleCompleted()
      }
    },
    onError: error => {
      addToast(
        `Error ${error.message} while creating Order.`,
        { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    }
  })
  const [completed, setCompleted] = React.useState<boolean>(false)

  const agents: ConvertedAgent[] = React.useMemo(() => {
    if (data) {
      return data.agents.map(agent => ({
        firstName: agent.user.firstName,
        id: agent.id,
        internalNote: agent.internalNote,
        lastName: agent.user.lastName,
        showInternalNoteUponOrder: agent.showInternalNoteUponOrder
      }))
    } else return []
  }, [data])

  const handleSubmit = (values: FormValues) => {
    log.debug('Submit', values)
    setTotalAmount(values.orderTotal)
    const variables = convertToCreateOrderMutationVariables(values)
    createOrder({ variables }).catch(e => log.debug(e))
  }

  const toggleCompleted = () => { setCompleted(!completed) }

  const primaryCollapsedIds = data ?
    data.primaryCategories
      .filter(c => c.collapsed)
      .map(v => v.category.id)
  : []

  const addOnCollapsedIds = data ?
    data.addOnCategories
      .filter(c => c.collapsed)
      .map(v => v.category.id)
  : []

  // TODO add Form version for Agent.
  return (
    <>
      <DotSpinnerModal isOpen={dataLoading || sending || paying} />
      {data && <Form
        onSubmit={handleSubmit}
        {...mockData}
        addOnServices={data && data.addOnServices}
        addOnCategoriesOrder={data.addOnCategories.map(v => v.category.label)}
        primaryCategoriesOrder={data.primaryCategories.map(v => v.category.label)}
        primaryCollapsedIds={primaryCollapsedIds}
        addOnCollapsedIds={addOnCollapsedIds}
        agents={agents}
        servicePackages={data && data.servicePackages}
        primaryServices={data && data.primaryServices}
        adminServices={data && data.adminServices}
        isAgent={isAgent}
        agentId={agentId}
        setPaymentMethod={setPaymentMethod}
        state={address.state}
        country={address.country}
      />}
      <PaymentModal
        isOpen={isPaymentOpen}
        toggleModal={v => setPaymentModal(v)}
        onSuccess={() => {
          toggleCompleted()
        }}
        amount={totalAmount}
        orderId={createdId}
        paymentType={paymentMethod || 'ON_ORDER'}
        hideSplitPayment={paymentMethod === 'ON_ORDER'}
        showSuccessToast={false}
        forceSplitPayment={paymentMethod === 'SPLIT_PAYMENT'}
      />
      <SubmitModal
        orderId={createdId}
        isOpen={completed}
        // TODO add links
        invoiceLink='#'
        propertiesListLink={privateUrls.orders}
        onToggle={toggleCompleted}
      />
    </>
  )
}

export default NewOrder
