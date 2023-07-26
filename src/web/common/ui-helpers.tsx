import Button from '#veewme/web/common/buttons/basicButton'
import Modal from '#veewme/web/common/modal'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { formatPhoneNumber } from 'react-phone-number-input/input'
import { Check } from 'styled-icons/fa-solid'

const StyledFalseIcon = styled.span`
  &:after {
    display: block;
    content: '\\00d7';
    color: ${props => props.theme.colors.BUTTON_BORDER};
    text-align: center;
    font-size: 45px;
    font-weight: 400;
    line-height: 20px;
  }
`

const StyledCheckmark = styled(Check)`
  display: block;
  margin: auto;
  color: ${props => props.theme.colors.GREEN};
`

interface BooleanIconProps {
  value: boolean
  onClick?: () => void
}

export const BooleanIcon: React.FunctionComponent<BooleanIconProps> = ({ value }) => (
  value ? <StyledCheckmark size='20' /> : <StyledFalseIcon />
)

const StyledPhoneLink = styled.a`
  color: inherit;
`

interface PhoneLinkProps {
  value: string
}

export const PhoneLink: React.FunctionComponent<PhoneLinkProps> = ({
  value
}) => {
  const formattedPhoneNumber = formatPhoneNumber(value)
  return <StyledPhoneLink href={`tel: ${value}`} >{formattedPhoneNumber || '-'}</StyledPhoneLink>
}

const FallbackStyled = styled.div`
  color: ${props => props.theme.colors.ALERT};
  font-weight: 500;
`

export const NoAccessFallback: React.FC<{}> = props => (
  <Panel>
    <FallbackStyled>You don't have access to view this page.</FallbackStyled>
  </Panel>
)

const InternalNoteModal = styled(Modal)`
  color: ${props => props.theme.colors.FIELD_TEXT};
`

const InternalNoteModalContent = styled.div`
  max-width: 600px;
`

const StyledArticle = styled.p`
  font-size: 14px;
`

const ButtonHolder = styled.div<{
  alignRight?: boolean
}>`
  display: flex;
  justify-content: ${p => p.alignRight ? 'flex-end' : 'space-between'};
  align-items: center;
  min-width: 300px;
  margin-top: 40px;
`

const NoteButton = styled(props => <Button {...props}/>)`
  background: ${props => props.theme.colors.ORANGE};
  border-color:  ${props => props.theme.colors.ORANGE};

  &&&&:hover {
    background: ${props => props.theme.colors.ORANGE};
    border-color:  ${props => props.theme.colors.ORANGE};
  }
`

const CreditsAvailable = styled.div`
  font-size: 14px;

  span {
    font-weight: 500;
    color: ${props => props.theme.colors.GREEN};
  }
`

type ModalProps = React.ComponentProps<typeof Modal>
interface NoteModalProps extends Omit<ModalProps, 'onRequestClose' | 'children'> {
  note?: string
  toggleModal: (close: boolean) => void
  hideCredits?: boolean
  title: string
}

export const NoteModal: React.FC<NoteModalProps> = props => {

  return (props.note ? (
    <InternalNoteModal
      title={props.title}
      isOpen={props.isOpen}
      onRequestClose={() => props.toggleModal(false)}
      centerVertically={true}
      colorTheme='PAYMENT'
      background='LIGHT'
      showBorderRadius={false}
    >
      <InternalNoteModalContent>
        <StyledArticle>{props.note}</StyledArticle>
        <ButtonHolder alignRight={props.hideCredits} >
          {!props.hideCredits && <CreditsAvailable>Credit available: <span>$195.00</span></CreditsAvailable>}
          <NoteButton onClick={() => props.toggleModal(false)} buttonTheme='info' full label='OK' size='medium' />
        </ButtonHolder>
      </InternalNoteModalContent>
    </InternalNoteModal>
  ) : null)
}
