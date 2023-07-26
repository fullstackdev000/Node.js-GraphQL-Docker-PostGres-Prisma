import { Field } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import InputField from '../../../common/formikFields/inputField'
import SwitchField from '../../../common/formikFields/switchField'
import Panel from '../../../common/panel'
import { Button, FieldWrapper, ResetButton } from './styled'
import { DemoFormValues, GridPanelProps } from './types'

const GridPanel2: React.FunctionComponent<GridPanelProps> = props => {
  return (
    <Panel heading='Section 1'>
      <FieldWrapper>
        <Field
          type='text'
          name={nameof<DemoFormValues>('userName')}
          placeholder='User name'
          component={InputField}
          autoComplete='off'
        />
      </FieldWrapper>
      <FieldWrapper>
        <Field
          name={nameof<DemoFormValues>('done')}
          component={SwitchField}
          label='Done'
        />
        <Field
          name={nameof<DemoFormValues>('subscribe')}
          component={SwitchField}
          label='Subsribe (label on left)'
          labelFirst={true}
        />
      </FieldWrapper>
      <Button
        type='submit'
      >
        Submit
      </Button>
      <ResetButton
        type='reset'
        disabled={!props.dirty}
      >
        Reset
      </ResetButton>
    </Panel>
  )
}

export default GridPanel2
