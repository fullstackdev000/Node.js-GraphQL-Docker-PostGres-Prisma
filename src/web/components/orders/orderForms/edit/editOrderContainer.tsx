import {
    OrderQuery,
    OrderQueryVariables,
    UpdateOrderMutation,
    UpdateOrderMutationVariables
  } from '#veewme/gen/graphqlTypes'
import { Order, UpdateOrder } from '#veewme/lib/graphql/queries/orders'

import { privateUrls } from '#veewme/lib/urls'
import { templateOptions } from '#veewme/web/common/consts'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { UpdateOrderFormValues } from '../types'
import EditOrderForm from './editOrder'

import { prepareEditorValueForStorage } from '#veewme/lib/util'
import { convertFromRaw, EditorState } from 'draft-js'

const prepareMutationVariables = ({
  mlsPrimary,
  mlsSecondary,
  notesForPhotographer,
  prefferedShootDate,
  prefferedShootTime,
  templateId,
  realEstate: { tour: frontendTour, ...realEstate }
}: UpdateOrderFormValues): UpdateOrderMutationVariables['data'] => {
  const tour = frontendTour ? {
    ...frontendTour,
    descriptionFull: frontendTour.descriptionFull ? prepareEditorValueForStorage(frontendTour.descriptionFull) : undefined
  } : undefined

  const estateCopy = {
    ...realEstate
  }

  const peferredDate = typeof prefferedShootDate === 'string' ? new Date(prefferedShootDate) : prefferedShootDate

  const [hours, minutes]: Array<string | undefined> = prefferedShootTime ? prefferedShootTime.split(':') : []
  if (hours) {
    peferredDate.setHours(parseInt(hours, 10))
  }
  if (minutes) {
    peferredDate.setMinutes(parseInt(minutes, 10))
  }

  return {
    mlsPrimary,
    mlsSecondary,
    notesForPhotographer,
    prefferedShootDate: peferredDate,
    realEstate: { ...estateCopy, tour },
    templateId
  }
}

const formatDisplayTime = (isoDate: string = '') => {
  const date = new Date(isoDate)
  const h = String(date.getHours())
  const m = String(date.getMinutes())
  const formattedH = h.length === 2 ? h : '0' + h
  const formattedM = m.length === 2 ? m : '0' + m

  return `${formattedH}:${formattedM}`
}

type OrderData = NoNullableFields<OrderQuery>

interface RouteParams {
  orderId: string
}

const DocumentEdit: React.FunctionComponent = () => {
  const { orderId } = useParams<RouteParams>()

  const history = useHistory()
  const { addToast } = useToasts()

  const { data, loading: loadingInitialData } = useQuery<OrderData, OrderQueryVariables>(Order, {
    variables: {
      id: Number(orderId)
    }
  })

  const [ updateOrder, { loading } ] = useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(UpdateOrder, {
    onCompleted: () => {
      const redirectUrl = `${privateUrls.orders}`
      history.push(redirectUrl)
      addToast(
          `Order was updated successfully.`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
      )
    },
    onError: error => {
      addToast(
          `Error ${error.message} occured.`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
      )
    }
  })
  const agentTemplateId = data && data.order.realEstate.agentPrimary.templateId
  const affiliateCountry = data && data.order.realEstate.agentPrimary.affiliate.country
  const template = templateOptions.find(o => o.value === agentTemplateId)
  const templateName = template ? template.label : ''
  const agentTemplateHint = (
    <>Agent default tour template is: <strong>{templateName}</strong>. You can select another template for this order.
    </>
  )

  return (
      <>
        <DotSpinnerModal isOpen={loading || loadingInitialData} />
        {
          data && <EditOrderForm
            agentTemplateHint={agentTemplateHint}
            showCanadianBedrooms={affiliateCountry === 'CA'}
            data={{
              ...data.order,
              prefferedShootDate: data.order.prefferedShootTime,
              prefferedShootTime: data.order.prefferedShootTime && formatDisplayTime(data.order.prefferedShootTime),
              realEstate: {
                ...data.order.realEstate,
                tour: {
                  ...data.order.realEstate.tour,
                  descriptionFull: data.order.realEstate.tour.descriptionFull ? EditorState.createWithContent(convertFromRaw(data.order.realEstate.tour.descriptionFull)) : EditorState.createEmpty()
                }
              }
            }}
            onSubmit={values => {
              log.debug(values)
              updateOrder({
                variables: {
                  data: prepareMutationVariables(values),
                  id: Number(orderId)
                }
              }).catch(e => log.debug(e))
            }}
          />
        }
    </>
  )
}

export default DocumentEdit
