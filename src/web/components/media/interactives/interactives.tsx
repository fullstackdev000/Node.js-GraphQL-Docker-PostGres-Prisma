import {
  DeleteMediaInteractiveMutationVariables,
  MediaManagementInteractivesQuery,
  MediaManagementInteractivesQueryVariables
} from '#veewme/gen/graphqlTypes'
import { DeleteMediaInteractive, MediaManagementInteractives } from '#veewme/lib/graphql/queries'
// import * as log from '#veewme/web/common/log'
import HideForRole from '#veewme/web/common/hideForRole'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoAccessFallback } from '#veewme/web/common/ui-helpers'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Button from '../../../common/buttons/basicButton'
import { Header, ListTitle, ListWrapper } from '../styled'
import InteractivesList from './interactivesList'

import { Plus } from 'styled-icons/fa-solid'

interface InteractivesData {
  mediaInteractives: NoNullableArrayItems<NoNullableFields<MediaManagementInteractivesQuery['mediaInteractives']>>
}

const Interactives: React.FC<RouteComponentProps> = props => {
  const { addToast } = useToasts()
  const { match: { url } } = props
  const { realEstateId } = useParams<{ realEstateId: string }>() // route params always are strings
  const { data, loading } = useQuery<InteractivesData, MediaManagementInteractivesQueryVariables>(MediaManagementInteractives, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const [deleteInteractive, { loading: deleting }] = useMutation<{}, DeleteMediaInteractiveMutationVariables>(DeleteMediaInteractive, {
    awaitRefetchQueries: true,
    onCompleted: e => addToast('Item has been deleted.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }),
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    refetchQueries: ['MediaManagementInteractives']
  })

  return (
    <ListWrapper>
      <Header>
        <ListTitle inline={true}>
          Interactives
          <Button
            buttonTheme='action'
            full={true}
            icon={Plus}
            to={`${url}/add`}
          />
        </ListTitle>
      </Header>
      <InteractivesList
        interactives={data && data.mediaInteractives || []}
        onDelete={id => deleteInteractive({ variables: { id } })}
      />
      <DotSpinnerModal isOpen={loading || deleting} />
    </ListWrapper>
  )
}

const InteractivesAuth: React.FC<RouteComponentProps> = props => {
  return (
    <HideForRole
      action='hide'
      roles={['AGENT']}
      fallback={<NoAccessFallback />}
    >
      <Interactives {...props} />
    </HideForRole>
  )
}

export default InteractivesAuth
