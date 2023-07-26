import { nameof } from '#veewme/lib/util'
import Switch from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { AgentNotificationValues } from './valuesInterfaces'

const SwitchDescription = styled.div`
  padding-right: 30px;
  font-size: 13px;
  line-height: 1.5;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const Notifications: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='Notifications' id='notifications' toggleable>
      <Field
        component={Switch}
        name={nameof<AgentNotificationValues>('newTourOrder')}
        label={
          <>
            New Tour / Order e-mail notification
            <SwitchDescription>
              After you place a new order, or your Photographer / Filmmaker places an order for you,
              you will get an e-mail notification.
            </SwitchDescription>
          </>
        }
      />
      <Field
        component={Switch}
        name={nameof<AgentNotificationValues>('tourActivated')}
        label={
          <>
            Tour Activated e-mail notification
            <SwitchDescription>
              When your Photographer / Filmmaker activated your Tour, you will receive an e-mail notification.
            </SwitchDescription>
          </>
        }
      />
    </Panel>
  )
}

export default Notifications
