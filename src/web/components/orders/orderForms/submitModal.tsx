import { privateUrls } from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

import { MeQuery } from '#veewme/graphql/types'
import { Me } from '#veewme/lib/graphql/queries'
import { useQuery } from '@apollo/react-hooks'

const StyledContent = styled.div`
  padding-bottom: 36px;
`

const StyledButtonsWrapper = styled.div `
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  & > * {
    margin-left: 16px;
  }
`

interface SubmitModalProps {
  isOpen: boolean
  invoiceLink: string
  propertiesListLink: string
  onToggle: () => void
  orderId?: number
}

const SubmitModal: React.FunctionComponent<SubmitModalProps> = props => {
  const { data } = useQuery<MeQuery>(Me, {
    fetchPolicy: 'cache-only'
  })

  const role = data && data.me.role
  const message = role === 'AFFILIATE' ?
    'A confirmation of this order has been sent to your client.'
    : 'A confirmation of this order has been sent to your email address.'

  return (
    <Modal isOpen={props.isOpen} onRequestClose={props.onToggle} title='Thank you for your order!'>
      <StyledContent>
        <p>{message}</p>
      </StyledContent>
      <StyledButtonsWrapper>
        <Button full buttonTheme='action' label='Go to Orders list' to={`${props.propertiesListLink}?allowRedirect`}/>
        {role === 'AGENT' && <Button buttonTheme='action' label='Show invoice' to={`${props.invoiceLink}?allowRedirect`}/>}
        {role === 'AFFILIATE' && (
          <Button
            full
            buttonTheme='info'
            label='Schedule...'
            to={`${privateUrls.orders}/order/${props.orderId}/calendar?allowRedirect`}
          />
        )}
      </StyledButtonsWrapper>
    </Modal>
  )
}

export default SubmitModal
