import { FieldProps } from 'formik'
import * as React from 'react'
import { DateRange } from '../../../../lib/types'
import { Label } from '../styled'
import { StyledDateFieldWrapper } from './common/styled'
import DateRangeSelect, { DateRangeSelectProps } from './dateRangeSelect/dateRangeSelect'
import { Position } from './dateRangeSelect/dateRangeSelectOptions'

interface CustomProps {
  label?: string
  calendarPosition?: Position
}

type FormikInputProps = CustomProps & FieldProps & DateRangeSelectProps

const FormikDateSelect: React.FC<FormikInputProps> = ({ field, form, ...props }) => {
  return (
    <StyledDateFieldWrapper>
      {props.label && <Label htmlFor={field.name}>{props.label}</Label>}
      <DateRangeSelect
        dateRange={field.value}
        className={props.className}
        placeholder={props.placeholder}
        onChange={(dateRange?: DateRange) => form.setFieldValue(field.name, dateRange)}
        calendarPosition={props.calendarPosition}
      />
    </StyledDateFieldWrapper>
  )
}

export default FormikDateSelect
