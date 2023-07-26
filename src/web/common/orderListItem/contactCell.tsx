import EditSvg from '#veewme/web/assets/svg/edit.svg'
import ItemDataLine from '#veewme/web/common/orderListItem/itemDataLine'
import { PhoneLink } from '#veewme/web/common/ui-helpers'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'

import IconButton from '../buttons/iconButton'
import { StyledAgentWrapper, StyledCellEditIconContainer, StyledContactCell } from './styled'

interface ContactCellProps {
  order: OrderQueryData
}

const ContactCell: React.FunctionComponent<ContactCellProps> = props => {
  const agent = props.order.realEstate.agentPrimary
  return (
    <StyledContactCell>
      <StyledAgentWrapper>
        <ItemDataLine
          title={'Agent: '}
          value={`${agent.user.firstName} ${agent.user.lastName}`}
        />
      </StyledAgentWrapper>
      <ItemDataLine
        title={'Broker: '}
        value={agent.brokerage ? agent.brokerage.companyName : '-'}
      />
      <ItemDataLine
        title={'Office: '}
        value={<PhoneLink value={agent.phone || ''} />}
      />
      <ItemDataLine
        title={'Mobile: '}
        value={<PhoneLink value={agent.phoneMobile || ''} />}
      />
      <StyledCellEditIconContainer>
        <IconButton
          castAs='link'
          size='small'
          Icon={EditSvg}
          to={`clients/agent/${agent.id}/edit`}
        />
      </StyledCellEditIconContainer>
    </StyledContactCell>
  )
}
export default ContactCell
