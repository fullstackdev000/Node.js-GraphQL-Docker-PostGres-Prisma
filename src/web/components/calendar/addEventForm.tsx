import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import { unsetNumberId } from '#veewme/web/common/consts'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import TextareaField from '#veewme/web/common/formikFields/textareaField'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import * as Yup from 'yup'

import ServicesField from './addEventServicesField'
import { Photographer, PhotographerEventData, SelectableService, Services } from './types'

const StyledButtons = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 10px;
  }
`

const ScrollInner = styled.div`
  padding: 0 20px 0 2px;
`

const Error = styled.p`
  padding-top: 10px;
  color: ${props => props.theme.colors.ALERT};
  font-size: 13px;
`

export interface CustomProps {
  photographers: Photographer[]
  onSubmit: (values: PhotographerEventData) => void
  onCancel: () => void
  initialData?: Partial<PhotographerEventData>
  services?: Services
  eventId?: number
  photographerNote?: string
}

export type FormValues = Omit<PhotographerEventData, 'services'> & {
  services?: SelectableService[]
  vacation?: boolean
}

export type AddEventFormViewProps = FormikProps<FormValues> & CustomProps

const AddEventFormView: React.FunctionComponent<AddEventFormViewProps> = props => {
  const servicesSelected = props.values.services && props.values.services.length && !props.values.vacation ? props.values.services.some(service => !!service.checked) : true
  return (
    <>
      <Form>
        <Scrollbars autoHeight={true} autoHeightMax='calc(100vh - 180px)'>
          <ScrollInner>
            <Field name={nameof<FormValues>('vacation')} component={CheckboxField} label='Time-off' compactMode={false} />
            <Field
              name={nameof<FormValues>('photographerId')}
              component={SelectField}
              label='Assign photographer'
              options={props.photographers.map(p => ({
                label: `${p.firstName} ${p.lastName}`,
                value: p.id
              }))}
            />
            <Field
              name={nameof<FormValues>('title')}
              component={InputField}
              label='Title'
            />
            <ServicesField {...props} />
            <Field name={nameof<FormValues>('publicNote')} component={TextareaField} label='Public note' />
            <Field name={nameof<FormValues>('privateNote')} component={TextareaField} label='Private note' />
            <StyledButtons>
              <Button
                buttonTheme='primary'
                label='Cancel'
                onClick={props.onCancel}
              />
              <Button
                buttonTheme='action'
                label='Submit'
                full
                type='submit'
                disabled={!servicesSelected}
              />
            </StyledButtons>
            {!servicesSelected && <Error>Please select at least one service</Error>}
          </ScrollInner>
        </Scrollbars>
      </Form>
    </>
  )
}

const FormSchema = Yup.object().shape<Partial<FormValues>>({
  photographerId: Yup.number().required().moreThan(0, 'Please select photographer'),
  title: Yup.string().required(),
  vacation: Yup.boolean().when('services', {
    is: val => {
      if (!val) {
        return false
      }
      return val.some((v: SelectableService) => v.checked)
    },
    then: Yup.boolean().required().oneOf([false], 'Can not be checked when services selected')
  })
})

const AddEventForm = withFormik<CustomProps, FormValues>({
  enableReinitialize: true,
  handleSubmit:  (values, { setSubmitting, props }) => {
    const selectedServices = values.services ? values.services.filter(service => service.checked) : []
    const selectedServicesIds = selectedServices.map(service => service.id)
    const totalEventDurationMinutes = selectedServices.reduce((acc, currVal) => {
      const service = currVal.service
      const { duration, durationUnit } = service
      if (durationUnit === 'Minute') {
        return acc + duration
      } else {
        return acc + (duration * 60)
      }
    }, 0)
    props.onSubmit({
      ...values,
      orderedServices: selectedServicesIds,
      totalEventDurationMinutes
    })
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    photographerId: unsetNumberId,
    privateNote: '',
    publicNote: props.photographerNote || '',
    services: props.services && props.services.map(service => {
      const checked = props.eventId ? !!(service.event && service.event.eventId === props.eventId) : !service.event

      return {
        ...service,
        checked
      }
    }),
    title: '',
    vacation: false,
    ...props.initialData
  }),
  validationSchema: FormSchema
})(AddEventFormView)

export default AddEventForm
