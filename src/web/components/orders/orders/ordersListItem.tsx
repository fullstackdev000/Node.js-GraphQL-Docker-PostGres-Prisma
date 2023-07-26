import * as log from '#veewme/web/common/log'

import { privateUrls } from '#veewme/lib/urls'
import AddOnSvg from '#veewme/web/assets/svg/add-on-order.svg'
import AddCalendarSvg from '#veewme/web/assets/svg/calendar-clock-icon.svg'
import Note from '#veewme/web/assets/svg/important-note.svg'
import LoginAsSvg from '#veewme/web/assets/svg/login-as.svg'
import OrderDetailsSvg from '#veewme/web/assets/svg/order-detail.svg'
import Button from '#veewme/web/common/buttons/basicButton'
import IconButton from '#veewme/web/common/buttons/iconButton'
import { templateOptions, tourDisablePreviewSuffix } from '#veewme/web/common/consts'
import DeleteConfirmation from '#veewme/web/common/deleteConfirmation'
import HideForRole from '#veewme/web/common/hideForRole'
import { useRole } from '#veewme/web/common/hooks'
import Modal from '#veewme/web/common/modal'
import ActionBar, { Action, TooltippedIconButton } from '#veewme/web/common/orderListItem/actionBar'
import AddressCell from '#veewme/web/common/orderListItem/addressCell'
import { ACTION_BAR_HEIGHT, ADDRESS_BAR_HEIGHT, ITEM_CELL_HEIGHT } from '#veewme/web/common/orderListItem/common'
import ContactCell from '#veewme/web/common/orderListItem/contactCell'
import DataCell from '#veewme/web/common/orderListItem/dataCell'
import ImageCell from '#veewme/web/common/orderListItem/imageCell'
import ServicesCell from '#veewme/web/common/orderListItem/servicesCell'
import { StyledListItem } from '#veewme/web/common/orderListItem/styled'
import styled from '#veewme/web/common/styled-components'
import { wrapLinkUrl } from '#veewme/web/common/util'
import * as React from 'react'

import { OrderQueryData } from '../types'
import useActionsList from './useActionsList'

import PublishIcon from '#veewme/web/assets/svg/publish.svg'
import UploadSvg from '#veewme/web/assets/svg/upload.svg'

const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: 260px minmax(220px, 1fr) 2fr 2fr;
  grid-template-rows: ${ADDRESS_BAR_HEIGHT} ${ITEM_CELL_HEIGHT} ${ACTION_BAR_HEIGHT};
  grid-template-areas: "img addr addr logistics" "img data contact logistics" "img action action action";
  min-height: 172px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: 160px  minmax(195px, 1fr) 2fr 3fr;
    grid-template-areas: "img addr addr logistics" "img data contact logistics" "img action action action";
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 180px 1fr 2fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} auto auto;
    grid-template-areas: "addr addr addr" "data contact logistics" "action action action";
    padding-left: 4px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: 210px 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} auto auto auto auto;
    grid-template-areas: "addr addr" "img data" "contact contact" "logistics logistics" "action action";
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_SM}) {
    grid-template-columns: 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} 150px auto auto auto;
    grid-template-areas: "addr" "img" "data" "contact" "logistics" "action";
  }
`

const StyledServicesCell = styled(ServicesCell) `
  margin-top: 8px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin-top: 0;
  }
`

export const StyledNoteButton = styled(props => <IconButton {...props} />)`
  & svg {
    fill: ${props => props.theme.colors.ORANGE};
  }
`

export const StyledMailButton = styled(props => <IconButton {...props} />)`
  & svg {
    fill: ${props => props.theme.colors.GREEN};
  }
`

const AgentNoteIcon = styled(Note)`
  fill: ${props => props.theme.colors.ALERT};
}
`

const ButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
`

const ModalContent = styled.div`
  width: 400px;
`

const StyledUploadIcon = styled(UploadSvg)`
  width: 25px;
  height: 25px;
  fill: #000;
`

interface TooltippedIconButtonExtended extends TooltippedIconButton {
  skip?: boolean
}

interface OrdersListItemProps {
  order: OrderQueryData
  termsURL: string
  onDeleteClick: () => void
  onUpdatePayment: (id: number) => void
  onPublish?: (id: number) => void
  canPublish?: boolean
}

