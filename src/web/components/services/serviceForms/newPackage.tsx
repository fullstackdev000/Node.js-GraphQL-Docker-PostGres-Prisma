import {
  CreateServicePackageMutation,
  CreateServicePackageMutationVariables,
  ServiceFeeAdjustedByRegionCreateInput,
  ServicePackageFeeAdjustedByRegionCreateInput
} from '#veewme/graphql/types'
import { CreateServicePackage, DuplicateService } from '#veewme/lib/graphql/queries'
import { DataForServiceDetails } from '#veewme/lib/graphql/queries/service'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import { equals } from 'ramda'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import {
  convertDuplicatePackagesToFormValues,
  convertServiceFrontendOnlyDataToMutationInputData,
  isServicePackageFeeAdjustedByRegionCreateInput
} from '../common/util'
import Form from './form'
import { DuplicateOptions, DuplicateOptionValue } from './formPanels/source'
import {
  DuplicateServiceQueryData,
  DuplicateServiceQueryVariables,
  FormValues,
  GetDuplicateOptions,
  ServiceFormOptions
} from './types'

const getDuplicteOptions: GetDuplicateOptions = serviceData => {
  const servicePackages = (
    serviceData.servicePackages
    ? serviceData.servicePackages.map(({ id, name }) => ({
      label: name,
      value: {
        id,
        service: false
      }
    }))
    : []
  )
  return servicePackages
}

const NewPackage: React.FunctionComponent<RouteComponentProps> = props => {
  const [ previousService, setPreviousService ] = React.useState<DuplicateServiceQueryData>()
  const [ initialData, setInitialData ] = React.useState<Partial<FormValues>>()
  const [ serviceOptions, setServiceOptions ] = React.useState<DuplicateOptions>([])
  const { addToast } = useToasts()
  const { data: formOptions, loading: loadingFormOptions } = useQuery<ServiceFormOptions>(DataForServiceDetails)

  const [createServicePackage, { loading: creatingPackage }
  ] = useMutation<CreateServicePackageMutation, CreateServicePackageMutationVariables>(
    CreateServicePackage,
    {
      onCompleted: () => {
        addToast(
          `Service package was created successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        props.history.push(`${privateUrls.services}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while creating the service package`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const [
    getServiceForDuplicate, { data: duplicateServiceData, loading: duplicateServiceLoading }
  ] = useLazyQuery<DuplicateServiceQueryData, DuplicateServiceQueryVariables>(
    DuplicateService,
    {
      onError: error => {
        addToast(
          `Error ${error.message} while fetching package`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      }
    }
  )

  React.useEffect(() => {
    if (formOptions) {
      setServiceOptions(getDuplicteOptions(
        formOptions
      ))
    }
  }, [formOptions])

  React.useEffect(() => {
    if (
      duplicateServiceData
      && !equals(duplicateServiceData, previousService)
      && formOptions
    ) {
      setPreviousService(duplicateServiceData)
      setInitialData(
        convertDuplicatePackagesToFormValues(
          duplicateServiceData,
          formOptions.regions
        )
      )
    }
  }, [ duplicateServiceData, previousService, formOptions ])

  const loading = (
    loadingFormOptions
    || creatingPackage
    || duplicateServiceLoading
  )

  const handleSubmit = (values: FormValues) => {
    const { longDescription, regionFeesAdjusted, serviceType, ...createValues } = values

    createServicePackage({
      variables: {
        ...createValues,
        ...convertServiceFrontendOnlyDataToMutationInputData(createValues),
        regionFeesAdjusted: regionFeesAdjusted
          .filter(isServicePackageFeeAdjustedByRegionCreateInput)
          .map(({ adjustedCompensation, ...fee }: ServiceFeeAdjustedByRegionCreateInput): ServicePackageFeeAdjustedByRegionCreateInput => fee)
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
      {formOptions && <Form
        isPackage
        initialData={initialData}
        onSubmit={handleSubmit}
        formOptions={formOptions}
        serviceOptions={serviceOptions}
        getDuplicate={(val: DuplicateOptionValue) => {
          getServiceForDuplicate({ variables: { packageId: val.id } })
        }}
      />}
    </>
  )
}

export default withRouter(NewPackage)
