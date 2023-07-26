import * as React from 'react'
import { DefaultToast, DefaultToastContainer, ToastContainerProps, ToastProps } from 'react-toast-notifications'
import styled from './styled-components'

// Overrides toast positioning. To support 'bottom-*' positioning options this component have to be customized
const StyledToastContainer = styled.div`
  & > div {
    top: 100px;
    font-size: 16px;
  }
`

export const CustomToastContainer: React.FunctionComponent<ToastContainerProps> = ({ children, ...props }) => (
  <StyledToastContainer>
    <DefaultToastContainer {...props}>
      {children}
    </DefaultToastContainer>
  </StyledToastContainer>
)

const StyledToast = styled.div`
  & > div > div {
    div + div:not(:last-child) {
      padding: 10px 25px 10px 15px;
      font-size: 15px;
      max-width: calc(100% - 30px);
    }

    div:last-child[role] {
      position: absolute;
      top: 4px;
      right: 0;
    }
  }
`

export const CustomToast: React.FunctionComponent<ToastProps> = ({ children, ...props }) => (
  <StyledToast>
    <DefaultToast {...props}>
      {children}
    </DefaultToast>
  </StyledToast>
)
