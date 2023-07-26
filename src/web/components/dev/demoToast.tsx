import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import Button from '../../common/buttons/basicButton'
import styled from '../../common/styled-components'

const Wrapper = styled.div`
  padding: 30px;

  button {
    margin-top: 20px;
  }
`

const ToastExample: React.FunctionComponent = () => {
  const { addToast } = useToasts()

  const ErrorExample = (
    <strong>Some error</strong>
  )

  const SomeLongerContent = (
    <span>
      Lorem ipsum <strong>dolor</strong> sit amet, consectetur adipiscing elit.
      Vestibulum tempus velit vitae pellentesque finibus. Etiam at metus ante. Phasellus sollicitudin in purus a commodo.
      Quisque suscipit eros erat. Nulla mauris elit, vehicula et sodales sit amet, henedrerit eu tellus.
      Nullam ac est vitae nulla egestas lacinia.
    </span>
  )

  return (
    <Wrapper>
      <Button buttonTheme='action' label='Success auto-hide after 5s and pause on hover' onClick={() => addToast('Congratulations. Success messsage', { appearance: 'success', autoDismiss: true, pauseOnHover: true })} />
      <br />
      <Button buttonTheme='action' label='Success long text no auto-hide' onClick={() => addToast(SomeLongerContent, { appearance: 'success', autoDismiss: false })} />
      <br />
      <Button buttonTheme='info' label='Info auto-hide  after 5s' onClick={() => addToast('Auto-hide toast', { appearance: 'info', autoDismiss: true })} />
      <br />
      <Button buttonTheme='alert' label='Error auto-hide after 10s' onClick={() => addToast(ErrorExample, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })} />
    </Wrapper>
  )
}

export default ToastExample
