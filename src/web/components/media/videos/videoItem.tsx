// import { privateUrls } from '#veewme/lib/urls'
// import * as log from '#veewme/web/common/log'
import Tooltipped from '#veewme/web/common/tooltipped'
import copy from 'copy-to-clipboard'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import { useToasts } from 'react-toast-notifications'
import { UnreachableCaseError } from '../../../../lib/error'
import Button from '../../../common/buttons/basicButton'
import IconButton from '../../../common/buttons/iconButton'
import styled from '../../../common/styled-components'
import MediaDeleteBtn from '../mediaItemDeleteBtn'
import { MediaItem, MediaItemButtons, MediaItemInfo, MediaItemMain, TooltipContent } from '../styled'
import { OrderVideoBase } from '../types'

import Embed from '#veewme/web/assets/svg/embed.svg'
import Link from '#veewme/web/assets/svg/link.svg'
import { Download, InfoCircle, Move } from 'styled-icons/boxicons-regular'
import { Edit, Error } from 'styled-icons/boxicons-solid'
import { Play } from 'styled-icons/fa-solid'
// import { Link } from 'styled-icons/material'

// TODO: if design is accepted move colors to theme
const videosColors = {
  embed: '#a3d2cd',
  faux: '#efb4d3',
  hosted: '#f7dd9f',
  url: '#8da5bd'
}

const VideoItemWrapper = styled(MediaItem)<{ type: OrderVideoBase['type'] }>`
  border: 0 none;
  background: #eee;
  height: 125px;
  position: relative;
  margin-left: 22px;


  ${({ type }) => {
    switch (type) {
      case 'URL':
        return `
          background: ${videosColors.url};
        `
      case 'Faux':
        return `
          background: ${videosColors.faux};
        `
      case 'Embed':
        return `
          background: ${videosColors.embed};
        `
      case 'Hosted':
        return `
          background: ${videosColors.hosted};
        `
      default:
        throw new UnreachableCaseError(type)
    }
  }}
`

const TooltippedStyled = styled(Tooltipped)``

const InfoStyled = styled(InfoCircle)`
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 1;
  fill: #fff;
  cursor: pointer;
`

const thumbWidth = '220px'

const ThumAnddIconHolder = styled.div`
  display: flex;
  flex: 0 0 ${thumbWidth};
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px 0 0 4px;
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: none;
  }
`

const Thumb = styled(ThumAnddIconHolder)`
  &:after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    background: linear-gradient(40deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 0) 50%);
  }

  img {
    width: 100%;
    height: 125px;
    display: block;
    object-fit: cover;
  }
`

const IconHolder = styled(ThumAnddIconHolder)`
  svg {
    color: ${props => props.theme.colors.LIGHT_BLUISH_GREY};
  }
`

const ErrorHolder = styled.div`
  width: ${thumbWidth};
  display: flex;
  justify-content: center;
  position: relative;
  padding-right: 50px;

  &:after {
    position: absolute;
    top: 20px;
    left: calc(50% - 30px);
    content: '';
    display: block;
    width: 10px;
    height: 30px;
    background: #fff;
  }

  svg {
    fill: ${props => props.theme.colors.ALERT};
    z-index: 1;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    order: 1;
    width: auto;
    padding: 0 20px;

    &:after {
      left: calc(50% - 5px);
    }
  }
`

const VideoData = styled(MediaItemInfo)`
  flex: 1 0 auto;
  padding-top: 7px;
  padding-right: 15px;
  display: flex;
  align-items: center;

  div {
    overflow: hidden;
  }

  span {
    padding: 0 0 6px 0;
    text-transform: capitalize;
    font-size: 14px;
    color: ${props => props.theme.colors.FIELD_TEXT};

    span {
      display: inline-block;
      font-weight: 500;
      margin: 0;
      padding: 0;
    }

    &:first-child {
      color: ${props => props.theme.colors.FIELD_TEXT};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    justify-content: space-between;
  }
`

