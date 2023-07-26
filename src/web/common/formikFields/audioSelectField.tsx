import { FieldProps } from 'formik'
import * as React from 'react'
import AudioSelect, { AudioSelectProps } from '../audioSelect'

interface CustomProps extends AudioSelectProps {}

type FormikAudioSelectProps = FieldProps & CustomProps
const FormikAudioSelect: React.FunctionComponent<FormikAudioSelectProps> = ({
  className,
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const value = typeof field.value === 'undefined' ? '' : field.value
  return (
    <AudioSelect
      value={value}
      onChange={v => {
        form.setFieldValue(field.name, v)
        form.setFieldTouched(field.name)
      }}
      {...props}
    />
  )
}

export default FormikAudioSelect
