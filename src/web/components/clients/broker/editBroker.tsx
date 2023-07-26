import { BrokerageQueryVariables, EnabledPhotoPresetUpdateInput, UpdateBrokerageMutation, UpdateBrokerageMutationVariables } from '#veewme/gen/graphqlTypes'
import { Brokerage, UpdateBrokerage } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import { BrokerFormValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import BrokerForm from './brokerForm'
import { useInitializeBrokerageForm } from './initializeBrokerageForm'
import { BrokerageQueryData } from './queriesDataTypes'

// TODO Check user role for brokerage creation

interface EditBrokerProps {
  brokerageId: string
}

const EditBroker: React.FunctionComponent<RouteComponentProps<EditBrokerProps>> = props => {
  const brokerageId = parseInt(props.match.params.brokerageId, 10)

  const { addToast } = useToasts()

  const { data: brokerageQueryData, loading: loadingBrokerage } = useQuery<BrokerageQueryData, BrokerageQueryVariables>(Brokerage, {
    onError: error => log.debug('Query Brokerage error:', error.message),
    variables: { brokerageId }
  })

  const [values, formOptions] = useInitializeBrokerageForm(brokerageQueryData && brokerageQueryData.brokerage.owner, brokerageQueryData && brokerageQueryData.brokerage)

  const [updateBrokerage, { loading: loadingUpdateBrokerage }] = useMutation<UpdateBrokerageMutation, UpdateBrokerageMutationVariables>(
    UpdateBrokerage,
    {
      onCompleted: () => {
        addToast(
          `Brokerage was updated successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
        props.history.push(`${privateUrls.brokerages}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating brokerage`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
        log.debug(error.message)
      }
    }
  )

  const handleSubmit = (submitValues: BrokerFormValues) => {
    const { photoDownloadPresets, music, ...newValues } = submitValues
    updateBrokerage({
      variables: {
        ...newValues,
        id: brokerageId,
        photoDownloadPresets: photoDownloadPresets.map<EnabledPhotoPresetUpdateInput>(preset => ({
          downloadTrigger: preset.downloadTrigger,
          enabled: preset.enabled,
          id: preset.id,
          photoPresetId: preset.photoPreset.id
        }))
      }
    })
    .catch(e => log.debug(e.message))
  }

  const loading = loadingBrokerage || loadingUpdateBrokerage

  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      {brokerageQueryData &&
        <BrokerForm
          formOptions={formOptions}
          name={brokerageQueryData.brokerage.companyName}
          values={values}
          onSubmit={handleSubmit}
        />
      }
    </>
  )
}

export default withRouter(EditBroker)
