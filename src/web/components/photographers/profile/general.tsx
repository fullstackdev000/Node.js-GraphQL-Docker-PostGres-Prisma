import { nameof } from '#veewme/lib/util'
import { Field } from 'formik'
import * as React from 'react'
import InputField from '../../../common/formikFields/inputField'
import Panel from '../../../common/panel'
import styled from '../../../common/styled-components'
import { ProfileValues } from './profileForm'

const Grid = styled.div`
  width:100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  input {
    width: 100%;
  }
`

const General: React.FunctionComponent<{}> = () => {
  return (
    <Panel id='general' heading='General' toggleable>
      <Grid>
        <Field name={`${nameof<ProfileValues>('user')}.${nameof<ProfileValues['user']>('firstName')}`} component={InputField} label='First Name:' />
        <Field name={`${nameof<ProfileValues>('user')}.${nameof<ProfileValues['user']>('lastName')}`} component={InputField} label='Last Name:' />
      </Grid>
    </Panel>
  )
}

export default General