const OrdersListItem: React.FunctionComponent<OrdersListItemProps> = props => {
  const [noteModalVisible, toggleNoteModal] = React.useState(false)
  const payment = props.order.payments[0]
  const unpaidPayment = payment && (payment.type === 'COMPANY_PAY' && payment.status === 'UNPAID')
  const tourPublished = props.order.statuses.some(s => s === 'Published')
  const role = useRole()
  const { canPublish = true } = props
  const publishBtnVisible = canPublish && !tourPublished && role !== 'AGENT'
  const externalUploadLink = props.order.realEstate.agentPrimary.affiliate.externalUploadLink

  const allIconButtons: TooltippedIconButtonExtended[] = [
    {
      hideForRoles: ['AFFILIATE', 'AGENT'],
      icon: PublishIcon,
      onClick: publishBtnVisible ? () => props.onPublish && props.onPublish(props.order.id) : undefined,
      tooltip: 'Publish your order'
    },
    {
      hideForRoles: ['AFFILIATE', 'AGENT'],
      // TODO: type ActionBar to accept styled(SomeSVG) icons
      icon: StyledUploadIcon as unknown as React.SVGFactory,
      linkTo: externalUploadLink ? wrapLinkUrl(externalUploadLink) : '',
      openInNewWindow: true,
      skip: !props.order.realEstate.agentPrimary.affiliate.externalUploadLink,
      tooltip: 'Upload for processing'
    },
    {
      icon: LoginAsSvg,
      // onClick: () => log.debug('Agent login'),
      tooltip: 'Agent Login'
    }, {
      hideForRoles: ['PHOTOGRAPHER', 'AGENT'],
      icon: OrderDetailsSvg,
      linkTo: `${privateUrls.orders}/order/${props.order.id}/details`,
      tooltip: 'Order Details'
    }, {
      hideForRoles: ['AGENT', 'PHOTOGRAPHER'],
      icon: AddCalendarSvg,
      linkTo: `${privateUrls.orders}/order/${props.order.id}/calendar`,
      tooltip: 'Schedule'
    }, {
      hideForRoles: ['PHOTOGRAPHER'],
      icon: AddOnSvg,
      onClick: () => log.debug('Add-on order'),
      tooltip: 'Add-on Order'
    }
  ]

  if (props.order.notesForPhotographer) {
    allIconButtons.push({
      // TODO: type ActionBar to accept styled(SomeSVG) icons
      icon: AgentNoteIcon as unknown as React.SVGFactory,
      onClick: () => toggleNoteModal(true),
      tooltip: 'Note to photographer(s)'
    })
  }
  const iconButtons = allIconButtons.filter(b => !b.skip)

  const agentTemplateId = props.order.realEstate.agentPrimary.templateId || templateOptions[0].value
  const { templateId: orderTemplateId } = props.order
  const templateId = orderTemplateId || agentTemplateId

  let tourLinkLabel = !tourPublished ? 'Preview' : 'View'
  tourLinkLabel = role === 'AFFILIATE' ? 'View' : tourLinkLabel
  let tourLink = `/tour/${props.order.realEstate.tourId}/l/l${templateId}`
  tourLink = role === 'AFFILIATE' ? `${tourLink}?${tourDisablePreviewSuffix}` : tourLink
  const actions: Action[] = React.useMemo(() => {
    return ([
      {
        label: tourLinkLabel,
        linkTo: props.order.realEstate.tourId ? tourLink : '#',
        openInNewWindow: true
      }, {
        label: 'Media',
        linkTo: `${privateUrls.realEstate}/${props.order.realEstate.id}/media`,
        tooltip: 'Media Management'
      }
    ])
  }, [props, tourPublished])

  const actionsList = useActionsList(props.order, {
    onDelete: props.onDeleteClick,
    onPublish: () => props.onPublish && props.onPublish(props.order.id)
  })

  const status = props.order.statusToDisplay || 'Unpublished'

  return (
    <StyledListItem
      status={status}
    >
      <StyledGrid>
        <ImageCell
          order={props.order}
          termsURL={props.termsURL}
          onPublish={() => props.onPublish && props.onPublish(props.order.id)}
          publishBtnVisible={publishBtnVisible}
        />
        <AddressCell
          order={props.order}
        />
        <DataCell
          order={props.order}
        />
        <HideForRole roles={['AGENT']}>
          <ContactCell
            order={props.order}
          />
        </HideForRole>
        <StyledServicesCell
          order={props.order}
        />
        <ActionBar
          order={props.order}
          buttonActions={actions}
          dropDownButtonLabel='Actions'
          dropDownActions={actionsList}
          tooltippedIconButtons={iconButtons}
          onPaidClick={unpaidPayment ?
            () => props.onUpdatePayment(payment.id)
            : undefined
          }
        />
      </StyledGrid>
      <Modal
        background='LIGHT'
        colorTheme='ALERT'
        title='Note to photographer(s)!'
        centerVertically
        isOpen={noteModalVisible}
        onRequestClose={() => toggleNoteModal(false)}
      >
        <ModalContent>
          {props.order.notesForPhotographer}
          <ButtonHolder>
            <Button onClick={() => toggleNoteModal(false)} buttonTheme='alert' full label='OK' size='small' />
          </ButtonHolder>
        </ModalContent>
      </Modal>
    </StyledListItem>
  )
}

type OrdersListItemWithDeleteWarningProps = Omit<OrdersListItemProps, 'onDeleteClick'> & {
  onDelete: (id: number) => void
}
const OrdersListItemWithDeleteWarning: React.FunctionComponent<OrdersListItemWithDeleteWarningProps> = props => {
  return (
    <DeleteConfirmation
      onConfirm={() => props.onDelete(props.order.id)}
      message='Are you sure you want to delete this item?'
    >
      {toggleDeleteConfirmation => (<OrdersListItem {...props} onDeleteClick={toggleDeleteConfirmation} />)}
    </DeleteConfirmation>
  )
}
export default OrdersListItemWithDeleteWarning
