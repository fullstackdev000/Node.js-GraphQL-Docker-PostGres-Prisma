import Button, { BasicButtonProps } from '#veewme/web/common/buttons/basicButton'
import styled, { createGlobalStyle } from '#veewme/web/common/styled-components'
import * as React from 'react'
import ReactModal from 'react-modal'
import { RouteComponentProps, withRouter } from 'react-router-dom'

const GlobalModalStyles = createGlobalStyle`
  .ReactModal__Overlay {
    z-index: 100;
  }
`
const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SpinnerContainer = styled.div<{ size: number, isProcessComplete?: boolean }>`
  position: relative;
  width: ${props => props.size}px;
  ${props => props.isProcessComplete
    ? `
      opacity: 0;
      height: 0;
    `
    : `
      opacity: 1;
      height: ${props.size}px;
    `
  }
`

const Spinner = styled.div`
  position: absolute;
  width: 70%;
  height: 0;
  padding-top: 70%;
  animation: 2s linear 0s infinite normal none running spinner;
  margin: 15%;
  @keyframes spinner {
    100% {
      transform: rotate(360deg);
    }
  }
`

export const Dot = styled.div`
  position: absolute;
  height: 50%;
  width: 50%;
  background-color: ${props => props.theme.colors.GREEN};
  border-radius: 100%;
  @keyframes dot {
    0%, 100% {
      transform: scale(0);
    }
    50% {
        transform: scale(1);
    }
  }
`

const Dot1 = styled(Dot)`
  top: 0px;
  bottom: auto;
  animation: 2s linear 0s infinite normal none running dot;
`

const Dot2 = styled(Dot)`
  top: auto;
  bottom: 0px;
  animation: 2s linear -1s infinite normal none running dot;
`

export const Message = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.LABEL_TEXT};
  margin-top: 10px;
`

const Modal = styled(ReactModal)<{ invisibleModal: boolean }>`
  padding: 50px;
  position: absolute;
  z-index: 2000;
  &:focus {
    outline: none;
  }
  ${props => props.invisibleModal
    ? `
      background-color: transparent;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(255,255,255,0.65);
      display: flex;
      justify-content: center;
      align-items: center;    `
    : `
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      border-radius: 5px;
    `
  }
`

const ButtonsContainer = styled.div<{ isProcessComplete?: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  transition: 500ms;
  & > * {
    margin: 0 10px;
  }
  ${props => !props.isProcessComplete
    ? `
      opacity: 0;
      height: 0;
    `
    : `
      opacity: 1;
      height: auto;
    `
  }
`

interface DotSpinnerProps {
  className?: string
  isProcessComplete?: boolean
  message?: string
  size?: number
}

export const DotSpinner: React.FunctionComponent<DotSpinnerProps> = ({ size = 80, ...props }) => {
  return (
    <SpinnerWrapper className={props.className}>
      <SpinnerContainer size={size} isProcessComplete={props.isProcessComplete}>
        <Spinner>
          <Dot1 />
          <Dot2 />
        </Spinner>
      </SpinnerContainer>
      {props.message && <Message>{props.message}</Message>}
    </SpinnerWrapper>
  )
}

interface DotSpinnerModalProps extends DotSpinnerProps {
  buttons?: BasicButtonProps[]
  redirectDelay?: number
  invisibleModal?: boolean
  isOpen: boolean
  isProcessComplete?: boolean
  redirectOnProcessCompleteURL?: string
}

const RawDotSpinnerModal: React.FunctionComponent<DotSpinnerModalProps & RouteComponentProps> = ({ invisibleModal = false, ...props }) => {
  if (props.isProcessComplete && props.redirectOnProcessCompleteURL) {
    setTimeout(() => {
      props.history.push(props.redirectOnProcessCompleteURL || '')
    }, props.redirectDelay)
  }
  return (
    <Modal ariaHideApp={false} invisibleModal={invisibleModal} isOpen={props.isOpen} shouldFocusAfterRender={false} >
      <DotSpinner isProcessComplete={props.isProcessComplete} size={props.size} message={props.message} />
      {props.buttons
        && <ButtonsContainer isProcessComplete={props.isProcessComplete} >
          {props.buttons.map((buttonProps: BasicButtonProps) => (
            <Button {...buttonProps} key={buttonProps.label} />)
          )}
        </ButtonsContainer>
      }
      <GlobalModalStyles />
    </Modal>
  )
}

export const DotSpinnerModal = withRouter(RawDotSpinnerModal)
