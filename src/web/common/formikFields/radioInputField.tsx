import { FieldProps } from 'formik'
import * as React from 'react'
import { UnreachableCaseError } from '../../../lib/error'
import styled from '../styled-components'

const StyledInput = styled.input`
  display: none;
`

const LabelText = styled.span`
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const fakeRadioSize = 30
const fakeRadioSizeSmall = 8

const Faker = styled.span<{ size: RadioSize }>`
  position: relative;
  display: block;
  flex: 0 0 auto;
  width: ${props => props.size !== 'm' ? fakeRadioSizeSmall : fakeRadioSize}px;
  height: ${props => props.size !== 'm' ? fakeRadioSizeSmall : fakeRadioSize}px;
  border-radius: ${props => props.size !== 'm' ? fakeRadioSizeSmall / 2 : fakeRadioSize / 2}px;
  background: ${props => props.size !== 'm' ? 'transparent' : props.theme.colors.INFO_BORDER};

  &:after {
    content: '';
    display: ${props => props.size !== 'm' ? 'block' : 'none'};
    position: absolute;

    ${props => {
      switch (props.size) {
        case 'm':
          return `
            top: -6px;
            left: -6px;
            bottom: -6px;
            right: -6px;
          `
        case 's':
          return `
            top: -7px;
            left: -7px;
            bottom: -7px;
            right: -7px;
          `
        case 'xs':
          return `
            top: -4px;
            left: -4px;
            bottom: -4px;
            right: -4px;
          `

        default:
          throw new UnreachableCaseError(props.size)
      }
    }}
    border-radius: 21px;
    border: 2px solid ${props => props.theme.colors.INFO_BORDER};
    box-shadow: 0 0 10px ${props => props.size !== 'm' ? 'transparent' : props.theme.colors.BORDER};
  }
`

type Position = 'left' | 'right' | 'bottom' | 'top'

interface LabelProps {
  position: Position
  size: RadioSize
}

const labelMargin = 20
const labelMarginSmall = 15
const Label = styled.label<LabelProps>`
  ${({ position }) => {
    switch (position) {
      case 'left':
      case 'right':
        return `
          flex-wrap: nowrap;
        `
      case 'top':
      case 'bottom':
        return `
          flex-direction: column;
          align-items: center;
        `
      default:
        throw new UnreachableCaseError(position)
    }
  }}

  ${LabelText} {
    ${({ position, size }) => {
      switch (position) {
        case 'left':
          return `
            order: 0;
            margin: 0 ${size !== 'm' ? labelMarginSmall : labelMargin}px 0 0;
          `
        case 'right':
          return `
            order: 1;
            margin: 0  0 0 ${size !== 'm' ? labelMarginSmall : labelMargin}px;
          `
        case 'top':
          return `
            order: 0;
            margin: 0 0 12px 0;
            width: 100%;
          `
        case 'bottom':
          return `
            order: 1;
            margin: 12px 0 0 0;
            width: 100%;
          `
        default:
          throw new UnreachableCaseError(position)
      }
    }
  }

  ${Faker} {
    order: ${props => props.position === 'right' ? 0 : 1};
  }
`

const StyledInputWrapper = styled.div<LabelProps>`
  margin: ${props => props.position === 'right' ? '15px 0 15px 5px' : '15px 0'};

  ${({ position, size }) => {
    switch (position) {
      case 'left':
      case 'right':
        return `
          margin-right: ${size !== 'm' ? '25px' : '35px'};
        `
      case 'top':
      case 'bottom':
        return `
          margin-right: 30px;
        `
      default:
        throw new UnreachableCaseError(position)
    }
  }}

  ${Label} {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 13px;
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-weight: 500;
  }

  ${StyledInput} {
    &:checked + ${LabelText} {
      color: ${props => props.theme.colors.FIELD_TEXT};

      & + ${Faker} {
        position: relative;
        background: ${props => props.theme.colors.GREEN};

        &:after {
          display: block;
        }
      }
    }
  }
`

type RadioSize = 'm' | 's' | 'xs'

interface CustomProps {
  className?: string
  label: string | JSX.Element
  value: string
  labelPosition: Position
  size: RadioSize
}

type FormikRadioButtonProps = FieldProps & CustomProps
const FormikRadioButton: React.FunctionComponent<FormikRadioButtonProps> = ({
  className,
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  size,
  ...props
}) => (
  <StyledInputWrapper className={className} position={props.labelPosition} size={size}>
    <Label position={props.labelPosition} size={size}>
      <StyledInput
        {...field}
        {...props}
        type='radio'
        checked={field.value === props.value}
        onClick={() => {
          form.setFieldTouched(field.name)
        }}
      />
      <LabelText>{props.label}</LabelText>
      <Faker size={size} />
    </Label>
  </StyledInputWrapper>
)

FormikRadioButton.defaultProps = {
  labelPosition: 'right',
  size: 'm'
}

export default FormikRadioButton
