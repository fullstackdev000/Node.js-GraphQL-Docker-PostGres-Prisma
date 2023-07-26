import CheckMarkSvg from '#veewme/web/assets/svg/checkmark.svg'
import HideForRole from '#veewme/web/common/hideForRole'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import { OrderedService } from '#veewme/web/components/orders/types'
import { abstractAdminServiceCategory, getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import moment from 'moment'
import * as React from 'react'
import { rgbaToString } from '../formikFields/colorField'
import ProcessorModal from './processorModal'
import { StyledOrderItemText } from './styled'

import { Settings as SettingsIcon } from 'styled-icons/feather'

const StyledItem = styled.div `
  width: 100%;
  font-size: 13px;
  margin: 5px 0 3px 0;
  display: flex;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 3px 0 2px 0;
  }
`

const StyledCell = styled.div<{ completed?: boolean }> `
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${props => props.completed ? props.theme.colors.TEXT_UNSELECTED : props.theme.colors.TEXT_SELECTED};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    padding: 0 5px;
  }
`

const StyledNameCell = styled(StyledCell) `
  flex: 1;
  min-width: 0;
  margin-right: 10px;
  max-width: 45%;
`

const StyledCategoryCell = styled(StyledCell) `
  flex: 0 0 26px;
`

const StyledProcessorCell = styled(StyledCell)<{
  visible?: boolean
}> `
  margin-right: 4px;
  cursor: pointer;
  ${props => !props.visible && 'visibility: hidden'};

  svg {
    position: relative;
    top: -2px;
  }
`

const StyledDateCell = styled(StyledCell) `
  flex: 0 0 70px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    padding: 0 5px;
    flex: 0 0 60px;
  }
`

const StyledTimeCell = styled(StyledCell) `
  flex: 0 0 75px;
  padding-left: 7px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    flex: 0 0 60px;
  }
`

const StyledUnassignedText = styled(StyledOrderItemText) `
  color: ${props => props.theme.colors.LABEL_TEXT}
`

const StyledStatusCell = styled(StyledCell) `
  flex: 0 0 26px;
`

const StyledCategoryIcon = styled(props => <props.icon className={props.className}/>) `
  width: 16px;
  height: 15px;
  fill: ${props => rgbaToString(props.color)};
  color: ${props => rgbaToString(props.color)};
`

const StyledStatusIcon = styled(CheckMarkSvg)`
  width: 16px;
  height: 15px;
  fill: ${props => props.theme.colors.OK};
`

const ServiceName = styled(StyledOrderItemText)`
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow: hidden;
`

interface OrderServiceItemProps {
  service: OrderedService
  onStatusClick?: () => void
  photographerNote?: string
}

const ServiceItem: React.FunctionComponent<OrderServiceItemProps> = props => {
  const [processorModalVisible, toggleProcessorModal] = React.useState(false)
  const { service: {
      event,
      processor,
      service: { category, name, serviceType }
    }
  } = props

  const processorName = processor ? `${processor.user.firstName} ${processor.user.lastName}` : ''

  const icon = (
    <StyledCategoryIcon
      icon={getServiceCategoryIcon(serviceType === 'Admin' ? undefined : category.icon)}
      color={serviceType !== 'Admin' ? category.color : abstractAdminServiceCategory.color}
    />
  )

  return (
    <StyledItem>
      <StyledNameCell>
        {event && event.photographer
          ? (
            <>
              <HideForRole action='show' roles={['PHOTOGRAPHER']}>
                <ServiceName>
                  <Tooltipped tooltip={name}>
                    <span>{name}</span>
                  </Tooltipped>
                </ServiceName>
              </HideForRole>
              <HideForRole roles={['PHOTOGRAPHER']}>
                <StyledOrderItemText>
                  {event.photographer.user.firstName} {event.photographer.user.lastName}
                </StyledOrderItemText>
              </HideForRole>
            </>
          )
          :
          <StyledUnassignedText>
            Unassigned
          </StyledUnassignedText>
        }
      </StyledNameCell>
      <HideForRole roles={['PHOTOGRAPHER', 'AGENT']}>
        <StyledProcessorCell
          visible
          onClick={() => toggleProcessorModal(true)}
        >
          <Tooltipped tooltip={processorName || 'No Processor assigned'}>
            <div>
              <SettingsIcon size='16'/>
            </div>
          </Tooltipped>
        </StyledProcessorCell>
      </HideForRole>
      <StyledCategoryCell>
        <Tooltipped tooltip={name}>
          <div>
            {icon}
          </div>
        </Tooltipped>
      </StyledCategoryCell>
      <StyledDateCell>
        <StyledOrderItemText>
          {event && moment(event.start).format('MM/DD/yyyy')}
        </StyledOrderItemText>
      </StyledDateCell>
      <StyledTimeCell>
        <StyledOrderItemText>
          {event && moment(event.start).format('hh:mm A')}
        </StyledOrderItemText>
      </StyledTimeCell>
      <StyledStatusCell>
        {props.service.status === 'Completed' && <StyledStatusIcon />}
      </StyledStatusCell>
      {
        processorModalVisible && <ProcessorModal
          isOpen={processorModalVisible}
          toggleModal={toggleProcessorModal}
          processorId={processor ? processor.id : undefined}
          icon={icon}
          processorName={processorName}
          orderedService={props.service}

        />
      }
    </StyledItem>
  )
}

export default ServiceItem
