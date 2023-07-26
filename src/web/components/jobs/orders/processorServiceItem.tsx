import {
  OrderedServicesConnectionQuery
} from '#veewme/gen/graphqlTypes'
import { privateUrls } from '#veewme/lib/urls'
import IconButton from '#veewme/web/common/buttons/iconButton'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import * as log from '#veewme/web/common/log'
import ItemDataLine from '#veewme/web/common/orderListItem/itemDataLine'
import styled from '#veewme/web/common/styled-components'
import { StyledCell, StyledRow } from '#veewme/web/common/table'
import Tooltipped from '#veewme/web/common/tooltipped'
import { NoteModal } from '#veewme/web/common/ui-helpers'
import { NoNullableFields, wrapLinkUrl } from '#veewme/web/common/util'
import { getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import * as React from 'react'
import { FilterStatus, statusColor } from './filtersBar'

import Note from '#veewme/web/assets/svg/important-note.svg'
import PublishIcon from '#veewme/web/assets/svg/publish.svg'
import UploadSvg from '#veewme/web/assets/svg/upload.svg'
import { CheckCircle } from 'styled-icons/boxicons-regular'

const InternalNoteButton = styled(props => <IconButton {...props} />)`
  ${props => props.disabled && 'pointer-events: none;'}
  ${props => props.disabled && `opacity: 0.2;`};

  & svg {
    fill: ${props => !props.disabled ? props.theme.colors.ORANGE : props.theme.colors.GREY};
  }
`

const StyledCategoryIcon = styled(props => <props.icon className={props.className}/>) `
  width: 30px;
  height: 30px;
  fill: ${props => rgbaToString(props.color)};
  color: ${props => rgbaToString(props.color)};
`

const StyledCustomRow = styled(StyledRow)<{
  status: FilterStatus
}>`
  td:last-child {
    border-right: 4px solid ${p => statusColor[p.status]}
  }

`

const StyledCustomCell = styled(StyledCell)`
  &:first-child {
    width: 60px;
    text-align: center;
  }

  &:last-child {
    width: 50px;
    text-align: center;
    vertical-align: middle;
  }
`
const StyledCheckCircle = styled(CheckCircle)`
  position: relative;
  left: -1px;
  fill: ${props => props.theme.colors.GREEN};
`

const ColumnContent = styled.div`
  display: flex;
  height: 72px;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;

  & > div {
    cursor: pointer;

    & + div {
      padding-top: 7px;
    }
  }
`

const MediaColumnContent = styled(ColumnContent)`
  flex-direction: row;
  justify-content: space-between;

  div + div {
    margin-left: 20px;
    padding: 0 0 0 20px;
    border-left: 2px solid ${props => props.theme.colors.GREY};
  }

  svg {
    fill: ${props => props.theme.colors.BLUE};
  }

`

const DownloadIconBox = styled.div`
  a {
    rotate: 180deg;

    svg {
      fill: #000;
    }
  }
`

const StyledUploadCell = styled(StyledCell)`
  width: 120px;
`

export type OrderedService = Exclude<NoNullableFields<OrderedServicesConnectionQuery['orderedServicesConnection']['orderedServices'][0]>, null>

interface ServiceItemProps {
  data: OrderedService
  onPublish: (id: number) => void
}

const ServiceItem: React.FunctionComponent<ServiceItemProps> = ({
  data,
  onPublish
}) => {
  const [isOpen, toggleModal] = React.useState<boolean>(false)
  const { category } = data.service
  const icon = (
    <StyledCategoryIcon
      icon={getServiceCategoryIcon(category.icon)}
      color={category.color}
    />
  )

  let photographerName = ''

  if (data.event) {
    const { firstName: photoFirstName, lastName: photoLastName } = data.event.photographer.user
    photographerName = `${photoFirstName} ${photoLastName}`
  }

  const isVideo = category.label === 'Video'
  let mediaUrl = `${privateUrls.realEstate}/${data.order.realEstate.id}/media`
  if (isVideo) {
    mediaUrl = mediaUrl + '/video'
  }

  const tourPublished = data.order.statuses.some(s => s === 'Published')
  const externalUploadUrl = wrapLinkUrl(data.processor.affiliate.externalUploadLink)
  return (
    <>
      <StyledCustomRow status={data.status}>
        <StyledCustomCell>
          <Tooltipped
            tooltip={category.label}
          >
            <div>
             {icon}
            </div>
          </Tooltipped>
        </StyledCustomCell>
        <StyledCustomCell>
          <ItemDataLine
            title={'Order ID: '}
            value={String(data.order.id)}
          />
          <ItemDataLine
            title={'Date: '}
            value={data.order.date}
          />
        </StyledCustomCell>
        <StyledCustomCell>
          {photographerName}
        </StyledCustomCell>
        <StyledCustomCell>
          {data.order.realEstate.agentPrimary.region.label}
        </StyledCustomCell>
        <StyledCustomCell>
          {data.order.realEstate.address}
        </StyledCustomCell>
        <StyledCustomCell>
          {data.service.name}
        </StyledCustomCell>
        <StyledCustomCell>
          {data.service.category.label}
        </StyledCustomCell>
        <StyledCustomCell>
          <ColumnContent>
            {
              data.processor.enableServiceDone && (
                <Tooltipped
                  tooltip='Mark as Done'
                >
                  <div onClick={() => log.debug('mark as done')}>
                    <StyledCheckCircle size='32' />
                  </div>
                </Tooltipped>
              )
            }
            {
              !tourPublished && data.processor.activatable && (
                <Tooltipped
                  tooltip='Publish'
                >
                  <div onClick={() => onPublish(data.order.id)}>
                    <PublishIcon width='28' height='28'/>
                  </div>
                </Tooltipped>
              )
            }
          </ColumnContent>
        </StyledCustomCell>
        <StyledUploadCell>
          <MediaColumnContent>
            {
              externalUploadUrl && (
                <DownloadIconBox>
                  <Tooltipped
                    tooltip='Download for Processing'
                  >
                    <IconButton
                      size='big'
                      Icon={UploadSvg}
                      castAs='a'
                      href={externalUploadUrl}
                      target='_blank'
                    />
                  </Tooltipped>
                </DownloadIconBox>
              )
            }
            <div>
              <Tooltipped
                tooltip='Upload completed to Order'
              >
                <IconButton
                  size='big'
                  Icon={UploadSvg}
                  castAs='link'
                  to={mediaUrl}
                />
              </Tooltipped>
            </div>
          </MediaColumnContent>
        </StyledUploadCell>
        <StyledCustomCell>
          <InternalNoteButton
            onClick={() => toggleModal(prev => !prev)}
            size='big'
            Icon={Note}
            disabled={!data.message}
          />
        </StyledCustomCell>
      </StyledCustomRow>
      <NoteModal
        title='Processor Note'
        isOpen={isOpen}
        toggleModal={() => toggleModal(prev => !prev)}
        note={data.message}
        hideCredits
      />
    </>
  )
}

export default ServiceItem
