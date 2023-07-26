import { Processor as ProcessorQuery, UpdateProcessor } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Processor } from '../common/types'
import { ProcessorFormikForm, ProcessorProfileValues } from '../profile/profileForm'

type ProcessorEditProps = RouteComponentProps<{ processorId: string }>
interface ProcessorQueryData extends Processor {
  affiliate: {
    regions: Array<{
      id: number // TODO use graphql types
      label: string
    }>
  }
}

const ProcessorEdit: React.FunctionComponent<ProcessorEditProps> = props => {
  const id = parseInt(props.match.params.processorId, 10)
  const { addToast } = useToasts()

  const { data, loading: loadingQuery } = useQuery<{
    processor: ProcessorQueryData
  }, {
    processorId: Processor['id']
  }>(
    ProcessorQuery,
    {
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
      },
      variables: { processorId: id }
    }
  )

  const [updateProcessor, { loading: updating }] = useMutation<{}, Processor>(
    UpdateProcessor,
    {
      onCompleted: () => {
        addToast(
          `Processor was updated successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 2500 }
        )
        props.history.push(`${privateUrls.processors}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} occured.`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const handleSubmit = (values: ProcessorProfileValues) => {
    log.debug('Submit:', id, values)
    updateProcessor({
      variables: {
        id,
        ...values
      }
    }).catch(e => log.debug(e))
  }

  const loading = loadingQuery || updating
  const regions = data && data.processor.affiliate ? data.processor.affiliate.regions : []
  let initialData = {}
  if (data) {
    initialData = {
      ...data.processor
    }
  }
  return (
    <>
      {
        data && <ProcessorFormikForm
          onSubmit={handleSubmit}
          regions={regions}
          role='Processor'
          initialData={{
            ...initialData
          }}
        />
      }
      <DotSpinnerModal isOpen={loading} />
    </>
  )

}

export default ProcessorEdit
