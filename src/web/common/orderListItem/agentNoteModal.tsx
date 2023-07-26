
import {
  UpdateAgentNoteMutationVariables
} from '#veewme/gen/graphqlTypes'
import {
  UpdateAgentNote
} from '#veewme/lib/graphql/queries'
import TextAreaField from '#veewme/web/common/formikFields/textareaField'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import { useMutation } from '@apollo/react-hooks'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import Button from '../buttons/basicButton'

const Wrapper = styled.div`
  width: 400px;
`

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 25px;
  padding-bottom: 20px;
  font-size: 15px;
  white-space: pre-wrap;

  button:first-child {
    margin-right: 10px;
  }
`

const Loader = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 60px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`

interface AgentNoteModalProps {
  isOpen: boolean
  toggleModal: (value: boolean) => void
  note?: string
  agentId: number
}

interface FormValues {
  note?: string
}

const ValidationSchema = Yup.object().shape<Partial<FormValues>>({
  note: Yup.string()
})

const AgentNoteModal: React.FunctionComponent<AgentNoteModalProps> = props => {
  const initialValues: FormValues = {
    note: props.note || ''
  }

  const [ updateAgent, { loading: updating }] = useMutation<{}, UpdateAgentNoteMutationVariables>(UpdateAgentNote, {
    awaitRefetchQueries: true,
    refetchQueries: ['OrdersPaginated']
  })

  const showLoader = updating

  return (
    <Modal
      background='LIGHT'
      colorTheme='PAYMENT'
      title='Agent Internal Note'
      centerVertically={true}
      isOpen={props.isOpen}
      onRequestClose={() => props.toggleModal(false)}
    >
      <Wrapper>
        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          onSubmit={async values => {
            await updateAgent({
              variables: {
                id: props.agentId,
                note: values.note
              }
            }).catch(e => log.debug(e))
            props.toggleModal(false)
          }}
        >
          <Form>
            <Field
              label='Note'
              component={TextAreaField}
              name='note'
            />
            <Buttons>
              <Button
                buttonTheme='primary'
                label='Cancel'
                size='big'
                full
                onClick={() => {
                  props.toggleModal(false)
                }}
              />
              <Button
                full
                buttonTheme='action'
                label='Save'
                size='big'
                type='submit'
              />
            </Buttons>
          </Form>
        </Formik>
      </Wrapper>
      {
        showLoader && (
          <Loader>
            <DotSpinner isProcessComplete={false} />
          </Loader>
        )
      }
    </Modal>
  )
}

export default AgentNoteModal
