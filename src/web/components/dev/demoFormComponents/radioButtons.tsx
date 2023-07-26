import { Field } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import RadioField from '../../../common/formikFields/radioInputField'
import * as Grid from '../../../common/grid'
import Panel from '../../../common/panel'
import { Button, InlineFields, SectionTitle } from './styled'
import { DemoFormValues, GridPanelProps } from './types'

const RadioButtons: React.FunctionComponent<GridPanelProps> = () => {
  return (
    <Panel heading='Radio buttons'>
      <SectionTitle>Radio buttons with labels on the right</SectionTitle>
      <InlineFields>
        <Field
          name={nameof<DemoFormValues>('role')}
          value='basic'
          component={RadioField}
          label='Basic'
        />
        <Field
          name={nameof<DemoFormValues>('role')}
          value='admin'
          component={RadioField}
          label='Admin'
        />
      </InlineFields>
      <SectionTitle>Radio buttons with labels on the bottom</SectionTitle>
      <InlineFields>
        <Field
          name={nameof<DemoFormValues>('size')}
          value='S'
          component={RadioField}
          label='Small'
          labelPosition='bottom'
        />
        <Field
          name={nameof<DemoFormValues>('size')}
          value='M'
          component={RadioField}
          label='Medium'
          labelPosition='bottom'
        />
        <Field
          name={nameof<DemoFormValues>('size')}
          value='L'
          component={RadioField}
          label='Large'
          labelPosition='bottom'
        />
      </InlineFields>
      <SectionTitle>Small radio buttons</SectionTitle>
      <InlineFields>
        <Field
          name={nameof<DemoFormValues>('type')}
          value='regular'
          component={RadioField}
          label='Regular'
          size='s'
        />
        <Field
          name={nameof<DemoFormValues>('type')}
          value='primary'
          component={RadioField}
          label='Primary'
          size='s'
        />
        <Field
          name={nameof<DemoFormValues>('type')}
          value='secondary'
          component={RadioField}
          label='Secondary'
          size='s'
        />
      </InlineFields>
      <SectionTitle>Extra small radio buttons</SectionTitle>
      <InlineFields>
        <Field
          name={nameof<DemoFormValues>('type2')}
          value='circle'
          component={RadioField}
          label='Circle'
          size='xs'
        />
        <Field
          name={nameof<DemoFormValues>('type2')}
          value='rect'
          component={RadioField}
          label='Rect'
          size='xs'
        />
        <Field
          name={nameof<DemoFormValues>('type2')}
          value='triangle'
          component={RadioField}
          label='Triangle'
          size='xs'
        />
      </InlineFields>
      <Grid.ButtonContainer>
        <Button type='reset'>Cancel</Button>
        <Button type='submit'>Save</Button>
      </Grid.ButtonContainer>
    </Panel>
  )
}

export default RadioButtons
