import {
  ServiceFeeAdjustedByRegionCreateInput,
  ServicePackageFeeAdjustedByRegionCreateInput,
  ServicePackageQuery,
  ServicePackageQueryVariables,
  UpdatePackageMutation,
  UpdatePackageMutationVariables
} from '#veewme/graphql/types'
import { ServicePackage, UpdatePackage } from '#veewme/lib/graphql/queries'
import { DataForServiceDetails } from '#veewme/lib/graphql/queries/service'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import {
  convertDuplicatePackagesToFormValues as prepareInitialData,
  convertServiceFrontendOnlyDataToMutationInputData,
  isServicePackageFeeAdjustedByRegionCreateInput
} from '../common/util'
import Form from './form'
import {
  ConflictingKeys,
  FormValues,
  ServiceFormOptions
} from './types'

type PackageData = NoNullableFields<ServicePackageQuery>

interface RouteParams {
  id: string
}

const EditPackage: React.FunctionComponent = props => {
  const { id } = useParams<RouteParams>()
  const history = useHistory()
  const { addToast } = useToasts()
  const { data: formOptions, loading: loadingFormOptions } = useQuery<ServiceFormOptions>(DataForServiceDetails)

  const { data: packageData, loading: loadingPackage } = useQuery<PackageData, ServicePackageQueryVariables>(ServicePackage, {
    variables: {
      packageId: Number(id)
    }
  })

  const [updatePackage, { loading: creatingPackage }
  ] = useMutation<UpdatePackageMutation, UpdatePackageMutationVariables>(
    UpdatePackage,
    {
      onCompleted: () => {
        addToast(
          `Service package was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        history.push(`${privateUrls.services}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating the service package`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const loading = (
    loadingFormOptions
    || creatingPackage
    || loadingPackage
  )

  const handleSubmit = (values: FormValues) => {
    const { id: packageId, longDescription, regionFeesAdjusted, serviceType, ...createValues } = values

    const vars: Omit<UpdatePackageMutationVariables['data'], ConflictingKeys> = {
      ...createValues
    }

    updatePackage({
      variables: {
        data: {
          ...vars,
          ...convertServiceFrontendOnlyDataToMutationInputData(createValues),
          regionFeesAdjusted: regionFeesAdjusted
            .filter(isServicePackageFeeAdjustedByRegionCreateInput)
            .map(({ adjustedCompensation, ...fee }: ServiceFeeAdjustedByRegionCreateInput): ServicePackageFeeAdjustedByRegionCreateInput => fee)
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
      {formOptions && packageData && <Form
        isPackage
        edit
        initialData={prepareInitialData(packageData, formOptions.regions)}
        onSubmit={handleSubmit}
        formOptions={formOptions}
      />}
    </>
  )
}

export default EditPackage
