import { Region } from '#veewme/graphql/types'
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

interface ProcessorQueryData extends Processor {
  affiliate: {
    regions: Array<Pick<Region, 'id' | 'label'>>
  }
}

interface ProcessorAccountProps extends RouteComponentProps {
  id: Processor['id']
}

const ProcessorAccount: React.FunctionComponent<ProcessorAccountProps> = props => {
  const id = props.id
  const { addToast } = useToasts()

  const { client, data, loading: loadingQuery } = useQuery<{
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

  const [updateProcessor, { loading: updating }] = useMutation<{
    updateProcessor: Processor
  }, Processor>(
    UpdateProcessor,
    {
      onCompleted: result => {
        addToast(
          `Processor was updated successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 2500 }
        )
        props.history.push(`${privateUrls.panel}?allowRedirect`)
        // Update cache so e.g. header doesn't display stale user data
        client.writeData({ data: {
          me: {
            __typename: 'Account',
            firstName: result.updateProcessor.user.firstName,
            lastName: result.updateProcessor.user.lastName
          }
        }})
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

  return (
    <>
      {
        data && <ProcessorFormikForm
          onSubmit={handleSubmit}
          regions={regions}
          role='Processor'
          accountEdit
          initialData={data.processor}
        />
      }
      <DotSpinnerModal isOpen={loading} />
    </>
  )

}

export default ProcessorAccount
