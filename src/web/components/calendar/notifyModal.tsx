import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import Checkbox from '#veewme/web/common/formikFields/checkboxField'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

const ModalContent = styled.div`
  p {
    font-size: 13px;
  }
`

const StyledButtons = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 10px;
  }
`
const Text = styled.p`
  margin-bottom: 25px;
  font-size: 15px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const FieldWrapper = styled.div`
  display: flex;
  position: relative;
  border-left: 2px solid ${props => props.theme.colors.GREY};
  margin-left: 30px;
  margin-bottom: 40px;
  padding-left: 30px;
  justify-content: space-between;

  & > div {
    padding: 0;
  }

  &:before {
    content: '';
    position: absolute;
    left: -27px;
    top: 1px;
    width: 16px;
    height: 16px;
    background: ${props => props.theme.colors.GREEN};

  }

`

export interface CustomProps {
  onSubmit: (values: FormValues) => void
  onCancel: () => void
}

export interface FormValues {
  client?: boolean
  photographer?: boolean
}

type NotificationFormViewProps = FormikProps<FormValues> & CustomProps

const NotificationFormView: React.FunctionComponent<NotificationFormViewProps> = props => {
  return (
    <>
      <Form>
        <Text>Schedule changes detected</Text>
        <FieldWrapper>
          <Field
            name={`${nameof<FormValues>('client')}`}
            component={Checkbox}
            label='Notify Client'
          />
          <Field
            name={`${nameof<FormValues>('photographer')}`}
            component={Checkbox}
            label='Notify Photographer'
          />
        </FieldWrapper>
        <StyledButtons>
          <Button
            buttonTheme='action'
            label='Send Notifications'
            full
            type='submit'
          />
        </StyledButtons>
      </Form>
    </>
  )
}

export const defaultValues = {
  client: true,
  photographer: true
}

export const NotificationForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...defaultValues
  })
})(NotificationFormView)

interface NotificationModalProps {
  onRequestClose: () => void
  isOpen: boolean
  onSubmit: CustomProps['onSubmit']
  initialData?: FormValues
}

const NotificationModal: React.FunctionComponent<NotificationModalProps> = props => {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        title='Calendar Event Notification'
        background='LIGHT'
        colorTheme='PAYMENT'
      >
        <ModalContent>
          <NotificationForm
            onCancel={props.onRequestClose}
            onSubmit={props.onSubmit}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default NotificationModal
