import { Role } from '#veewme/gen/graphqlTypes'
import * as log from '#veewme/web/common/log'
import PaymentModal from '#veewme/web/common/payment'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import PurchaseModal from './creditsPurchaseModal'
import { ButtonContainer } from './headerDropDown'

const Wrapper = styled(ButtonContainer).attrs({
  as: 'section'
})`
  position: relative;
  padding: 2px 15px 0 15px;
  display: flex;
  max-width: 138px;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background-color: ${props => props.theme.colors.HEADER_BACKGROUND};
  border-left: 1px solid ${props => props.theme.colors.BORDER};
  flex: 1 0 auto;
`
const AddButtonSize = 24

const AddButton = styled.span`
  display: block;
  position: absolute;
  top: 3px;
  right: -18px;
  width: ${AddButtonSize}px;
  height: ${AddButtonSize}px;
  border-radius: 4px;
  border: 2px solid #fff;
  font-size: 22px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
`

const CreditsStyled = styled.div`
  display: flex;
  position: relative;
  box-sizing: border-box;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  width: 100%;
  padding: 7px 5px;
  background: green;
  margin: 4px 0;
  color: #fff;
  font-size: 11px;
  line-height: 1;
  background-color: ${props => props.theme.colors.GREEN};

  & > ${AddButton} {
    background-color: ${props => props.theme.colors.GREEN};
  }

  & + & {
    background-color: ${props => props.theme.colors.BLUE};

     ${AddButton} {
      background-color: ${props => props.theme.colors.BLUE};
    }
  }
`

const MainContent = styled.div<{
  addRightPadding: boolean
}>`
  padding-top: 3px;
  ${props => props.addRightPadding && 'padding-right: 15px;'}
`

const CreditsValue = styled.span`
  padding-right: 10px;
  font-size: 17px;
  font-weight: 500;
`

interface CreditsProps {
  value: number
  hideAddButton?: boolean
  onAddClick: () => void
}

const Credits: React.FC<CreditsProps> = props => {
  return (
    <CreditsStyled>
      {props.children}
      <CreditsValue>{props.value}</CreditsValue>
      {/* TODO decide whether button should be link */}
      {!props.hideAddButton && <AddButton onClick={props.onAddClick}>&#x0002B;</AddButton>}
    </CreditsStyled>
  )
}

interface CreditsBoxProps {
  role: Role
}

const CreditsBox: React.FC<CreditsBoxProps> = ({
  role
}) => {
  const isAgent = role === `AGENT`
  const [isPurchaseModalOpen, togglePurchaseModal] = React.useState<boolean>(false)
  const [isCheckoutModalOpen, toggleCheckoutModal] = React.useState<boolean>(false)
  const [price, setPrice] = React.useState(0)

  log.debug(price)

  return (
    <Wrapper>
      <MainContent addRightPadding={!isAgent}>
        <Credits
          value={42}
          hideAddButton={isAgent}
          onAddClick={() => {
            togglePurchaseModal(true)
          }}
        >
          Tour Credits
        </Credits>
        <Credits
          value={14}
          hideAddButton={isAgent}
          onAddClick={() => {
            togglePurchaseModal(true)
          }}
        >
          Media Credits
        </Credits>
      </MainContent>
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onRequestClose={() => togglePurchaseModal(false)}
        onSubmit={vals => {
          setPrice(vals)
          setTimeout(() => {
            toggleCheckoutModal(true)
          }, 400)
        }}
      />
      <PaymentModal
        isOpen={isCheckoutModalOpen}
        toggleModal={v => toggleCheckoutModal(v)}
        amount={price}
        hideSplitPayment
        paymentType='GENERIC'
      />
    </Wrapper>
  )
}

export default CreditsBox
