import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { useState } from 'react'
import Button from '../../common/buttons/basicButton'
import Modal from '../../common/modal'
import styled from '../../common/styled-components'

const StyledWrapperDiv = styled.div`
  margin: 5px 10px;
`

const StyledP = styled.div`
  padding-bottom: 35px;
`

const Section = styled.section`
  display: flex;
  flex: 1 0 100%;
  flex-wrap: wrap;
  padding: 25px;

  h3 {
    width: 100%;
    flex: 1 0 auto;
    margin-bottom: 10px;
  }

  p {
    margin: 10px 0;
  }
`

export const ModalExample: React.FunctionComponent<{}> = () => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <StyledWrapperDiv>
      <Modal isOpen={isOpen} onRequestClose={() => toggleModal(prev => !prev)} title='Modal title'>
        <StyledP>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </StyledP>
        <Button buttonTheme='action' label='Test' onClick={() => log.debug('modal 1 content clicked')}/>
      </Modal>
      <Button buttonTheme='action' label='Open modal' onClick={() => toggleModal(prev => !prev)}/>
    </StyledWrapperDiv>
  )
}

export const ModalExample2: React.FunctionComponent<{}> = () => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <StyledWrapperDiv>
      <Modal
        background='LIGHT'
        centerVertically={true}
        isOpen={isOpen}
        onRequestClose={() => toggleModal(prev => !prev)}
        title='Some title'
      >
        <StyledP>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </StyledP>
        <Button buttonTheme='action' label='Test' onClick={() => log.debug('modal 2 content clicked')}/>
      </Modal>
      <Button buttonTheme='action' label='Open modal (vertically centered, light background)' onClick={() => toggleModal(prev => !prev)}/>
    </StyledWrapperDiv>
  )
}

export const ModalExample3: React.FunctionComponent<{}> = () => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <StyledWrapperDiv>
      <Modal
        background='NONE'
        showShadow={false}
        centerVertically={true}
        isOpen={isOpen}
        onRequestClose={() => toggleModal(prev => !prev)}
        title='Some title'
      >
        <StyledP>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </StyledP>
        <Button buttonTheme='action' label='Test' onClick={() => log.debug('modal 2 content clicked')}/>
      </Modal>
      <Button buttonTheme='action' label='Open modal (background and/or shadow can be disabled)' onClick={() => toggleModal(prev => !prev)}/>
    </StyledWrapperDiv>
  )
}

export const ModalExampleAlert: React.FunctionComponent<{}> = () => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <StyledWrapperDiv>
      <Modal
        colorTheme='ALERT'
        background='LIGHT'
        centerVertically={true}
        isOpen={isOpen}
        showBorderRadius={false}
        onRequestClose={() => toggleModal(prev => !prev)}
        title='Some title'
      >
        <StyledP>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </StyledP>
      </Modal>
      <Button buttonTheme='action' label='Open Warning modal' onClick={() => toggleModal(prev => !prev)}/>
    </StyledWrapperDiv>
  )
}

export const ModalExamplePayment: React.FunctionComponent<{}> = () => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <StyledWrapperDiv>
      <Modal
        colorTheme='PAYMENT'
        background='LIGHT'
        centerVertically={true}
        showBorderRadius={false}
        isOpen={isOpen}
        onRequestClose={() => toggleModal(prev => !prev)}
        title='Some title'
      >
        <StyledP>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </StyledP>
      </Modal>
      <Button buttonTheme='action' label='Open Payment modal' onClick={() => toggleModal(prev => !prev)}/>
    </StyledWrapperDiv>
  )
}

export const ModalExampleNote: React.FunctionComponent<{}> = () => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <StyledWrapperDiv>
      <Modal
        colorTheme='NOTE'
        background='LIGHT'
        centerVertically={true}
        isOpen={isOpen}
        showBorderRadius={false}
        onRequestClose={() => toggleModal(prev => !prev)}
        title='Some title'
      >
        <StyledP>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </StyledP>
      </Modal>
      <Button buttonTheme='action' label='Open Note modal' onClick={() => toggleModal(prev => !prev)}/>
    </StyledWrapperDiv>
  )
}

export const ModalExampleSide: React.FunctionComponent<{}> = () => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <StyledWrapperDiv>
      <Modal
        background='LIGHT'
        fullSide
        isOpen={isOpen}
        onRequestClose={() => toggleModal(prev => !prev)}
        title='Some title'
      >
        <StyledP>
          Here will be some inputs/form.
        </StyledP>
      </Modal>
      <Button buttonTheme='action' label='Open Side modal' onClick={() => toggleModal(prev => !prev)}/>
    </StyledWrapperDiv>
  )
}

const ModalExamples: React.FunctionComponent<{}> = () => (
  <div>
    <Section>
      Besides modal versions presented below many other variations are also possible.
      (e.g. in each case modal can be shown on dark/light/transparent background if needed).
    </Section>
    <Section>
      <h3>Background and shadow variations</h3>
      <ModalExample />
      <ModalExample2 />
      <ModalExample3 />
    </Section>
    <Section>
      <h3>Modals with color border</h3>
      <ModalExampleAlert />
      <ModalExamplePayment />
      <ModalExampleNote />
    </Section>
    <Section>
      <h3>Full height side modal (for displaying forms)</h3>
      <ModalExampleSide />
    </Section>
  </div>
)

export default ModalExamples
