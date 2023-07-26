import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import RadioField from '#veewme/web/common/formikFields/radioInputField'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { DurationWrapper } from '../../common/styled'
import { FormValues } from '../types'

const StyledRadio = styled(RadioField)`
  margin-bottom: 25px;
`

interface DurationProps {
  isPackage: boolean
}
const Duration: React.FunctionComponent<DurationProps> = ({
  isPackage
}) => {
  const typeLabel = isPackage ? 'package' : 'service'
  const durationLabel = `Estimate ${typeLabel} duration`
  return (
    <DurationWrapper>
      <Field name={nameof<FormValues>('duration')} component={InputField} type='number' label={durationLabel} />
      <Field
        name={nameof<FormValues>('durationUnit')}
        value={'Minute'}
        component={StyledRadio}
        label='minutes'
        size='s'
      />
      <Field
        name={nameof<FormValues>('durationUnit')}
        value={'Hour'}
        component={StyledRadio}
        label='hours'
        size='s'
      />
    </DurationWrapper>
  )
}

export default Duration
