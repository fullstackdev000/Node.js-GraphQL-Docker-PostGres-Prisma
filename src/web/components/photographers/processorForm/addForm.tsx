import { MeQuery } from '#veewme/gen/graphqlTypes'
import { CreateProcessor, Me } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Processor } from '../common/types'
import { ProcessorFormikForm, ProcessorProfileValues } from '../profile/profileForm'

type MeData = NoNullableFields<MeQuery>

const ProcessorAdd: React.FunctionComponent<RouteComponentProps> = props => {
  const { addToast } = useToasts()

  const { data, loading: loadingMe } = useQuery<MeData>(Me)

  const [createProcessor, { loading }] = useMutation<{}, Omit<Processor, 'id'>>(
    CreateProcessor,
    {
      onCompleted: () => {
        addToast(
          `Processor was created successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
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
    log.debug('Submit:', values)
    createProcessor({
      variables: {
        ...values
      }
    }).catch(e => log.debug(e))
  }

  const loadingData = loading || loadingMe
  const loader = loadingData && <DotSpinnerModal isOpen={loadingData} />
  const regions = data && data.me.account.__typename === 'Affiliate' ? data.me.account.regions : []

  return (
    <>
      {
        data && <ProcessorFormikForm
          regions={regions}
          onSubmit={handleSubmit}
          role='Processor'
        />
      }
      {loader}
    </>
  )

}

export default ProcessorAdd
