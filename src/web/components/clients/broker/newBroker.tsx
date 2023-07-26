import { CreateBrokerageMutation, CreateBrokerageMutationVariables, EnabledPhotoPresetCreateInput, MeQuery } from '#veewme/gen/graphqlTypes'
import { CreateBrokerage, Me } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import { BrokerFormValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import BrokerForm from './brokerForm'
import { useInitializeBrokerageForm } from './initializeBrokerageForm'

type MeData = NoNullableFields<MeQuery>

// TODO Check user role for brokerage creation

const NewBroker: React.FunctionComponent<RouteComponentProps> = props => {
  const { addToast } = useToasts()

  const { data, loading: loadingMe } = useQuery<MeData>(Me)

  const [values, formOptions] = useInitializeBrokerageForm(data && data.me.account.__typename === 'Affiliate' ? data.me.account : undefined)

  const [createBrokerage, { loading: loadingCreateBrokerage }] = useMutation<CreateBrokerageMutation, CreateBrokerageMutationVariables>(
    CreateBrokerage,
    {
      onCompleted: result => {
        addToast(
          `Broker ${result.createBrokerage.companyName} was created successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        props.history.push(`${privateUrls.brokerages}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while creating broker`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        log.debug(error.message)
      }
    }
  )

  const handleSubmit = (submitValues: BrokerFormValues) => {
    const { music, ...newValues } = submitValues
    createBrokerage({
      variables: {
        ...newValues,
        owner: newValues.ownerId,
        photoDownloadPresets: newValues.photoDownloadPresets.map<EnabledPhotoPresetCreateInput>(preset => ({
          downloadTrigger: preset.downloadTrigger,
          enabled: preset.enabled,
          photoPresetId: preset.photoPreset.id
        }))
      }
    })
    .catch(e => log.debug(e.message))
  }

  const loading = loadingCreateBrokerage || loadingMe

  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      {data &&
        <BrokerForm
          formOptions={formOptions}
          values={values}
          onSubmit={handleSubmit}
        />
      }
    </>
  )
}

export default withRouter(NewBroker)
