import { FieldProps } from 'formik'
import Slider, { createSliderWithTooltip, Range, RangeProps, SliderProps, WithTooltipProps } from 'rc-slider'
import 'rc-slider/assets/index.css'
import * as React from 'react'
import styled, { css } from '../styled-components'
import { Label } from './styled'

const SliderWithTooltip = createSliderWithTooltip(Slider)
const RangeWithTooltip = createSliderWithTooltip(Range)

export const SliderFieldStyle = css`
  display: flex;
  flex-wrap: wrap;

  ${Label} {
    width: 100%;
    margin-bottom: 20px;
  }

 .rc-slider {
   &-track {
     background-color: ${props => props.theme.colors.GREEN};
   }

   &-handle {
     width: 2px;
     border-radius: 2px;
     margin-left: 0;
     height: 22px;
     margin-top: -9px;
     border-color: ${props => props.theme.colors.FIELD_TEXT};

     &-click-focused:focus,
     &:active,
     &:focus,
     &:hover {
       border-color: ${props => props.theme.colors.FIELD_TEXT};
       box-shadow: none;
     }
   }
 }
`

const SliderFieldWrapper = styled.div`
  ${SliderFieldStyle}
`

export const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
`

const ValueLabel = styled.span`
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-weight: 500;
  margin-left: 20px;
`

interface CustomProps {
  className?: string
  label?: string
  unit?: string
}

interface PureSliderCustomProps {
  htmlFor?: string
  value: number
  onChange: (value: number) => void
}

type PureSliderProps = PureSliderCustomProps & SliderProps & CustomProps & WithTooltipProps

const PureSlider: React.FunctionComponent<PureSliderProps | PureSliderProps & FieldProps> = props => {
  const {
    className,
    label,
    htmlFor,
    value,
    onChange,
    unit,
    ...rest
  } = props
  return (
    <SliderFieldWrapper className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      <SliderWrapper>
        <SliderWithTooltip
          {...rest}
          value={value}
          onChange={onChange}
        />
        <ValueLabel>{value}{unit}</ValueLabel>
      </SliderWrapper>
    </SliderFieldWrapper>
  )
}

interface PureRangeSliderCustomProps {
  htmlFor?: string
  value: number[]
  onChange: (value: number[]) => void
}

type PureRangeSliderProps = PureRangeSliderCustomProps & RangeProps & WithTooltipProps & CustomProps

const PureRangeSlider: React.FunctionComponent<PureRangeSliderProps | PureRangeSliderProps & FieldProps> = props => {
  const {
    className,
    label,
    htmlFor,
    value,
    onChange,
    ...rest
  } = props
  return (
    <SliderFieldWrapper className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      <RangeWithTooltip
        {...rest}
        value={value}
        onChange={onChange}
      />
    </SliderFieldWrapper>
  )
}

type SliderFieldProps = FieldProps & SliderProps & CustomProps & WithTooltipProps
const SliderField: React.FunctionComponent<SliderFieldProps> = ({
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const value: number = field.value
  return (
    <PureSlider
      {...props}
      value={value}
      onChange={(val: number) => form.setFieldValue(field.name, val)}
      htmlFor={field.name}
    />
  )
}

type RangeSliderFieldProps = FieldProps & RangeProps & WithTooltipProps & CustomProps
const RangeSliderField: React.FunctionComponent<RangeSliderFieldProps> = ({
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const value: number[] = field.value
  return (
    <PureRangeSlider
      {...props}
      htmlFor={field.name}
      value={value}
      onChange={(val: number[]) => form.setFieldValue(field.name, val)}
    />
  )
}

export { PureRangeSlider, PureSlider, SliderField, RangeSliderField }
