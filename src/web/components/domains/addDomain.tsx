import {
  CreateDomainMutationVariables,
  TopLevelDomainsQuery as TopLevelDomainsQueryResponse
} from '#veewme/gen/graphqlTypes'
import { CreateDomain, TopLevelDomains } from '#veewme/lib/graphql/queries'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'

import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import { Domain } from './'
import Form from './addDomainForm'

const AddDomain: React.FunctionComponent = () => {
  const [domainAdded, setDomainAdded] = React.useState(false)
  const { addToast } = useToasts()

  const { data: topLevelDomains, loading: loadingTopLevelDomains } = useQuery<TopLevelDomainsQueryResponse>(
    TopLevelDomains,
    {
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
      }
    }
  )

  const [ createDomain, { loading: adding } ] = useMutation<{}, CreateDomainMutationVariables>(
    CreateDomain,
    {
      awaitRefetchQueries: true,
      onCompleted: () => {
        addToast('Domain has been added.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 })
        setDomainAdded(true)
      },
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
      },
      refetchQueries: ['Domains']
    }
  )

  const loading = loadingTopLevelDomains || adding
  const topLevelDomainsOptions = topLevelDomains ? topLevelDomains.getTopLevelDomainsPrice.map(d => ({
    currency: d.currency || 'USD',
    name: d.topLevelDomain,
    price: d.price || 0
  })) : []

  return (
    <>
      <Form
        topDomains={topLevelDomainsOptions}
        domainAdded={domainAdded}
        onSubmit={(values: Pick<Domain, 'existing' | 'url'>) => {
          log.debug(values)
          createDomain({
            variables: {
              ...values
            }
          }).catch(e => log.debug(e))
        }}
      />
      <DotSpinnerModal isOpen={loading} />
    </>
  )
}

export default AddDomain
