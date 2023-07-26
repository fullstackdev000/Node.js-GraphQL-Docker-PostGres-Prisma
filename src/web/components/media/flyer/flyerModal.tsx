import { FlyerLayoutName } from '#veewme/gen/graphqlTypes'
import * as React from 'react'
import Button from '../../../common/buttons/basicButton'
import Modal from '../../../common/modal'
import styled from '../../../common/styled-components'
import FlyerLayoutIcon from './flyerLayoutIcon'
import FlyerList from './flyerList'

const ModalContent = styled.div``

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 30px;

  button {
    margin-left: 8px;
  }
`

const FlyerLayoutBtn = styled(FlyerLayoutIcon)<{ isActive: boolean }>`
  position: relative;
  max-width 180px;
  margin-bottom: 20px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }

  svg {
    width: 100%;
  }
`

interface FlyerModalProps {
  onLayoutSave: (value: FlyerLayoutName) => void
  currentLayoutName: FlyerLayoutName
  toggleModal: () => void
  modalVisible: boolean
}

const FlyerLayoutModal: React.FunctionComponent<FlyerModalProps> = ({
  modalVisible,
  onLayoutSave,
  currentLayoutName,
  toggleModal
}) => {
  const [ selectedLayoutName, selectLayout ] = React.useState<FlyerLayoutName>(currentLayoutName)

  return (
    <Modal
      isOpen={modalVisible}
      onRequestClose={toggleModal}
      title='Select Flyer Layout'
      centerVertically={true}
    >
      <ModalContent>
        <FlyerList selectedLayoutName={selectedLayoutName}>
          {
            (layoutName, isActive) => (
              <FlyerLayoutBtn
                key={layoutName}
                isActive={isActive}
                onClick={() => { selectLayout(layoutName) }}
                layoutName={layoutName}
              />
            )
          }
        </FlyerList>
        <ButtonWrapper>
          <Button
            label='Cancel'
            onClick={toggleModal}
          />
          <Button
            buttonTheme='action'
            label='Save'
            onClick={() => {
              toggleModal()
              onLayoutSave(selectedLayoutName)
            }}
          />
        </ButtonWrapper>
      </ModalContent>
    </Modal>
  )
}

export default React.memo(FlyerLayoutModal)
