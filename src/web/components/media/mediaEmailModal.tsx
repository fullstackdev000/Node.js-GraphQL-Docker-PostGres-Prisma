import { nameof } from '#veewme/lib/util'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { useState } from 'react'
import * as Yup from 'yup'
import Button from '../../common/buttons/basicButton'
import CheckboxField from '../../common/formikFields/checkboxField'
import InputField from '../../common/formikFields/inputField'
import RadioField from '../../common/formikFields/radioInputField'

import { MailOutline } from 'styled-icons/material'

/* START of Form*/
const FieldsWrapper = styled.div`
  margin: -10px 0 15px;

  h5 {
    margin: 15px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid ${p => p.theme.colors.BORDER};
    width: 100%;
    font-weight: 400;
    font-size: 15px;
  }
`

const Checkbox = styled(CheckboxField)`
  padding: 7px 0;
`

const OtherEmailWrapper = styled.div`
  padding-left: 25px;
  width: 100%;

  input {
    min-width: 230px;

    & + span {
      bottom: -22px;
    }
  }

  input:disabled {
    background: ${props => props.theme.colors.EXTRA_LIGHT_GREY};;
  }

  p {
    margin-top: -7px;
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-size: 11px;
  }
`

const StyledForm = styled(Form)`
  button {
    margin-top: 15px;
    width: 100%;
  }
`

const Error = styled.p`
  margin-top: 10px;
  color: ${props => props.theme.colors.ALERT};
  font-size: 13px;
`

const TypeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export type contentType = 'photo' | 'video' | 'interactive' | 'panorama' | 'other'

interface CustomProps {
  onSubmit: (values: FormValues) => void
  hideTypeSection?: boolean
  contentType?: contentType
}

interface OutputFormValues {
  agent: boolean
  officeAdmin: boolean
  definedCC: boolean
  otherEmails?: string
  type: contentType
  otherType: string
}

// form values used only 'locally' (not sent to server)
interface AdditionalFormValues {
  other: boolean
}

export type FormValues = OutputFormValues & AdditionalFormValues
type MediaEmailFormViewProps = FormikProps<FormValues> & CustomProps

const MediaEmailFormView: React.FunctionComponent<MediaEmailFormViewProps> = props => {
  const { values } = props
  const noRecipient = !values.agent && !values.officeAdmin && !values.definedCC && !values.other
  return (
    <StyledForm>
      <FieldsWrapper>
        {!props.hideTypeSection && (
          <TypeWrapper>
            <Field
              name={`${nameof<FormValues>('type')}`}
              value='photo'
              component={RadioField}
              label='Photo'
              size='xs'
            />
            <Field
              name={`${nameof<FormValues>('type')}`}
              component={RadioField}
              label='Video'
              value='video'
              size='xs'
            />
            <Field
              name={`${nameof<FormValues>('type')}`}
              component={RadioField}
              label='Interactive'
              value='interactive'
              size='xs'
            />
            <Field
              name={`${nameof<FormValues>('type')}`}
              component={RadioField}
              label='Other'
              value='other'
              size='xs'
            />
            <OtherEmailWrapper>
              <Field
                name={`${nameof<FormValues>('otherType')}`}
                component={InputField}
                disabled={props.values.type !== 'other'}
                compactMode={false}
              />
            </OtherEmailWrapper>
          </TypeWrapper>
        )}
        {!props.hideTypeSection && <h5>Include in email</h5>}
        <Field
          name={`${nameof<FormValues>('agent')}`}
          component={Checkbox}
          label='Agent (Default)'
        />
        <Field
          name={`${nameof<FormValues>('officeAdmin')}`}
          component={Checkbox}
          label='Office Admin'
        />
        <Field
          name={`${nameof<FormValues>('definedCC')}`}
          component={Checkbox}
          label='Defined CC'
        />
        <Field
          name={`${nameof<FormValues>('other')}`}
          component={Checkbox}
          label='Other'
        />
        <OtherEmailWrapper>
          <Field
            name={`${nameof<FormValues>('otherEmails')}`}
            component={InputField}
            disabled={!props.values.other}
            compactMode={false}
          />
          <p>If adding multiple, separate with comma</p>
        </OtherEmailWrapper>
      </FieldsWrapper>
      <Button
        full
        buttonTheme='info'
        type='button'
        label='Send Email'
        onClick={props.submitForm}
        disabled={noRecipient}
      />
      {noRecipient && <Error>Please select at least one recipient</Error>}
    </StyledForm>
  )
}

const FormSchema = Yup.object().shape<Partial<FormValues>>({
  otherEmails: Yup.string().when('other', {
    is: true,
    then: Yup.string().required()
  })
})

export const MediaEmailForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { props }) => {
    const valuesCopy = { ...values }
    const other = valuesCopy.other
    delete valuesCopy.other
    if (!other) {
      delete valuesCopy.otherEmails
    }
    props.onSubmit(valuesCopy)
  },
  mapPropsToValues: props => ({
    agent: true,
    definedCC: false,
    officeAdmin: false,
    other: false,
    otherType: '',
    type: props.contentType || 'photo'
  }),
  validationSchema: FormSchema
})(MediaEmailFormView)
/* END of Form*/

const Wrapper = styled.div`
  margin-right: 5px;
`

interface MediaEmailModalProps {
}

const MediaEmailModal: React.FunctionComponent<MediaEmailModalProps> = props => {
  const [isOpen, toggleModal] = useState<boolean>(false)

  return (
    <Wrapper>
      <span onClick={() => toggleModal(prev => !prev)}>
        <MailOutline size='28' />
      </span>
      <Modal
        centerVertically
        title='Select media added and recipient(s)'
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
      >
        <MediaEmailForm
          onSubmit={vals => {
            log.debug(vals)
            toggleModal(false)
          }}
        />
      </Modal>
    </Wrapper>
  )
}

export default MediaEmailModal
