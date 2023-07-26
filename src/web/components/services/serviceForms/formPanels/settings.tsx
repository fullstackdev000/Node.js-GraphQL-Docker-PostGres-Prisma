import { nameof } from '#veewme/lib/util'
import SelectField from '#veewme/web/common/formikFields/selectField'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { ServiceFormOptions } from '../types'

const StyledSwitch = styled(SwitchField)`
  margin-bottom: 5px;
`

const SiwtchLabelHint = styled.span`
  font-weight: 400;
`

const ProcessorWrapper = styled.div`
  margin-top: 15px;
  max-width: 40%;
`

interface SettingsAllowedField {
  mediaOnly: boolean
  assignable: boolean
  processorId?: number
}

interface SettingsProps {
  processors: ServiceFormOptions['processors']
  isPackage?: boolean
}

/*
  Additional generic T used here because this form section will be reused in another form(s).
  T will represnt type of parent form values
*/
export class Settings<T extends SettingsAllowedField> extends React.Component<SettingsProps> {
  render () {
    return (
      <Panel id='settings' heading='Settings'>
        <Field
          name={nameof<T>('mediaOnly')}
          component={StyledSwitch}
          label='Media Only'
        />
        <Field
          name={nameof<T>('assignable')}
          component={StyledSwitch}
          label={<>Assignable Service <SiwtchLabelHint>(Uncheck if not to appear in scheduling)</SiwtchLabelHint></>}
        />
        {
          !this.props.isPackage && (
            <ProcessorWrapper>
              <Field
                name={nameof<T>('processorId')}
                component={SelectField}
                options={this.props.processors.map(processor => ({
                  label: `${processor.user.firstName} ${processor.user.lastName}`,
                  value: processor.id
                }))}
                label='Processor'
              />
            </ProcessorWrapper>
          )
        }
      </Panel>
    )
  }
}

export default Settings
