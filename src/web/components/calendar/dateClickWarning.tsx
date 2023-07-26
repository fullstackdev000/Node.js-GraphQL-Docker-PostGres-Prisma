import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const ModalContent = styled.div`
`

interface DateClickWarningProps {
  onRequestClose: () => void
  isOpen: boolean
}

const DateClickWarning: React.FunctionComponent<DateClickWarningProps> = props => {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        title='Events Limit'
        colorTheme='ALERT'
        background='LIGHT'
        centerVertically={true}
        showBorderRadius={false}
      >
        <ModalContent>
          You can't add more than one event.
        </ModalContent>
      </Modal>
    </>
  )
}

export default DateClickWarning
