import { BrokerageQueryVariables, EnabledPhotoPresetUpdateInput, Role, UpdateBrokerageMutation, UpdateBrokerageMutationVariables } from '#veewme/gen/graphqlTypes'
import { Brokerage, UpdateBrokerage } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import { BrokerSettingsFormValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import BrokerForm from './brokerSettings'
import { useInitializeBrokerageForm } from './initializeBrokerageForm'
import { BrokerageQueryData } from './queriesDataTypes'

interface EditBrokerProps {
  role: Role
}

const BrokerSettings: React.FunctionComponent<EditBrokerProps> = props => {
  const { id } = useParams()
  const brokerageId = parseInt(id, 10)
  const history = useHistory()

  const { addToast } = useToasts()

  const { data: brokerageQueryData, loading: loadingBrokerage } = useQuery<BrokerageQueryData, BrokerageQueryVariables>(Brokerage, {
    onError: error => log.debug('Query Brokerage error:', error.message),
    variables: { brokerageId }
  })

  const [values, formOptions] = useInitializeBrokerageForm(brokerageQueryData && brokerageQueryData.brokerage.owner, brokerageQueryData && brokerageQueryData.brokerage)

  log.debug(values)
  const [updateBrokerage, { loading: loadingUpdateBrokerage }] = useMutation<UpdateBrokerageMutation, UpdateBrokerageMutationVariables>(
    UpdateBrokerage,
    {
      onCompleted: () => {
        addToast(
          `Brokerage was updated successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
        history.push(`${privateUrls.brokerages}?allowRedirect`)
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

  const handleSubmit = (submitValues: BrokerSettingsFormValues) => {
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

export default BrokerSettings
