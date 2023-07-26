import { Region } from '#veewme/graphql/types'
import { Photographer as PhotographerQuery, UpdatePhotographer } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Photographer } from '../common/types'
import { PhotographerFormikForm, PhotographerProfileValues } from '../profile/profileForm'

interface PhotographerQueryData extends Photographer {
  affiliate: {
    regions: Array<Pick<Region, 'id' | 'label'>>
  }
}

interface PhotographerAccountProps extends RouteComponentProps {
  id: Photographer['id']
}

const PhotographerAccount: React.FunctionComponent<PhotographerAccountProps> = props => {
  const id = props.id
  const { addToast } = useToasts()

  const { client, data, loading: loadingQuery } = useQuery<{
    photographer: PhotographerQueryData
  }, {
    photographerId: Photographer['id']
  }>(
    PhotographerQuery,
    {
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
      },
      variables: { photographerId: id }
    }
  )

  const [updatePhotographer, { loading: updating }] = useMutation<{
    updatePhotographer: Photographer
  }, Photographer>(
    UpdatePhotographer,
    {
      onCompleted: result => {
        addToast(
          `Photographer was updated successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 2500 }
        )
        props.history.push(`${privateUrls.panel}?allowRedirect`)
        // Update cache so e.g. header doesn't display stale user data
        client.writeData({ data: {
          me: {
            __typename: 'Account',
            firstName: result.updatePhotographer.user.firstName,
            lastName: result.updatePhotographer.user.lastName
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

  const handleSubmit = (values: PhotographerProfileValues) => {
    log.debug('Submit:', id, values)
    updatePhotographer({
      variables: {
        id,
        ...values
      }
    }).catch(e => log.debug(e))
  }

  const loading = loadingQuery || updating
  const regions = data && data.photographer.affiliate ? data.photographer.affiliate.regions : []

  return (
    <>
      {
        data && <PhotographerFormikForm
          onSubmit={handleSubmit}
          regions={regions}
          role='Photographer'
          accountEdit
          initialData={data.photographer}
        />
      }
      <DotSpinnerModal isOpen={loading} />
    </>
  )

}

export default PhotographerAccount
