import * as React from 'react'
import Button from './buttons/basicButton'
import Modal from './modal'
import styled from './styled-components'

const ModalContent = styled.div`
  strong {
    font-weight: 500;
  }

  & > div {
    display: flex;
    justify-content: flex-end;

    button {
      margin-left: 8px;
    }
  }
`

export const Message = styled.div`
  font-size: 15px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  margin-bottom: 20px;
`

type ToggleModal = () => void
export interface DeleteConfirmationProps {
  message: JSX.Element | string
  onConfirm: () => void
  children: (toggleConfirmationModal: ToggleModal) => React.ReactNode // render prop pattern
  disableSubmitBtn?: boolean
  submitBtnLabel?: string
}

export interface DeleteConfirmationState {
  showDeleteConfirmation: boolean
}

class DeleteConfirmation extends React.Component<DeleteConfirmationProps, DeleteConfirmationState> {
  state: DeleteConfirmationState = {
    showDeleteConfirmation: false
  }

  toggleDeleteConfirmation = () => {
    this.setState(prev => ({
      showDeleteConfirmation: !prev.showDeleteConfirmation
    }))
  }

  handleDelete = () => {
    this.toggleDeleteConfirmation()
    this.props.onConfirm()
  }

  render () {
    return (
      <>
        {/* render prop pattern */}
        {this.props.children(this.toggleDeleteConfirmation)}
        <Modal
          isOpen={this.state.showDeleteConfirmation}
          onRequestClose={this.toggleDeleteConfirmation}
          title='Delete confirmation'
          centerVertically={true}
          colorTheme='ALERT'
          background='LIGHT'
          showBorderRadius={false}
        >
          <ModalContent>
            <Message>
              {this.props.message}
            </Message>
            <div>
              <Button
                buttonTheme='primary'
                label='Cancel'
                onClick={this.toggleDeleteConfirmation}
              />
              <Button
                buttonTheme='alert'
                label={this.props.submitBtnLabel || 'Delete'}
                full
                disabled={this.props.disableSubmitBtn}
                onClick={() => this.handleDelete()}
              />
            </div>
          </ModalContent>
        </Modal>
      </>
    )
  }
}

export default DeleteConfirmation
