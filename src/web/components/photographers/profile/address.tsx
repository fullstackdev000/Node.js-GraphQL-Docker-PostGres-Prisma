import { Countries } from '#veewme/lib/constants'
import { nameof } from '#veewme/lib/util'
import { Field } from 'formik'
import * as React from 'react'
import InputField from '../../../common/formikFields/inputField'
import SelectField from '../../../common/formikFields/selectField'
import Panel from '../../../common/panel'
import styled from '../../../common/styled-components'
import { ProfileValues } from './profileForm'

const Grid = styled.div`
  width:100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  input { width: 100%; }
`

const StateOptions = [
  { label: 'State 1', value: 'state1' },
  { label: 'State 2', value: 'state2' },
  { label: 'State 3', value: 'state3' },
  { label: 'State 4', value: 'state4' },
  { label: 'State 5', value: 'state5' }
]

const Address: React.FunctionComponent<{}> = () => {
  return (
    <Panel id='address' heading='Address' toggleable>
      <Grid>
        <Field name={nameof<ProfileValues>('street')} component={InputField} label='Street:' />
        <Field name={nameof<ProfileValues>('city')} component={InputField} label='City:' />
        <Field name={nameof<ProfileValues>('state')} component={SelectField} label='State:' options={StateOptions} />
        <Field name={nameof<ProfileValues>('zip')} component={InputField} label='ZIP/Postal code:' />
        <Field name={nameof<ProfileValues>('country')} component={SelectField} label='Country:' options={Countries} />
      </Grid>
    </Panel>
  )
}

export default Address
