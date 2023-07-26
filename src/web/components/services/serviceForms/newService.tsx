import {
  CreateServiceBasicMutation,
  CreateServiceBasicMutationVariables,
  ServiceFeeAdjustedByRegionCreateInput,
  ServiceType,
  ServiceTypeMerged
} from '#veewme/graphql/types'
import { CreateServiceBasic, DuplicateService } from '#veewme/lib/graphql/queries'
import { DataForServiceDetails } from '#veewme/lib/graphql/queries/service'
import { privateUrls } from '#veewme/lib/urls'
import { prepareEditorValueForStorage } from '#veewme/lib/util'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import { equals } from 'ramda'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import {
  convertDuplicateServicesToFormValues,
  convertServiceFrontendOnlyDataToMutationInputData
} from '../common/util'
import Form from './form'
import { DuplicateOptions, DuplicateOptionValue } from './formPanels/source'
import {
  DuplicateServiceQueryData,
  DuplicateServiceQueryVariables,
  FormValues,
  FrontendServiceFeeAdjustedByRegion,
  GetDuplicateOptions,
  ServiceFormOptions
} from './types'

const getDuplicateOptions: GetDuplicateOptions = serviceData => {
  const services = (
    serviceData.services
    ? serviceData.services.map(({ id, name }) => ({
      label: name,
      value: {
        id,
        service: true
      }
    }))
    : []
  )
  return services
}

const isServiceType = (serviceType: ServiceTypeMerged | ServiceType)
: serviceType is ServiceType => serviceType !== 'Package'

const isServiceFeeAdjustedByRegionCreateInput = (
  fee: FrontendServiceFeeAdjustedByRegion | ServiceFeeAdjustedByRegionCreateInput
): fee is ServiceFeeAdjustedByRegionCreateInput => (
  fee.adjustedCompensation !== undefined && fee.adjustedPrice !== undefined
)

const NewService: React.FunctionComponent<RouteComponentProps> = props => {
  const [ previousService, setPreviousService ] = React.useState<DuplicateServiceQueryData>()
  const [ initialData, setInitialData ] = React.useState<Partial<FormValues>>()
  const [ serviceOptions, setServiceOptions ] = React.useState<DuplicateOptions>([])
  const { addToast } = useToasts()
  const { data: formOptions, loading: loadingFormOptions } = useQuery<ServiceFormOptions>(DataForServiceDetails)
  const [
    createServiceBasic, { loading: creatingService }
  ] = useMutation<CreateServiceBasicMutation, CreateServiceBasicMutationVariables>(
    CreateServiceBasic,
    {
      onCompleted: () => {
        addToast(
          `Service was created successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        props.history.push(`${privateUrls.services}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while creating the service`,
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
      setServiceOptions(getDuplicateOptions(
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
        convertDuplicateServicesToFormValues(
          duplicateServiceData,
          formOptions.regions
        )
      )
    }
  }, [ duplicateServiceData, previousService, formOptions ])

  const loading = (
    loadingFormOptions
    || creatingService
    || duplicateServiceLoading
  )

  const handleSubmit = (values: FormValues) => {
    const { longDescription, regionFeesAdjusted, serviceType, ...createValues } = values
    if (isServiceType(serviceType)) {
      if (serviceType === 'Admin') {
        delete createValues.categoryId
      }
      createServiceBasic({
        variables: {
          ...createValues,
          ...convertServiceFrontendOnlyDataToMutationInputData(createValues),
          longDescription: prepareEditorValueForStorage(longDescription),
          regionFeesAdjusted: regionFeesAdjusted.filter(
            isServiceFeeAdjustedByRegionCreateInput
          ) as ServiceFeeAdjustedByRegionCreateInput[],
          serviceType
        }
      }).catch(e => log.debug(e.message))
    }
  }

  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      {formOptions && <Form
        initialData={initialData}
        onSubmit={handleSubmit}
        formOptions={formOptions}
        serviceOptions={serviceOptions}
        getDuplicate={(val: DuplicateOptionValue) => {
          getServiceForDuplicate({ variables: { serviceId: val.id } })
        }}
      />}
    </>
  )
}

export default withRouter(NewService)
