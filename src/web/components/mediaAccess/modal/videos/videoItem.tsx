import IconButton from '#veewme/web/common/buttons/iconButton'
// import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { OrderVideoBase } from '#veewme/web/components/media/types'
import copy from 'copy-to-clipboard'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import { IconButtons } from '../styled'

import Embed from '#veewme/web/assets/svg/embed.svg'
import Link from '#veewme/web/assets/svg/link.svg'
import { Download } from 'styled-icons/boxicons-regular'

const VideoItemWrapper = styled.div`
  border: 2px solid ${props => props.theme.colors.BORDER};
  border-radius: 4px;
  margin: 10px 0;
`

const VideoData = styled.div`
  flex: 1 0 auto;

  div {
    margin-right: 15px;
  }

  span {
    display: block;
    padding-top: 2px;
    text-transform: capitalize;
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.colors.LABEL_TEXT};

    &:first-child {
      padding-top: 0;
      font-size: 14px;
      color: ${props => props.theme.colors.FIELD_TEXT};
    }

  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    justify-content: space-between;
  }
`

const VideoMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 25px;
`

type Video = Omit<OrderVideoBase, 'date'>

interface VideoItemProps {
  video: Video
}

const VideoItem: React.FunctionComponent<VideoItemProps> = props => {
  const { video } = props
  const { addToast } = useToasts()

  return (
    <VideoItemWrapper>
      <VideoMain>
        <VideoData>
          <div>
            <span>Label: {video.label}</span>
            <span>Type: {video.type}</span>
            <span>Category: {video.category}</span>
            <span>Appears: {video.appearance}</span>
          </div>
        </VideoData>
        <IconButtons>
          {
            video.type !== 'Embed' && (
              <IconButton
                castAs='button'
                Icon={Link}
                size='big'
                type='button'
                onClick={() => {
                  copy(video.url || '-')
                  addToast(
                    'URL copied', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 }
                  )
                }}
              />
            )
          }
          {video.type === 'Embed' && (
            <IconButton
              castAs='button'
              Icon={Embed}
              size='big'
              type='button'
              onClick={() => {
                copy(video.embeddedCode || '-')
                addToast(
                  'Code copied', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 }
                )
              }}
            />
          )
          }
          {
            video.type !== 'Embed' && (
              <IconButton
                castAs='a'
                Icon={Download}
                size='big'
                href={video.url || ''}
                download
              />
            )
          }
        </IconButtons>
      </VideoMain>
    </VideoItemWrapper>
  )
}

export default VideoItem
