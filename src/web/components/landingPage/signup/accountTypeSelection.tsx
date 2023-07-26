import * as React from 'react'
import { Camera } from 'styled-icons/boxicons-solid/Camera'
import { Building } from 'styled-icons/fa-solid/Building'
import { Home } from 'styled-icons/material/Home'
import man from '../../../assets/img/signupMan.png'
import Logo from '../../../assets/svg/logo.svg'
import { AffiliateDetails } from './accountDetails'
import {
  AccountOptionWrapper,
  AccountTypePage,
  IconWrapper,
  LogoContainer,
  NextButton,
  PersonContainer
} from './styled'
import { AccountType, OnAccountTypeChange } from './types'

const AffiliateOptionDescription: React.FunctionComponent = () => (
  <p>
    You are independent and want to stay that way. We get it. With our content management and delivery placement
    you will manage an entire turnkey real estate marketing operation by creating spectacular single property website tours
    for your real estate clients. One shop or multi photographer outfits, all are welcome.
  </p>
)

const AgentOptionDescription: React.FunctionComponent = () => (
  <p>
    You are a DIY kind of guy/gal! Our platform will help you effortlessly create gorgeous single property websites for
    your listings using your photos and/or video as content.
  </p>
)

const BrokerOptionDescription: React.FunctionComponent = () => (
  <p>
    You are progressive boutique brokerage and want to manage and capture your media in-house.
    Give your agents a way to shine and your listings a consistent and enganing exposure.
  </p>
)

interface AccountProps {
  onAccountTypeChange: OnAccountTypeChange
  selectedAccount: string
}

interface AccountTypeProps extends AccountProps {
  onNextClick: () => void
}

interface AccountOptionProps extends AccountProps {
  value: AccountType
}

const AccountOption: React.FunctionComponent<AccountOptionProps> = props => (
  <AccountOptionWrapper
    isSelected={props.value === props.selectedAccount}
    onClick={() => props.onAccountTypeChange(props.value)}
  >
    {props.children}
  </AccountOptionWrapper>
)

const AccountTypeSelection: React.FunctionComponent<AccountTypeProps> = props => {
  return (
    <AccountTypePage>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <PersonContainer>
        <img src={man} />
        <p>Who are you?</p>
      </PersonContainer>
      <AccountOption
        selectedAccount={props.selectedAccount}
        onAccountTypeChange={props.onAccountTypeChange}
        value='affiliate/photographer'
      >
        <IconWrapper><Camera /></IconWrapper>
        <h5>Affiliate / Photographer</h5>
        <AffiliateOptionDescription />
      </AccountOption>
      <AccountOption
        selectedAccount={props.selectedAccount}
        onAccountTypeChange={props.onAccountTypeChange}
        value='agent'
      >
        <IconWrapper><Home /></IconWrapper>
        <h5>Agent</h5>
        <AgentOptionDescription />
      </AccountOption>
      <AccountOption
        selectedAccount={props.selectedAccount}
        onAccountTypeChange={props.onAccountTypeChange}
        value='broker'
      >
        <IconWrapper><Building /></IconWrapper>
        <h5>Broker</h5>
        <BrokerOptionDescription />
      </AccountOption>
      <NextButton label='Next' onClick={props.onNextClick} full buttonTheme='action' size='big' />
      {props.selectedAccount === 'affiliate/photographer' && <AffiliateDetails/>}
    </AccountTypePage>
  )
}

export default AccountTypeSelection
