import IconButton from '#veewme/web/common/buttons/iconButton'
import { InteractiveIcon } from '#veewme/web/components/media/interactives/interactiveItem'
import { MediaItem, MediaItemInfo, MediaItemMain, MediaItemType } from '#veewme/web/components/media/styled'
import { OrderInteractiveBase, OrderInteractiveDetails } from '#veewme/web/components/media/types'
import copy from 'copy-to-clipboard'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import { IconButtons } from '../styled'

import { Code } from 'styled-icons/boxicons-regular'
import { Link } from 'styled-icons/material'

export type InteractiveItemData = OrderInteractiveBase & Pick<OrderInteractiveDetails, 'url' | 'embeddedCode'>

interface InteractiveItemProps {
  interactive: InteractiveItemData
}

const InteractiveItem: React.FunctionComponent<InteractiveItemProps> = ({ interactive }) => {
  const { addToast } = useToasts()

  return (
    <MediaItem key={interactive.id} showShadow={false}>
      <MediaItemType>
        <InteractiveIcon type={interactive.type} />
      </MediaItemType>
      <MediaItemMain>
        <MediaItemInfo>
          <span>{interactive.label}</span>
          <span>Interactive</span>
        </MediaItemInfo>
        <IconButtons>
          <IconButton
            castAs='button'
            Icon={Link}
            size='big'
            type='button'
            onClick={() => {
              copy(interactive.url || '-')
              addToast(
                'URL copied', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 }
              )
            }}
          />
          <IconButton
            castAs='button'
            Icon={Code}
            size='big'
            type='button'
            onClick={() => {
              copy(interactive.embeddedCode || `-`)
              addToast(
                'Embedded code copied', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 }
              )
            }}
          />
        </IconButtons>
      </MediaItemMain>
    </MediaItem>
  )
}

export default InteractiveItem
