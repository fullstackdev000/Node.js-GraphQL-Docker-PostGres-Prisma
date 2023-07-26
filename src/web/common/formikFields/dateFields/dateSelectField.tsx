import { FieldProps } from 'formik'
import * as React from 'react'
import { Label } from '../styled'
import { StyledDateFieldWrapper } from './common/styled'
import DateSelect, { DateSelectProps } from './dateSelect/dateSelect'

interface CustomProps {
  label?: string
}

type FormikInputProps = CustomProps & FieldProps & DateSelectProps

class FormikDateSelect extends React.Component<FormikInputProps> {
  render () {
    const { field, form, ...props } = this.props
    return (
      <StyledDateFieldWrapper>
        {props.label && <Label htmlFor={field.name}>{props.label}</Label>}
        <DateSelect
          date={field.value}
          className={props.className}
          placeholder={props.placeholder}
          onChange={(date?: Date) => {
            form.setFieldTouched(field.name)
            form.setFieldValue(field.name, date)
          }}
        />
      </StyledDateFieldWrapper>
    )
  }
}

export default FormikDateSelect
