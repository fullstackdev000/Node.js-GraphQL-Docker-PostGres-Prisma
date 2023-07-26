import { nameof } from '#veewme/lib/util'
import SelectField, { OptionValue } from '#veewme/web/common/formikFields/selectField'
import Panel from '#veewme/web/common/panel'
import { Field } from 'formik'
import * as React from 'react'
import { Profile } from '../common/types'

interface RegionProps {
  options: OptionValue[]
}

const Region: React.FunctionComponent<RegionProps> = props => (
  <Panel heading='Region' toggleable>
    <Field
      name={nameof<Profile>('regionId')}
      label='Select Region:'
      component={SelectField}
      options={props.options}
    />
  </Panel>
)

export default Region
