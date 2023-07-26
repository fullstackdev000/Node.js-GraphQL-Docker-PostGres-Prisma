import {
  CreatePhotographerMutationVariables,
  MeQuery
} from '#veewme/gen/graphqlTypes'
import { CreatePhotographer, Me } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { PhotographerFormikForm, PhotographerProfileValues } from '../profile/profileForm'

type MeData = NoNullableFields<MeQuery>

const PhotographerAdd: React.FunctionComponent<RouteComponentProps> = props => {
  const { addToast } = useToasts()

  const { data, loading: loadingMe } = useQuery<MeData>(Me)

  const [createPhotographer, { loading }] = useMutation<{}, CreatePhotographerMutationVariables>(
    CreatePhotographer,
    {
      onCompleted: () => {
        addToast(
          `Photographer was created successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
        )
        props.history.push(`${privateUrls.photographers}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} occured.`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const handleSubmit = (values: PhotographerProfileValues) => {
    if (!data) {
      return
    }
    log.debug('Submit:', values)
    createPhotographer({
      variables: {
        ...values,
        affiliateId: data.me.accountId
      }
    }).catch(e => log.debug(e))
  }

  const loadingData = loading || loadingMe
  const loader = <DotSpinnerModal isOpen={loadingData} />
  const regions = data && data.me.account.__typename === 'Affiliate' ? data.me.account.regions : []

  return (
    <>
      {
        data && <PhotographerFormikForm
          regions={regions}
          onSubmit={handleSubmit}
          role='Photographer'
        />
      }
      {loader}
    </>
  )

}

export default PhotographerAdd
