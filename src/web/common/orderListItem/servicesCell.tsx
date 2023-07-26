import * as log from '#veewme/web/common/log'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import ServiceItem from './serviceItem'
import { StyledServicesCell, StyledServicesList } from './styled'

interface ServicesCellProps {
  className?: string
  order: OrderQueryData
  photographerNote?: string
}

const ServicesCell: React.FunctionComponent<ServicesCellProps> = props => (
  <StyledServicesCell className={props.className}>
    <Scrollbars>
      <StyledServicesList>
        {(props.order.services).map(service => (
          <ServiceItem
            key={service.id}
            service={service}
            onStatusClick={() => log.debug('status click')}
            photographerNote={props.order.notesForPhotographer || ''}
          />
        ))}
      </StyledServicesList>
    </Scrollbars>
  </StyledServicesCell>
)

export default ServicesCell
