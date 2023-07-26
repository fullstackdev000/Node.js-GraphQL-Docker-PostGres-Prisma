import { nameof } from '#veewme/lib/util'
import Switch from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { SettingsValues } from '../../components/affiliates/editAffiliate/types'

const SwitchDescription = styled.div`
  padding-right: 30px;
  font-size: 13px;
  line-height: 1.5;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const Settings: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='Client Permissions & Settings' id='settings' toggleable>
      <Field
        component={Switch}
        name={`${nameof<SettingsValues>('sendWelcomeEmailsToNewClients')}`}
        label={
          <>
          Send Welcome letter to new clients
          </>
        }
      />
      <Field
        component={Switch}
        name={`${nameof<SettingsValues>('allowClientMediaUpload')}`}
        label={
          <>
            Allow client photo uploads
          </>
        }
      />
      <Field
        component={Switch}
        name={`${nameof<SettingsValues>('allowClientOrders')}`}
        label={
          <>
            Allow client to place orders
          </>
        }
      />
      <Field
        component={Switch}
        name={`${nameof<SettingsValues>('allowClientBillingAccess')}`}
        label={
          <>
            Allow client billing access
            <SwitchDescription>
              Hide client access to billing information, hide pricing on order confirmation email.
            </SwitchDescription>
          </>
        }
      />
      <Field
        component={Switch}
        name={`${nameof<SettingsValues>('orderConfirmationEmailRider')}`}
        label={
          <>
            Show order confirmation Rider
            <SwitchDescription>
              Display a custom message or note to your clients on the bottom of the Order Confirmation email.
            </SwitchDescription>
          </>
        }
      />
      <Field
        component={Switch}
        name={`${nameof<SettingsValues>('orderPageDefault')}`}
        label={
          <>
            Display Orders page as default
            <SwitchDescription>
              Bypass the main dashboard page. Go directly to Orders page.
            </SwitchDescription>
          </>
        }
      />
    </Panel>
  )
}

export default Settings
