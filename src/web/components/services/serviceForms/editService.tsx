import {
  ServiceFeeAdjustedByRegionUpdateInput,
  ServiceQuery,
  ServiceQueryVariables,
  UpdateServiceMutation,
  UpdateServiceMutationVariables
} from '#veewme/graphql/types'
import { Service, UpdateService } from '#veewme/lib/graphql/queries'
import { DataForServiceDetails } from '#veewme/lib/graphql/queries/service'
import { privateUrls } from '#veewme/lib/urls'
import { prepareEditorValueForStorage } from '#veewme/lib/util'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import {
  convertDuplicateServicesToFormValues as prepareInitialData,
  convertServiceFrontendOnlyDataToMutationInputData,
  isServiceFeeAdjustedByRegionCreateInput
} from '../common/util'
import Form from './form'
import {
  ConflictingKeys,
  FormValues,
  ServiceFormOptions
} from './types'

type ServiceData = NoNullableFields<ServiceQuery>

interface RouteParams {
  id: string
}

const EditService: React.FunctionComponent = props => {
  const { id } = useParams<RouteParams>()
  const history = useHistory()
  const { addToast } = useToasts()
  const { data: formOptions, loading: loadingFormOptions } = useQuery<ServiceFormOptions>(DataForServiceDetails)

  const { data: serviceData, loading: loadingService } = useQuery<ServiceData, ServiceQueryVariables>(Service, {
    variables: {
      id: Number(id)
    }
  })

  const [updateService, { loading: updatingService }
  ] = useMutation<UpdateServiceMutation, UpdateServiceMutationVariables>(
    UpdateService,
    {
      onCompleted: () => {
        addToast(
          `Service was created successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        history.push(`${privateUrls.services}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while creating the service`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const loading = (
    loadingFormOptions
    || updatingService
    || loadingService
  )

  const handleSubmit = (values: FormValues) => {
    log.debug(values)
    const { longDescription, regionFeesAdjusted, serviceType, ...createValues } = values

    const valuesCopy = {
      ...createValues
    }

    delete valuesCopy.id

    const vars: Omit<UpdateServiceMutationVariables['data'], ConflictingKeys> = {
      ...valuesCopy
    }

    updateService({
      variables: {
        data: {
          ...vars,
          ...convertServiceFrontendOnlyDataToMutationInputData(createValues),
          longDescription: prepareEditorValueForStorage(longDescription),
          regionFeesAdjusted: regionFeesAdjusted.filter(
            isServiceFeeAdjustedByRegionCreateInput
          ) as ServiceFeeAdjustedByRegionUpdateInput[]
        },
        where: {
          id: Number(id)
        }
      }
    }).catch(e => log.debug(e.message))
  }
  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      {formOptions && serviceData && <Form
        edit
        initialData={prepareInitialData(serviceData, formOptions.regions)}
        onSubmit={handleSubmit}
        formOptions={formOptions}
      />}
    </>
  )
}

export default EditService
