import ListHeaderItem from '#veewme/web/common/listHeaderItem'
import styled from '#veewme/web/common/styled-components'
import { StyledHeaderCell, StyledTable } from '#veewme/web/common/table'
import * as React from 'react'
import ServiceItem, { OrderedService } from './processorServiceItem'

const Wrapper = styled.div`
  margin-top: 20px
`

export interface OrdersListProps {
  services: OrderedService[]
  onPublish: (id: number) => void
}

const OrdersList: React.FunctionComponent<OrdersListProps> = props => (
  <Wrapper>
    <StyledTable>
      <tbody>
        <tr>
          <StyledHeaderCell>
            <ListHeaderItem
              label=''
            />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Order ID/Date' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Photographer' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Region' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Address' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Product/Service' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Category' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Media' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Notes' />
          </StyledHeaderCell>
        </tr>
        {props.services.map(service => (
          <ServiceItem
            key={service.id}
            data={service}
            onPublish={props.onPublish}
          />
        ))}
      </tbody>
    </StyledTable>
  </Wrapper>
)

export default OrdersList
