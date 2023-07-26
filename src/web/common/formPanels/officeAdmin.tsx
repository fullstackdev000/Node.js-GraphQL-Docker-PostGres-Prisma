import { nameof } from '#veewme/lib/util'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { AgentAccountValues } from './valuesInterfaces'

const OfficeAdminWrapper = styled.div`
  label {
    justify-content: space-between;
  }
`

const OfficeAdminField: React.FunctionComponent = () => {
  return (
    <OfficeAdminWrapper>
      <Field
        component={SwitchField}
        label='Office Admin'
        name={nameof<AgentAccountValues>('officeAdmin')}
        labelFirst
      />
      <Field
        component={SwitchField}
        label='Broker Admin'
        name={nameof<AgentAccountValues>('brokerAdmin')}
        labelFirst
      />
    </OfficeAdminWrapper>
  )
}

const OfficeAdmin: React.FunctionComponent<{}> = () => (
  <Panel
    id='admin'
    toggleable
  >
    <OfficeAdminField />
  </Panel>
)

export default OfficeAdmin
