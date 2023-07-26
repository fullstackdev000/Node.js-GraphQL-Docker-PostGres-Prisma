import Button from '#veewme/web/common/buttons/basicButton'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const ModalContent = styled.div`
  p {
    margin-bottom: 10px;
    font-size: 15px;
    color: ${props => props.theme.colors.LABEL_TEXT};

    + p {
      margin-bottom: 20px;
      font-size: 13px;
      color: ${props => props.theme.colors.DARK_GREY};
    }
  }

  strong {
    font-weight: 500;
  }

  div {
    display: flex;
    justify-content: flex-end;

    button {
      margin-left: 8px;
    }
  }
`

interface DateClickWarningProps {
  onRequestClose: () => void
  onDelete: () => void
  isOpen: boolean
}

const DateClickWarning: React.FunctionComponent<DateClickWarningProps> = props => {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        title='Event Delete Confirmation'
        colorTheme='ALERT'
        background='LIGHT'
        centerVertically={true}
        showBorderRadius={false}
      >
      <ModalContent>
        <p>
          Are you sure you want to delete this event?
        </p>
        <p>
          This will unassign photographer and date/time from service!
        </p>
        <div>
          <Button
            buttonTheme='primary'
            label='Cancel'
            onClick={props.onRequestClose}
          />
          <Button
            buttonTheme='alert'
            label='Delete'
            full
            onClick={() => props.onDelete()}
          />
        </div>
      </ModalContent>
      </Modal>
    </>
  )
}

export default DateClickWarning
