import MapPin from '#veewme/web/assets/svg/map-pin.svg'
// import * as log from '#veewme/web/common/log'
import HideForRole from '#veewme/web/common/hideForRole'
import { StyledMailButton, StyledNoteButton } from '#veewme/web/components/orders/orders/ordersListItem'
import { OrderQueryData } from '#veewme/web/components/orders/types'
import * as React from 'react'
import styled from '../styled-components'
import NoteModal from './agentNoteModal'
import { StyledAddressCell, StyledAddressMarker, StyledAddressTitle, StyledIconWrapper } from './styled'

import MailSvg from '#veewme/web/assets/svg/mail.svg'
import Pin from '#veewme/web/assets/svg/pin.svg'

// https://developers.google.com/maps/documentation/urls/guide#constructing-valid-urls
const googleMapsSearchQuery = 'https://www.google.com/maps/search/?api=1&'

const StyledPinIcon = styled(props => <props.icon className={props.className}/>)`
  width: 20px;
  height: 20px;
  fill: ${props => props.theme.colors.LABEL_TEXT}
  &:hover {
    fill: ${props => props.theme.colors.MAP_PIN}
  }
`

const StyledLeftSide = styled.div`
  display: flex;
  max-width: calc(100% - 60px);
  align-items: center;
  flex: 1 1 auto;
`

const StyledRightSide = styled.div`
  display: flex;
  flex: 0 1 60px;
  align-items: center;
  justify-content: flex-end;
`

interface AddressCellProps {
  order: OrderQueryData
}

const AddressCell: React.FunctionComponent<AddressCellProps> = props => {
  const { address } = props.order.realEstate
  const [ noteModalVisible, toggleNoteModal ] = React.useState(false)
  return (
    <StyledAddressCell>
      <StyledLeftSide>
        <StyledAddressTitle>
          {address}
        </StyledAddressTitle>
        <StyledAddressMarker
          target='_blank'
          href={googleMapsSearchQuery + encodeURIComponent(address)}
        >
          <StyledPinIcon
            icon={MapPin}
          />
        </StyledAddressMarker>
      </StyledLeftSide>
      <StyledRightSide>
        <HideForRole roles={['AGENT']}>
          <StyledIconWrapper>
            <StyledMailButton
              type='button'
              castAs='a'
              size='small'
              Icon={MailSvg}
              href={`mailto:${props.order.realEstate.agentPrimary.user.email}`}
            />
          </StyledIconWrapper>
        </HideForRole>
        <HideForRole roles={['PHOTOGRAPHER', 'AGENT']}>
          <StyledIconWrapper>
            <StyledNoteButton
              type='button'
              castAs='button'
              size='small'
              Icon={Pin}
              onClick={() => toggleNoteModal(true)}
            />
          </StyledIconWrapper>
        </HideForRole>
        <NoteModal
          isOpen={noteModalVisible}
          toggleModal={toggleNoteModal}
          agentId={props.order.realEstate.agentPrimary.id}
          note={props.order.realEstate.agentPrimary.internalNote || ''}
        />
      </StyledRightSide>
    </StyledAddressCell>
  )
}
export default AddressCell
