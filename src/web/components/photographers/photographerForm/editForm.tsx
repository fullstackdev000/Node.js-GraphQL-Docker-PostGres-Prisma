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

type PhotographerEditProps = RouteComponentProps<{ photographerId: string }>
interface PhotographerQueryData extends Photographer {
  affiliate: {
    regions: Array<{
      id: number // TODO use graphql types
      label: string
    }>
  }
}

const PhotographerEdit: React.FunctionComponent<PhotographerEditProps> = props => {
  const id = parseInt(props.match.params.photographerId, 10)
  const { addToast } = useToasts()

  const { data, loading: loadingQuery } = useQuery<{
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

  const [updatePhotographer, { loading: updating }] = useMutation<{}, Photographer>(
    UpdatePhotographer,
    {
      onCompleted: () => {
        addToast(
          `Photographer was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
        )
        props.history.push(`${privateUrls.photographers}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} occured.`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
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
  let initialData = {}
  if (data) {
    initialData = {
      ...data.photographer
    }
  }
  return (
    <>
      {
        data && <PhotographerFormikForm
          onSubmit={handleSubmit}
          regions={regions}
          role='Photographer'
          initialData={{
            ...initialData
          }}
        />
      }
      <DotSpinnerModal isOpen={loading} />
    </>
  )

}

export default PhotographerEdit
