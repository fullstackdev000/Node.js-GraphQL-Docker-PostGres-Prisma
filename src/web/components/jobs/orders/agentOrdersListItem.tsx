import AddCalendarSvg from '#veewme/web/assets/svg/add-calendar.svg'
import ActionBar, { Action, TooltippedIconButton } from '#veewme/web/common/orderListItem/actionBar'
import AddressCell from '#veewme/web/common/orderListItem/addressCell'
import ChartCell from '#veewme/web/common/orderListItem/chartCell'
import { ACTION_BAR_HEIGHT, ADDRESS_BAR_HEIGHT, ITEM_CELL_HEIGHT } from '#veewme/web/common/orderListItem/common'
import DataCell from '#veewme/web/common/orderListItem/dataCell'
import ImageCell from '#veewme/web/common/orderListItem/imageCell'
import ServicesCell from '#veewme/web/common/orderListItem/servicesCell'
import { StyledListItem } from '#veewme/web/common/orderListItem/styled'
import styled from '#veewme/web/common/styled-components'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'

import useActionsList from '#veewme/web/components/orders/orders/useActionsList'

const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: 260px minmax(195px, 1fr) 2fr 2fr;
  grid-template-rows: ${ADDRESS_BAR_HEIGHT} ${ITEM_CELL_HEIGHT} ${ACTION_BAR_HEIGHT};
  grid-template-areas: "img addr addr chart" "img data services chart" "img action action chart";
  grid-gap: 8px 8px;
  min-height: 180px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: 160px  minmax(195px, 1fr) 2fr 3fr;
    grid-template-areas: "addr addr addr chart" "img data services chart" "action action action chart";
    grid-gap: 4px 8px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 180px 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} auto auto auto;
    grid-template-areas: "addr addr " "data services" "chart chart" "action action";
    grid-gap: 4px 8px;
    padding-left: 4px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: 210px 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} auto auto auto auto;
    grid-template-areas: "addr addr" "img data" "services services"  "chart chart" "action action";
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_SM}) {
    grid-template-columns: 1fr;
    grid-template-rows: ${ADDRESS_BAR_HEIGHT} 150px auto auto auto;
    grid-template-areas: "addr" "img" "data" "services" "chart" "action";
  }
`

const buttonActions: Action[] = [
  {
    label: 'View',
    linkTo: '#'
  }
]

const iconButtons: TooltippedIconButton[] = [
  {
    icon: AddCalendarSvg,
    linkTo: '#',
    tooltip: 'Add Calendar'
  }
]

interface OrdersListItemProps {
  order: OrderQueryData
  termsURL: string
}

const ProcessorOrdersListItem: React.FunctionComponent<OrdersListItemProps> = props => {
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
        <ServicesCell
          order={props.order}
        />
        <ChartCell
          order={props.order}
          onFullStatsClick={() => null}
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

export default ProcessorOrdersListItem
