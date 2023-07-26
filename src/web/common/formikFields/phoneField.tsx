import { debounce } from '#veewme/lib/util'
// import * as log from '#veewme/web/common/log'
import { FieldProps, getIn } from 'formik'
import * as React from 'react'
import PhoneInput from 'react-phone-number-input/input'
import styled from '../styled-components'
import { FakeInput, StyledInputWrapper } from './inputField'
import { Label, ValidationError } from './styled'

export const StyledInput = styled(PhoneInput)`
  padding: 5px 10px;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  flex-basis: fill;
  flex: 1 1;
`

interface CustomProps {
  className?: string
  label?: string
  disabled?: boolean
  maxLength?: number
  compactMode?: boolean // in compactMode field doesn't display error message and its bottom margin is smaller
}

type FormikPhoneInputProps = FieldProps & CustomProps
const FormikPhoneInput: React.FC<FormikPhoneInputProps> = ({
  className,
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  /*
    Make sure default value is always set to avoid
    "A component is changing an uncontrolled input to be controlled" error
    Empty string is correct value even for number inputs:
    https://github.com/facebook/react/issues/7779#issuecomment-248432471
  */
  const value = typeof field.value === 'undefined' ? '' : field.value
  const error = getIn(form.errors, field.name)
  const touched = getIn(form.touched, field.name)
  // It can be assumed that if there is no label, the field is displayed in filters form so it should
  // be displayed in compactMode. The are only few exceptions to this rule.
  const compactMode = props.compactMode === undefined ? !props.label : props.compactMode
  const showError = error && (touched || form.submitCount)
  const [focused, setFocus] = React.useState(false)

  // Calling `setFieldValue` in PhoneInput `onChange` callback
  // causes infinite loop when typing very fast.
  // The only workaround that works is using debounce
  // TODO: find actual cause of problem and correct fix
  const handleChange = React.useMemo(() => {
    return debounce((v: string) => {
      form.setFieldValue(field.name, v || '')
    }, 10)
  }, [])

  return (
    <StyledInputWrapper className={className} >
      {props.label && <Label htmlFor={field.name} error={showError}>{props.label}</Label>}
      <FakeInput
        focus={focused}
        error={showError}
        compactMode={compactMode}
        disabled={props.disabled}
      >
        <StyledInput
          country='US'
          {...field}
          {...props}
          id={field.name}
          onFocus={() => {
            setFocus(true)
          }}
          onBlur={(e: React.FormEvent<HTMLInputElement>) => {
            setFocus(false)
            form.handleBlur(e)
          }}
          onChange={handleChange}
          value={value}
        />
        <ValidationError show={showError && !compactMode}>{error}</ValidationError>
      </FakeInput>
    </StyledInputWrapper>
  )
}

export default FormikPhoneInput
