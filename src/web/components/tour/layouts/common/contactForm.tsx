import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import TextareaField from '#veewme/web/common/formikFields/textareaField'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'

/* START of Form*/
const FieldsWrapper = styled.div`
  label {
    display: none;
  }
`

const Input = styled(InputField)`
  margin-bottom: 12px;
`

const StyledForm = styled(Form)`
  width: 500px;
  max-width: 100%;

  button {
    margin-top: 0;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme.colors.BORDER};

  button {
    margin-left: 8px;
  }
`

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

interface CustomProps {
  onSubmit: (values: FormValues) => void
}

interface FormValues {
  email: string
  name: string
  info?: string
  subject?: string
}

type ContactFormViewProps = FormikProps<FormValues> & CustomProps

const ContactFormView: React.FunctionComponent<ContactFormViewProps> = () => {
  return (
      <StyledForm>
        <FieldsWrapper>
        <Field
          name={`${nameof<FormValues>('subject')}`}
          component={Input}
          placeholder='Email subject'
          label='Email'
        />
        <Field
          name={`${nameof<FormValues>('email')}`}
          component={Input}
          placeholder='Your email address here.'
          label='Email'
        />
        <Field
          name={`${nameof<FormValues>('name')}`}
          component={Input}
          placeholder='Your name here.'
          label='Name'
        />
        <Field
          name={`${nameof<FormValues>('info')}`}
          component={TextareaField}
          placeholder='Please include your phone (numbers) if you wish to be contacted in an expedited manner.'
          label='Info'
        />
        </FieldsWrapper>
        <SubmitWrapper>
          <Button full buttonTheme='action' type='submit' label='Submit' />
        </SubmitWrapper>
    </StyledForm>
  )
}

export const FormSchema = Yup.object().shape<FormValues>({
  email: Yup.string()
    .email()
    .required(),
  name: Yup.string()
    .required()
})

const ContactForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    email: '',
    name: ''
  }),
  validationSchema: FormSchema
})(ContactFormView)
/* END of Form*/

interface ContactFormModalProps {
  toggleModal: () => void
  modalVisible: boolean
}

const ContactFormModal: React.FunctionComponent<ContactFormModalProps> = props => {
  return (
    <Modal
      centerVertically
      title='Contact form'
      isOpen={props.modalVisible}
      onRequestClose={props.toggleModal}
    >
      <ContactForm
        onSubmit={vals => {
          log.debug(vals)
          props.toggleModal()
        }}
      />
      <ButtonWrapper>
        <Button
          label='Close'
          onClick={props.toggleModal}
        />
      </ButtonWrapper>
    </Modal>
  )
}

export default ContactFormModal
