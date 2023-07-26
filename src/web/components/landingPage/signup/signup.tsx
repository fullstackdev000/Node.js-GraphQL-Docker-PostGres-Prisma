import * as React from 'react'
import styled from '../../../common/styled-components'
import dimensions from '../../layout/publicPage/dimensionsConstants'
import AccountForm from './accountForm'
import AccountTypeSelection from './accountTypeSelection'
import { AccountType, OnAccountTypeChange } from './types'

const PageWrapper = styled.div`
  padding: 50px ${dimensions.pageMargin};
`

interface SignUpProps {}

interface SignUpState {
  selectedAccount: AccountType
  showAccountForm: boolean
}

class SignUp extends React.PureComponent<SignUpProps, SignUpState> {
  state: SignUpState = {
    selectedAccount: 'affiliate/photographer',
    showAccountForm: false
  }

  handleAccountTypeChange: OnAccountTypeChange = selectedAccount => {
    this.setState({ selectedAccount })
  }

  toggleFormDisplay = () => {
    this.setState({ showAccountForm: !this.state.showAccountForm })
  }

  render () {
    return (
      <PageWrapper>
        {this.state.showAccountForm
          ? <AccountForm selectedAccount={this.state.selectedAccount} onClick={this.toggleFormDisplay} />
          : <AccountTypeSelection
            selectedAccount={this.state.selectedAccount}
            onAccountTypeChange={this.handleAccountTypeChange}
            onNextClick={this.toggleFormDisplay}
          />
        }
      </PageWrapper>
    )
  }
}

export default SignUp
