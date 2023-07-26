import { FormikTouched, FormikValues } from 'formik'
import * as React from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import Button from '../buttons/basicButton'
import Modal from '../modal'
import styled from '../styled-components'

const Text = styled.p`
  font-size: 16px;
`

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  button {
    margin: 5px 0 5px 8px;
  }
`

const Warning: React.FunctionComponent<{
  touched: FormikTouched<FormikValues>
}> = ({
  touched
}) => {
  return (
    <NavigationPrompt
      when={(crntLocation, nextLocation) => {
        const isNewPath = !nextLocation || nextLocation.pathname !== crntLocation.pathname
        const allowRedirect = nextLocation && (nextLocation.search.indexOf('?allowRedirect') > -1)
        if (allowRedirect || !isNewPath) {
          return false
        }
        const anyTouched = Object.keys(touched).some(key => !!touched[key])
        return anyTouched
      }}
    >
      {({ onConfirm, onCancel }) => (
        <Modal
          isOpen={true}
          onRequestClose={() => onCancel()}
          title='Unsaved changes'
          colorTheme='ALERT'
          background='LIGHT'
          showBorderRadius={false}
        >
          <Text>
            There are unsaved changes. Are you sure you want to leave?
          </Text>
          <Buttons>
            <Button
              buttonTheme='primary'
              label='Cancel'
              onClick={onCancel}
            />
            <Button
              buttonTheme='alert'
              label='Ok'
              full
              onClick={onConfirm}
            />
          </Buttons>
        </Modal>
      )}
    </NavigationPrompt>
  )
}

export default Warning
