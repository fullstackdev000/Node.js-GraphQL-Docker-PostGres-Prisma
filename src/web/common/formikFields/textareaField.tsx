import { FieldProps, getIn } from 'formik'
import * as React from 'react'
import styled from '../styled-components'
import { CharsCounter, Counter } from './inputField'
import { Label, ValidationError } from './styled'

export type LabelBarComponentPosition = 'left' | 'right'

const StyledTextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  ${Label} {
    white-space: unset;
  }

  ${ValidationError} {
    bottom: 7px;
  }

  ${Counter} {
    position: absolute;
    right: 3px;
    bottom: 30px;
  }
`

const StyledLabelBar = styled.div<{componentPosition?: LabelBarComponentPosition}> `
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: ${props => props.componentPosition === 'right' ? 'space-between' : 'flex-start'}
`

const StyledLabel = styled(Label) `
  width: unset;
  flex: unset;
  margin-right: 20px;
`

const StyledTextarea = styled(({ error, required, ...props }) => <textarea {...props} />)<{
  error?: boolean
  required?: boolean
}>`
  margin-bottom: 25px;
  border-radius: 5px;
  border: 2px solid ${props => props.error ? props.theme.colors.ALERT : props.theme.colors.BORDER};
  font-size: 13px;
  flex-basis: fill;
  flex: 1 1;
  box-sizing: border-box;
  padding: 12px;
  min-height: 115px;
  resize: none;

  &:focus {
    border-color: ${props => props.theme.colors.GREEN};
    outline: none;
  }

  ${props => props.required && `
    && {
      border-left: 5px solid ${props.theme.colors.ALERT};
    }
  `}
`

interface CustomProps {
  label?: string
  rows?: number
  // allows wrapping component in styled-component to override styles if needed
  className?: string
  labelBarComponent?: React.ReactNode
  labelBarComponentPosition?: LabelBarComponentPosition
  compactMode?: boolean
  maxLength?: number
  required?: boolean
}

type FormikTextareaProps = FieldProps & CustomProps
const FormikTextarea: React.FunctionComponent<FormikTextareaProps> = ({
  field,
  form,
  labelBarComponent,
  labelBarComponentPosition,
  required,
  ...props
}) => {
  const error = getIn(form.errors, field.name)
  const touched = getIn(form.touched, field.name)
  const showError = error && (touched || form.submitCount)
  const compactMode = props.compactMode === undefined ? !props.label : props.compactMode

  return (
    <StyledTextareaWrapper className={props.className}>
      <StyledLabelBar componentPosition={labelBarComponentPosition}>
        {props.label && <StyledLabel htmlFor={field.name} error={showError}>{props.label}</StyledLabel>}
        {labelBarComponent}
      </StyledLabelBar>
      <StyledTextarea
        {...field}
        {...props}
        id={field.name}
        rows={props.rows}
        error={showError}
        required={required}
      />
      <CharsCounter
        maxLength={props.maxLength}
        currentLength={field.value ? field.value.length : 0}
      />
      <ValidationError show={showError && !compactMode}>
        {error}
      </ValidationError>
    </StyledTextareaWrapper>
  )
}

FormikTextarea.defaultProps = {
  labelBarComponentPosition: 'right',
  rows: 5
}

export default FormikTextarea
