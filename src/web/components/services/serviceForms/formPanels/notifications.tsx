import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from '../types'

const InputWrapper = styled.div`
  margin-bottom: 15px;

  input {
    width: 100%;
  }

  span {
    font-size: 12px;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }
`

export class Notifications extends React.Component<{}> {
  render () {
    return (
      <Panel id='notifications' heading='Notifications'>
        <InputWrapper>
          <Field
            name={nameof<FormValues>('orderNotifyEmails')}
            component={InputField} // TODO change InputField to MultipleValueInputField when ready
            label='Notify by email upon order'
            compactMode
          />
          <span>Enter in one or multiple emails. When the service is ordered, each address will receive email notification.</span>
        </InputWrapper>
        <InputWrapper>
          <Field
            name={nameof<FormValues>('tourNotifyEmails')}
            component={InputField} // TODO change InputField to MultipleValueInputField when ready
            label='Notify by email upon order'
            compactMode
          />
          <span>Enter in one or multiple emails. When the tour is ordered, each address will receive email notification.</span>
        </InputWrapper>
      </Panel>
    )
  }
}

export default Notifications
