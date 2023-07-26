
import {
  AllProcessorsQuery,
  UpdateOrderedServiceProcessorMutationVariables
} from '#veewme/gen/graphqlTypes'
import {
  AllProcessors,
  UpdateOrderedServiceProcessor
} from '#veewme/lib/graphql/queries'
import SelectField from '#veewme/web/common/formikFields/selectField'
import TextAreaField from '#veewme/web/common/formikFields/textareaField'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import { OrderedService } from '#veewme/web/components/orders/types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import Button from '../../common/buttons/basicButton'

import { LongArrowAltRight } from 'styled-icons/fa-solid'

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

const Row = styled.div`
  min-width: 650px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`

const ServiceBox = styled.div`
  display: flex;
  width: 30%;
  align-items: center;
  margin-bottom: 5px;

  > svg {
    width: 24px;
    height: 24px;
  }
`

const ProccessorBox = styled.div`
  display: flex;
  width: 70%;
`

const ServiceName = styled.div`
  margin-left: 10px;

`

const ProcessorName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 25px;
  margin-bottom: 5px;
  flex-grow: 1;
  color: ${props => props.theme.colors.LABEL_TEXT};

  > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 160px;
  }

  > svg {
    margin-left: 8px;
    color: ${props => props.theme.colors.GREEN};
    transform: scaleX(1.5);
    transform-origin: left;
  }
`

interface ProcessorModalProps {
  isOpen: boolean
  toggleModal: (value: boolean) => void
  processorId?: number
  icon: JSX.Element
  processorName: string
  orderedService: OrderedService
}

interface FormValues {
  processorId?: number
  note?: string
}

const ValidationSchema = Yup.object().shape<Partial<FormValues>>({
  note: Yup.string()
})

const ProcessorModal: React.FunctionComponent<ProcessorModalProps> = props => {
  const initialValues: FormValues = {
    note: props.orderedService.message || '',
    processorId: props.processorId
  }

  const { data, loading } = useQuery<AllProcessorsQuery>(AllProcessors)
  const [ updateProcessor, { loading: updating }] = useMutation<{}, UpdateOrderedServiceProcessorMutationVariables>(UpdateOrderedServiceProcessor, {
    awaitRefetchQueries: true,
    refetchQueries: ['OrdersPaginated']
  })

  const processorOptions = React.useMemo(() => {
    return data ? data.processors.map(p => ({
      label: `${p.user.firstName} ${p.user.lastName}`,
      value: p.id
    })) : []
  }, [data])

  const showLoader = loading || updating

  return (
    <Modal
      background='LIGHT'
      colorTheme='PAYMENT'
      title='Task Note/Reassignment'
      centerVertically={true}
      isOpen={props.isOpen}
      onRequestClose={() => props.toggleModal(false)}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        enableReinitialize
        onSubmit={async values => {
          log.debug('Processor change:', values)
          await updateProcessor({
            variables: {
              data: {
                message: values.note,
                processorId: values.processorId
              },
              where: {
                id: props.orderedService.id
              }
            }
          }).catch(e => log.debug(e))
          props.toggleModal(false)
        }}
      >
        <Form>
          <Row>
            <ServiceBox>
              {props.icon}
              <ServiceName>{props.orderedService.service.name}</ServiceName>
            </ServiceBox>
            <ProccessorBox>
              <ProcessorName>
                  <span>{props.processorName || 'No Processor'}</span>
                  <LongArrowAltRight size='30' />
              </ProcessorName>
              <Field
                placeholder='Select Processor'
                options={processorOptions}
                maxMenuHeight={100}
                component={SelectField}
                name='processorId'
              />
            </ProccessorBox>
          </Row>
          <Field
            label='Task note'
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

export default ProcessorModal
