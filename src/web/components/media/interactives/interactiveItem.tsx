import { UnreachableCaseError } from '#veewme/lib/error'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Button from '../../../common/buttons/basicButton'
import MediaDeleteBtn from '../mediaItemDeleteBtn'
import { MediaItem, MediaItemButtons, MediaItemInfo, MediaItemMain, MediaItemType } from '../styled'
import { OrderInteractiveBase } from '../types'

import FloorPlan from '#veewme/web/assets/svg/floor-plan.svg'
import { Edit } from 'styled-icons/boxicons-solid'
import { Play } from 'styled-icons/fa-solid'

export const InteractiveIcon: React.FunctionComponent<Pick<OrderInteractiveBase, 'type'>> = ({
  type
}) => {
  let contentToShow: JSX.Element
  switch (type) {
    case 'FLOORPLAN_PHOTOS':
      contentToShow = <FloorPlan width='50' />
      break
    case 'EMBEDDED':
      contentToShow = <Play width='40' />
      break
    default:
      throw new UnreachableCaseError(type)
  }

  return (
    <>{contentToShow}</>
  )
}

interface InteractivesListProps extends RouteComponentProps {
  interactive: OrderInteractiveBase
  onDelete: (id: OrderInteractiveBase['id']) => void
}

const InteractivesList: React.FunctionComponent<InteractivesListProps> = props => {
  const { interactive, match: { url } } = props
  const handleDelete = React.useCallback(() => props.onDelete(interactive.id), [])

  return (
    <MediaItem key={interactive.id}>
      <MediaItemType>
        <InteractiveIcon type={interactive.type} />
      </MediaItemType>
      <MediaItemMain>
        <MediaItemInfo>
          <span>{interactive.label}</span>
          <span>Interactive</span>
        </MediaItemInfo>
        <MediaItemButtons>
          <Button
            buttonTheme='primary'
            icon={Edit}
            label='Edit'
            to={`${url}/${interactive.id}`}
          />
          <MediaDeleteBtn
            itemTitle={interactive.label}
            onDelete={handleDelete}
          />
        </MediaItemButtons>
      </MediaItemMain>
    </MediaItem>
  )
}

export default withRouter(InteractivesList)
