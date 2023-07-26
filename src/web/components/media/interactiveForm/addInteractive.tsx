import {
  CreateMediaInteractiveMutationVariables
} from '#veewme/gen/graphqlTypes'
import { CreateInteractive } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
// import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation } from '@apollo/react-hooks'

import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { OrderInteractiveDetails } from '../types'
import InteractiveForm from './interactiveForm'

const AddInteractive: React.FC<RouteComponentProps> = props => {
  const { addToast } = useToasts()
  const { realEstateId } = useParams<{ realEstateId: string }>() // route params always are strings
  const [addInteractive, { loading }] = useMutation<{}, CreateMediaInteractiveMutationVariables>(CreateInteractive, {
    onCompleted: () => {
      addToast('Interactive has been added successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      const redirectUrl = `${privateUrls.realEstate}/${realEstateId}/media/interactive`
      props.history.push(redirectUrl)
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      <InteractiveForm
        onSubmit={(values: OrderInteractiveDetails) => {
          const photos = values.photos || []
          delete values.photos
          const variables = {
            ...values,
            files: photos.map(f => ({
              file: f.file,
              label: f.label
            })),
            realEstateId: Number(realEstateId)
          }

          log.debug('variables', variables)

          addInteractive({
            variables
          }).catch(e => null)
        }}
      />
      <DotSpinnerModal isOpen={loading} />
    </>
  )
}

export default AddInteractive
