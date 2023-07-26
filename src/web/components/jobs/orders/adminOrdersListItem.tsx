import OrderDetailsSvg from '#veewme/web/assets/svg/order-details.svg'
import TourGallerySvg from '#veewme/web/assets/svg/tour-gallery.svg'
import ActionBar, { Action, TooltippedIconButton } from '#veewme/web/common/orderListItem/actionBar'
import AddressCell from '#veewme/web/common/orderListItem/addressCell'
import AffiliateCell from '#veewme/web/common/orderListItem/affiliateCell'
import { ACTION_BAR_HEIGHT, ADDRESS_BAR_HEIGHT, ITEM_CELL_HEIGHT } from '#veewme/web/common/orderListItem/common'
import ContactCell from '#veewme/web/common/orderListItem/contactCell'
import DataCell from '#veewme/web/common/orderListItem/dataCell'
import ImageCell from '#veewme/web/common/orderListItem/imageCell'
import { StyledListItem, StyledUserCog, StyledUserLock } from '#veewme/web/common/orderListItem/styled'
import styled from '#veewme/web/common/styled-components'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'

import useActionsList from '#veewme/web/components/orders/orders/useActionsList'

const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: 260px minmax(195px, 1fr) 2fr 2fr;
  grid-template-rows: ${ADDRESS_BAR_HEIGHT} ${ITEM_CELL_HEIGHT} ${ACTION_BAR_HEIGHT};
  grid-template-areas: "img addr addr addr" "img data contact affiliate" "img action action action";
  grid-gap: 8px 8px;
  min-height: 180px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: 160px  minmax(195px, 1fr) 2fr 2fr;
    grid-template-areas: "addr addr addr addr" "img data contact affiliate" "action action action action";
    grid-gap: 4px 8px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 180px 1fr 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} auto auto;
    grid-template-areas: "addr addr addr" "data contact affiliate" "action action action";
    grid-gap: 4px 8px;
    padding-left: 4px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: 210px 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} auto auto auto auto;
    grid-template-areas: "addr addr" "img data" "contact contact" "affiliate affiliate" "action action";
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_SM}) {
    grid-template-columns: 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} 150px auto auto auto;
    grid-template-areas: "addr" "img" "data" "contact" "affiliate" "action";
  }
`

const buttonActions: Action[] = [
  {
    label: 'Preview',
    linkTo: '#'
  },
  {
    label: 'Media',
    linkTo: '#'
  }
]

const iconButtons: TooltippedIconButton[] = [
  {
    icon: StyledUserCog,
    linkTo: '#',
    tooltip: 'Edit Agent'
  }, {
    icon: TourGallerySvg,
    linkTo: '#',
    tooltip: 'Tour Gallery Agent'
  },
  {
    icon: StyledUserLock,
    linkTo: '#',
    tooltip: 'Login As Agent'
  },
  {
    icon: OrderDetailsSvg,
    linkTo: '#',
    tooltip: 'Order Details'
  }
]

interface AdminOrdersListItemProps {
  order: OrderQueryData
  termsURL: string
  onActionClick: () => void
}

const AdminOrdersListItem: React.FunctionComponent<AdminOrdersListItemProps> = props => {
  const actions = useActionsList(props.order)
  return (
    // TODO restore getting color from status after Order resolver is ready
    <StyledListItem /*status={props.order.status}*/>
      <StyledGrid>
        <ImageCell
          order={props.order}
          termsURL={props.termsURL}
        />
        <AddressCell
          order={props.order}
        />
        <DataCell
          order={props.order}
        />
        <ContactCell
          order={props.order}
        />
        <AffiliateCell
          order={props.order}
          onClick={() => null}
        />
        <ActionBar
          order={props.order}
          buttonActions={buttonActions}
          dropDownButtonLabel='Action'
          dropDownActions={actions}
          tooltippedIconButtons={iconButtons}
        />
      </StyledGrid>
    </StyledListItem>
  )
}

export default AdminOrdersListItem
