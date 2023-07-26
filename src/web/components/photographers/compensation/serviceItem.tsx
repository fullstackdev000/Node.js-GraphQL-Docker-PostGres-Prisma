import * as React from 'react'
import { StyledCell, StyledRow } from '../../../common/styledTable'
import { ServicesData } from './compensationTable'

interface ServiceItemProps {
  service: ServicesData['orderedServices'][0]
}

const ServiceItem: React.FunctionComponent<ServiceItemProps> = ({
  service: orderedService
}) => {
  const { event, service } = orderedService
  return (
    <StyledRow>
      <StyledCell>
        {service.name}
      </StyledCell>
      <StyledCell>
        {service.category && service.category.label || '-'}
      </StyledCell>
      <StyledCell>
        {service.serviceType || '-'}
      </StyledCell>
      <StyledCell>
        {orderedService.order.realEstate.agentPrimary.region.label}
      </StyledCell>
      <StyledCell>
        {event ? `${event.photographer.user.firstName} ${event.photographer.user.lastName}` : 'Not assigned'}
      </StyledCell>
      <StyledCell>
        ${service.defaultCompensation || '-'}
      </StyledCell>
      <StyledCell>
        {/* TODO Photographer's pay should be taken from Photographer assigned to Order */}
        Take from Order
        {/* service.photographerPay ? `$${service.photographerPay}` : '' */}
      </StyledCell>
    </StyledRow>
  )
}

export default ServiceItem
