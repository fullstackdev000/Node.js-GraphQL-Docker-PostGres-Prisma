import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'

import { OrderedService } from '#veewme/web/components/orders/types'
import { getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import Button from '../buttons/basicButton'

import { CheckCircle } from 'styled-icons/boxicons-regular'

import {
  AcceptServicesMutationVariables
} from '#veewme/gen/graphqlTypes'
import {
  AcceptServices as AcceptServicesQuery
} from '#veewme/lib/graphql/queries/orders'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation } from '@apollo/react-hooks'

const Buttons = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-top: 25px;
  padding-bottom: 20px;
  font-size: 15px;
  white-space: pre-wrap;

  button:first-child {
    margin-right: 10px;
  }
`

const Row = styled.div`
  min-width: 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`

const ServiceBox = styled.div`
  display: flex;
  align-items: center;

  > svg {
    width: 20px;
    height: 20px;
  }
`

const FieldWrapper = styled.div`
  width: 100%;
`

const ServiceName = styled.div`
  margin-left: 10px;

`

const StyledCategoryIcon = styled(props => <props.icon className={props.className}/>) `
  width: 16px;
  height: 15px;
  fill: ${props => rgbaToString(props.color)};
`

const Btn = styled.button`
  background: none;
  border: 0 none;
  cursor: pointer;

  svg {
    fill: ${props => props.theme.colors.GREEN};
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

const Wrapper = styled.div`
  background: top center/contain no-repeat url('/public/static/img/checkmark.png');

  form {
    background-color: rgba(255, 255, 255, 0.8);
  }
`

const Title = styled.div`
  margin-bottom: 15px;
  text-transform: capitalize;
  font-size: 15px;
  color: ${props => props.theme.colors.DARKER_GREY};
  font-weight: 500;
`

interface ServicesModalProps {
  isOpen: boolean
  toggleModal: (value: boolean) => void
  orderedService: OrderedService[]
  orderId: number
}

interface SelectableService {
  checked: boolean
  id: OrderedService['id']
}
interface FormValues {
  services: SelectableService[]
}

const ServicesModal: React.FunctionComponent<ServicesModalProps> = props => {
  const initialValues: FormValues = React.useMemo(() => ({
    services: props.orderedService.map(s => ({
      checked: s.status === 'Completed',
      id: s.id
    }))
  }), [props.orderedService])

  const [ acceptServices, { loading: submitting }] = useMutation<{}, AcceptServicesMutationVariables>(AcceptServicesQuery, {
    awaitRefetchQueries: true,
    refetchQueries: ['OrdersPaginated']
  })

  return (
    <>
      <Modal
        background='LIGHT'
        colorTheme='PAYMENT'
        title='Quality Assurance check passed'
        centerVertically={true}
        isOpen={props.isOpen}
        onRequestClose={() => props.toggleModal(false)}
      >
        <Wrapper>
          <Formik
            initialValues={initialValues}
            onSubmit={async values => {
              const ids = values.services.filter(s => s.checked).map(s => s.id)
              log.debug('Services update:', ids)
              await acceptServices({
                variables: {
                  id: props.orderId,
                  servicesIds: ids
                }
              }).catch(e => log.debug(e))
              props.toggleModal(false)
            }}
          >
            {formikProps => {
              const allSelected = formikProps.values.services.every(s => s.checked)
              return (
                <Form>
                  <Title>Activate/unlock services</Title>
                  {
                    props.orderedService.map((s, i) => {
                      const category = s.service.category
                      const serviceType = s.service.serviceType
                      const icon = (
                        <StyledCategoryIcon
                          icon={getServiceCategoryIcon(serviceType === 'Admin' ? undefined : category.icon)}
                          color={category.color}
                        />
                      )
                      return (
                        <Row key={s.id}>
                          <FieldWrapper>
                            <Field
                              disabled={s.status === 'Completed'}
                              component={CheckboxField}
                              name={`services[${i}].checked`}
                              label={
                                <ServiceBox>
                                  {icon}
                                  <ServiceName>{s.service.name}</ServiceName>
                                </ServiceBox>
                              }
                            />
                          </FieldWrapper>
                        </Row>
                      )
                    })
                  }

                  <Buttons>
                    <Button
                      buttonTheme='info'
                      label={allSelected ? 'Deselect all' : 'Select all'}
                      full
                      size='big'
                      onClick={() => {
                        const servicesSelected = props.orderedService.map(s => ({
                          checked: !allSelected ? true : s.status === 'Completed',
                          id: s.id
                        }))
                        formikProps.setFieldValue('services', servicesSelected)
                      }}
                    />
                    <Button
                      full
                      buttonTheme='action'
                      label='Submit'
                      size='big'
                      type='submit'
                    />
                  </Buttons>
                </Form>
              )
            }}
          </Formik>
        </Wrapper>
        {
          submitting && (
            <Loader>
              <DotSpinner isProcessComplete={false} />
            </Loader>
          )
        }
      </Modal>
    </>
  )
}

type AcceptServicesProps = Omit<ServicesModalProps, 'isOpen' | 'toggleModal'>
const AcceptServices: React.FC<AcceptServicesProps> = props => {
  const [modalVisible, toggleModal] = React.useState(false)
  return (
    <>
      <Tooltipped
        tooltip='Quality Assurance'
      >
        <div>
          <Btn
            onClick={() => toggleModal(true)}
            type='button'
          >
            <CheckCircle size='26' />
          </Btn>
        </div>
      </Tooltipped>
      <ServicesModal
        isOpen={modalVisible}
        toggleModal={toggleModal}
        orderedService={props.orderedService}
        orderId={props.orderId}
      />
    </>
  )
}

export default AcceptServices
