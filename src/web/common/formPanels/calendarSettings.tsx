import { nameof } from '#veewme/lib/util'
import SelectField from '#veewme/web/common/formikFields/selectField'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { CalendarSettings, DaysOfWeek } from './valuesInterfaces'

/**
 * TODO: Remove calendar settings modal when Affiliate settings integrated
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
      width: 115px;
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

const StyledPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const Wrapper = styled.div`
  width: 235px;
`

const CalendarSettings: React.FunctionComponent<{}> = () => {
  return (
    <StyledPanel
      heading='Calendar Settings'
      toggleable
    >
      <Wrapper>
        <Field
          name={`${nameof<CalendarSettings>('calendarFirstDay')}`}
          component={SelectStyled}
          options={dayOptions}
          label='Start Week on:'
        />
        <Field
          name={nameof<CalendarSettings>('calendarStartTime')}
          component={SelectStyled}
          label='Day starts at: '
          options={startHours}
        />
        <Field
          name={nameof<CalendarSettings>('calendarEndTime')}
          component={SelectStyled}
          label='Day ends at: '
          options={endHours}
        />
        {/* TODO: consider changing this field to checkbox */}
        <Field
          name={`${nameof<CalendarSettings>('calendarTime12h')}`}
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
          name={`${nameof<CalendarSettings>('calendarShowWeather')}`}
          component={StyledSwitch}
          label='Show Weather:'
          labelFirst
        />
        <Field
          name={`${nameof<CalendarSettings>('calendarShowBusinessHours')}`}
          component={StyledSwitch}
          label='Show business hours:'
          labelFirst
        />
      </Wrapper>
    </StyledPanel>
  )
}

export default CalendarSettings
