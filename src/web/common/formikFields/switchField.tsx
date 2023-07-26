import { FieldProps, getIn } from 'formik'
import * as React from 'react'
import styled from '../styled-components'
import { ValidationError } from './styled'

const StyledInput = styled.input.attrs({
  type: 'checkbox'
})`
  display: none;
`

const LabelText = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.FIELD_TEXT};
`

const Faker = styled.span`
  position: relative;
  top: 2px;
  flex: 0 0 auto;
  width: 24px;
  height: 12px;
  border-radius: 6px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  cursor: pointer;

  &:before {
    display: block;
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 100%;
    background-color:  ${props => props.theme.colors.BORDER};
    left: -3px;
    top: -3px;
  }
`

const Label = styled.label<{ labelFirst?: boolean }>`
    display: flex;
    flex: 1 0 auto;
    align-items: top;
    color: ${props => props.theme.colors.FIELD_TEXT};
    cursor: pointer;

    ${LabelText} {
      order: ${({ labelFirst }) => labelFirst ? 0 : 1};
      margin: ${({ labelFirst }) => labelFirst ? '0 10px 0 0' : '0 0 0 10px'};
    }
`

export const FieldWrapper = styled.div<{ compactMode?: boolean }>`
  position: relative;
  padding: 10px 0;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  ${props => !props.compactMode && 'padding-bottom: 12px;'}
  ${props => !props.compactMode && 'margin-bottom: 12px;'}


  ${StyledInput} {
    &:checked + ${LabelText} {
      & + ${Faker} {
        &:before {
          background-color: ${props => props.theme.colors.GREEN};
          left: unset;
          right: -3px;
        }
      }
    }
    &[disabled] + ${LabelText} {
      color: ${props => props.theme.colors.LABEL_TEXT};
      font-weight: 400;
    }
  }
`

interface CustomProps {
  // label in some cases may require custom styling and html structure so it can't be just string
  label: JSX.Element | string
  labelFirst?: boolean
  // allows wrapping component in styled-component to override styles if needed
  className?: string
  compactMode?: boolean
}

interface SwitchProps extends CustomProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  value?: boolean
}

export const Switch: React.FunctionComponent<SwitchProps> = props => {
  return (
     <FieldWrapper className={props.className} compactMode={props.compactMode}>
      <Label labelFirst={props.labelFirst}>
       <StyledInput
         name={props.name}
         type='checkbox'
         checked={!!props.value}
         onChange={props.onChange}
       />
       <LabelText>{props.label}</LabelText>
       <Faker />
     </Label>
     {props.children}
    </FieldWrapper>
  )
}

type FormikSwitchProps = FieldProps & CustomProps
const FormikSwitch: React.FunctionComponent<FormikSwitchProps> = ({
  compactMode = true,
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const error = getIn(form.errors, field.name)
  const touched = getIn(form.touched, field.name)
  const showError = error && (touched || form.submitCount)

  return (
    <Switch
      {...field}
      {...props}
      compactMode={compactMode}
      onChange={e => {
        form.handleChange(e)
        form.setFieldTouched(field.name)
      }}
    >
      <ValidationError show={showError && !compactMode}>{error}</ValidationError>
    </Switch>
  )
}

export default FormikSwitch
