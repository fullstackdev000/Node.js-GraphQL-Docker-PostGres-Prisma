import {
  MediaManagementInteractiveQuery,
  MediaManagementInteractiveQueryVariables,
  UpdateMediaInteractiveMutationVariables
} from '#veewme/gen/graphqlTypes'
import { MediaManagementInteractive, UpdateMediaInteractive } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'

import { privateUrls } from '#veewme/lib/urls'
// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { OrderInteractiveDetails } from '../types'
import InteractiveForm from './interactiveForm'

type InteractiveData = NoNullableFields<MediaManagementInteractiveQuery>
interface RouteParams {
  interactiveId: string
  realEstateId: string
}

const EditInteractive: React.FunctionComponent<RouteComponentProps> = props => {
  const { interactiveId, realEstateId } = useParams<RouteParams>()
  const { addToast } = useToasts()
  const { data, loading } = useQuery<InteractiveData, MediaManagementInteractiveQueryVariables>(MediaManagementInteractive, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    variables: {
      id: Number(interactiveId)
    }
  })

  const [editInteractive, { loading: upadating }] = useMutation<{}, UpdateMediaInteractiveMutationVariables>(UpdateMediaInteractive, {
    onCompleted: () => {
      addToast('Interactive has been edited successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      const redirectUrl = `${privateUrls.realEstate}/${realEstateId}/media/interactive`
      props.history.push(redirectUrl)
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  const initialValues = React.useMemo(() => {
    return data && {
      ...data.mediaInteractive,
      photos: data.mediaInteractive.files.map(f => ({
        fullUrl: f.file.path,
        id: f.id,
        label: f.label
      }))
    }
  }, [data])

  return (
    <>
      {
        data && <InteractiveForm
          data={initialValues}
          onSubmit={(values: OrderInteractiveDetails) => editInteractive({
            variables: {
              ...values,
              files: values.photos ? values.photos.map(f => ({
                file: f.id ? undefined : f.file,
                id: f.id!,
                label: f.label
              })) : [],
              id: Number(interactiveId)
            }
          })}
        />
      }
      <DotSpinnerModal isOpen={loading || upadating} />
    </>
  )
}

export default EditInteractive