const Title = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

const IconButtons = styled.div`
  display: flex;
  height: 100%;
  width: 175px;
  align-items: center;
  padding: 0 25px;
  border: 1px dotted ${props => props.theme.colors.BORDER};
  border-width: 0 1px;

  button,
  a {
    margin-right: 8px;
    background: #fff;
    padding: 10px;
    width: 35px;
    height: 35px;
    border: 1px solid ${props => props.theme.colors.BORDER};
    border-radius: 5px;
    transition: opacity .5s;

    &:hover {
      opacity: 0.9;
    }

    &:last-child {
      margin-right: 0;
    }

    svg {
      fill: ${props => props.theme.colors.GREEN};
      width: 25px;
      height: 25px;
    }
  }
`

const ButtonsRight = styled(MediaItemButtons)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 0 25px;
  align-items: center;
  justify-content: center;

  a,
  button {
    width: 100%;
    margin: 5px 0;
    background: #fff;
    transition: border-color .5s;

    &:hover,
    &:active,
    &:focus {
      background: #fff !important;
    }
  }
`

const StyledMoveIcon = styled(Move)`
  position: absolute;
  padding: 0 5px 5px 5px;
  top: 0;
  left: -28px;
  fill: ${props => props.theme.colors.ICON_UNSELECTED};
  cursor: pointer;
`

const SortHandler = SortableHandle(StyledMoveIcon)

const VideoMain = styled(MediaItemMain)`
  padding: 0 25px;
  width: calc(100% - ${thumbWidth});
  display: grid;
  grid-template-columns: minmax(100px, 1fr) 175px 100px;
`

interface VideoItemProps extends RouteComponentProps {
  video: OrderVideoBase
  onDelete: (id: OrderVideoBase['id']) => void
}

const VideoItem: React.FunctionComponent<VideoItemProps> = props => {
  const { match: { url }, video } = props
  const handleDelete = React.useCallback(() => props.onDelete(video.id), [])
  const { addToast } = useToasts()
  const fauxPhotos = video.photos || []
  const firstFauxPhotoUrl = fauxPhotos.length ? fauxPhotos[0].thumbUrl : ''
  const thumbUrl = video.thumbUrl || firstFauxPhotoUrl

  const InfoTooltip = (
    <TooltippedStyled tooltip={<TooltipContent>{video.fileName && (<span>File name: {video.fileName}</span>)}<span>Upload date: {video.date}</span></TooltipContent>}>
      <InfoStyled size='30' />
    </TooltippedStyled>
  )

  const leftComponent = thumbUrl ? (
    <Thumb>
      <img src={thumbUrl} />
      {InfoTooltip}
    </Thumb>
  ) : (
    <IconHolder>
      <Play width='60' />
      {InfoTooltip}
    </IconHolder>
  )

  return (
    <VideoItemWrapper key={video.id} type={video.type}>
      <SortHandler size='28' title='Drag row into desired position' />
      {!video.error && leftComponent}
      <VideoMain>
        <VideoData>
          {video.error && <ErrorHolder><Error size='60'/></ErrorHolder>}
          <div>
            <Title><span>Label:</span> {video.label}</Title>
            <span><span>Type:</span> {video.type}</span>
            <span><span>Category:</span> {video.category.split(/(?=[A-Z])/).join(' ')}</span>
            <span><span>Appears:</span> {video.appearance}</span>
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
          {
            video.type === 'Embed' && (
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
        <ButtonsRight>
          <Button
            buttonTheme='primary'
            icon={Edit}
            label='Edit'
            to={`${url}/edit/${video.type}/${video.id}`}
          />
          <MediaDeleteBtn
            itemTitle={video.label}
            onDelete={handleDelete}
          />
        </ButtonsRight>
      </VideoMain>
    </VideoItemWrapper>
  )
}

const SortableVideoItem = SortableElement<VideoItemProps>(VideoItem)

export default withRouter(SortableVideoItem)
