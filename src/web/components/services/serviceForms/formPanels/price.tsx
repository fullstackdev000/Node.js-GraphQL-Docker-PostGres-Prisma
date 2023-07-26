import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import { Field } from 'formik'
import * as React from 'react'
import { TextInlineFields } from '../../common/styled'
import { FormValues } from '../types'

interface PriceProps {
  isPackage: boolean
}

const Price: React.FunctionComponent<PriceProps> = ({ isPackage }) => {
  return (
    <TextInlineFields>
      <Field name={nameof<FormValues>('price')} component={InputField} type='number' label='Price' />
      {!isPackage && <Field name={nameof<FormValues>('defaultCompensation')} component={InputField} type='number' label='Default compensation' />}
    </TextInlineFields>
  )
}

export default Price
