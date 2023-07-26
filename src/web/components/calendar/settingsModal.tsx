import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import SelectField from '#veewme/web/common/formikFields/selectField'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { DaysOfWeek, Settings } from './types'
// import * as Yup from 'yup'

/**
 * TODO: Remove this file when Affiliate settings integrated
 */

const dayOptions = Object.keys(DaysOfWeek).map((day, index) => ({
  label: day,
  value: index
}))

const startHours = [{
  label: '6:00 AM',
  value: '6:00'
}, {
  label: '7:00 AM',
  value: '7:00'
}, {
  label: '8:00 AM',
  value: '8:00'
}, {
  label: '9:00 AM',
  value: '9:00'
}, {
  label: '10:00 AM',
  value: '10:00'
}, {
  label: '11:00 AM',
  value: '11:00'
}]

const endHours = [{
  label: '3:00 PM',
  value: '15:00'
}, {
  label: '4:00 PM',
  value: '16:00'
}, {
  label: '5:00 PM',
  value: '17:00'
}, {
  label: '6:00 PM',
  value: '18:00'
}, {
  label: '7:00 PM',
  value: '19:00'
}, {
  label: '8:00 PM',
  value: '20:00'
}, {
  label: '9:00 PM',
  value: '21:00'
}]

const ModalContent = styled.div`
  p {
    font-size: 13px;
  }
`

const SelectStyled = styled(SelectField)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;

  > label:first-child {
    flex: 0 0 auto;
    width: auto;
    margin: 0 10px;

    & + div {
      width: 180px;
      margin-top: 0;
      margin-bottom: 0;
    }
  }

`

const StyledSwitch = styled(SwitchField)`
  label {
    justify-content: flex-end;
  }

  input + span {
    font-weight: 400;
    font-size: 13px;
    color: ${props => props.theme.colors.LABEL_TEXT};
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

export interface CustomProps {
  onSubmit: (values: FormValues) => void
  onCancel: () => void
  initialData?: Settings
}

export type FormValues = Settings

type SettingsFormViewProps = FormikProps<FormValues> & CustomProps

const SettingsFormView: React.FunctionComponent<SettingsFormViewProps> = props => {
  return (
    <>
      <Form>
        <p>TO DO: move this section to affiliate form when API is ready</p>
        <Field
          name={`${nameof<FormValues>('firstDay')}`}
          component={SelectStyled}
          options={dayOptions}
          label='Start Week on:'
        />
        <Field
          name={`${nameof<FormValues>('businessDayHours')}.${nameof<FormValues['businessDayHours']>('startTime')}`}
          component={SelectStyled}
          label='Day starts at: '
          options={startHours}
        />
        <Field
          name={`${nameof<FormValues>('businessDayHours')}.${nameof<FormValues['businessDayHours']>('endTime')}`}
          component={SelectStyled}
          label='Day ends at: '
          options={endHours}
        />
        {/* TODO: consider changing this field to checkbox */}
        <Field
          name={`${nameof<FormValues>('time12h')}`}
          component={SelectStyled}
          label='Time format: '
          options={[{
            label: '12h',
            value: true
          }, {
            label: '24h',
            value: false
          }]}
        />
        <Field
          name={`${nameof<FormValues>('showWeather')}`}
          component={StyledSwitch}
          label='Show Weather:'
          labelFirst
        />
        <Field
          name={`${nameof<FormValues>('showBusinessHours')}`}
          component={StyledSwitch}
          label='Show business hours:'
          labelFirst
        />
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
          />
        </StyledButtons>
      </Form>
    </>
  )
}

export const defaultValues = {
  // format required by FullCalendar
  businessDayHours: {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    endTime: '18:00',
    startTime: '10:00'
  },
  firstDay: 0,
  showBusinessHours: false,
  showWeather: true,
  time12h: true
}

export const SettingsForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...defaultValues,
    ...props.initialData
  })
})(SettingsFormView)

interface SettingsModalProps {
  onRequestClose: () => void
  isOpen: boolean
  onSubmit: CustomProps['onSubmit']
  initialData?: FormValues
}

const SettingsModal: React.FunctionComponent<SettingsModalProps> = props => {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        title='Calendar settings'
        background='LIGHT'
        fullSide
      >
        <ModalContent>
          <SettingsForm
            onCancel={props.onRequestClose}
            onSubmit={props.onSubmit}
            initialData={props.initialData}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default SettingsModal
