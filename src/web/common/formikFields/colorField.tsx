import { UnreachableCaseError } from '#veewme/lib/error'
import * as ColorString from 'color-string'
import { FieldProps } from 'formik'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { BlockPicker, ChromePicker, ColorResult, GithubPicker, RGBColor } from 'react-color'
import styled from '../styled-components'
import { Label } from './styled'

const ColorSwatch = styled.div<{ color: string }>`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  padding: 4px;
  border: 4px solid  #fff;
  border-radius: 2px;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.color};
  }
`

const SwatchWrapper = styled.div`
  position: relative;
  border: 1px solid  ${props => props.theme.colors.BORDER};
  border-radius: 1px;
  display: flex;
  cursor: pointer;
  box-shadow: 0 0 5px ${props => props.theme.colors.BORDER};
`

const Popover = styled.div<{
  position?: Position
}>`
  position: absolute;
  top: 28px;
  left: 0;
  ${props => props.position === 'left' && `
    left: unset;
    right: 25px;
    top: -38px;
    z-index: 200;
    background-color: #fff;
  `}
`

// TODO: move zIndexes of main 'overlay' components to Theme (e.g. fixed Header, Modal)
// This will make managing zIndex of other component easier
const zIndex = 400

const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  cursor: pointer;
  z-index: ${zIndex};
`

const PickerWrapper = styled.div`
  position: relative;
  z-index: ${zIndex + 1};
`

const StyledInputWrapper = styled.div<{labelLast?: boolean}>`
  display: flex;
  ${props => props.labelLast && 'flex-direction: row-reverse'};
  align-items: center;
  padding: 10px 0;
  position: relative;

  ${Label} {
    width: auto;
    flex: 0 0 auto;
    margin: ${props => props.labelLast ? '0 0 0 10px' : '0 10px 0 0'};
  }
`

const defaultColor: RGBColor = {
  a: 1,
  b: 0,
  g: 0,
  r: 0
}

const defaultColorPalette = [
  '#000000',
  '#919191',
  '#a82216',
  '#ED210D',
  '#FF7E79',
  '#FE8002',
  '#FCCB00',
  '#945200',
  '#008B02',
  '#929100',
  '#1473DE',
  '#5300EB',
  '#021893',
  '#942193'
]

export const rgbaToString = (color: RGBColor) => {
  // alpha channel ('a') is optional
  if (typeof color.a !== 'undefined') {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  } else {
    return `rgba(${color.r}, ${color.g}, ${color.b})`
  }
}

export const stringToRgba = (color: string): RGBColor => {
  let rgbaValues = ColorString.get.rgb(color)
  if (!rgbaValues) {
    rgbaValues = [0, 0, 0, 1]
  }
  return {
    a: rgbaValues[3],
    b: rgbaValues[2],
    g: rgbaValues[1],
    r: rgbaValues[0]
  }
}

type PickerType = 'chrome' | 'block' | 'github'
type Position = 'left' | 'right' // TODO: add support for other positions

interface CustomProps {
  label?: React.ReactNode
  labelLast?: boolean
  pickerType?: PickerType
  position?: Position
  className?: string
}

type ColorFieldRawProps = CustomProps & {
  value?: RGBColor
  onChange: (color: ColorResult) => void
  name?: string
}
export const ColorFieldRaw: React.FunctionComponent<ColorFieldRawProps> = ({ pickerType = 'chrome', ...props }) => {

  const value: RGBColor = typeof props.value === 'undefined' ? defaultColor : props.value
  const colorStringValue = rgbaToString(value)

  const [ colorPickerVisible, setColorPickerVisibility ] = useState<boolean>(false)
  const toggleColorPicker = useCallback(() => setColorPickerVisibility(prev => !prev), [])
  const handleEscKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleColorPicker()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleEscKeyDown)
    return () => {
      window.removeEventListener('keydown', handleEscKeyDown)
    }
  }, [])

  return (
    <StyledInputWrapper labelLast={props.labelLast} className={props.className}>
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <SwatchWrapper>
        <ColorSwatch color={colorStringValue} onClick={toggleColorPicker} />
        { colorPickerVisible && (
          <Popover position={props.position}>
            <Cover onClick={toggleColorPicker} />
            <PickerWrapper>
              {(() => {
                switch (pickerType) {
                  case 'chrome':
                    return (
                      <ChromePicker
                        color={value}
                        onChange={color => {
                          props.onChange(color)
                        }}
                      />
                    )
                  case 'block':
                    return (
                      <BlockPicker
                        color={value}
                        triangle='hide'
                        onChange={color => {
                          props.onChange(color)
                        }}
                      />
                    )
                  case 'github':
                    return (
                      <GithubPicker
                        colors={defaultColorPalette}
                        color={value}
                        triangle='hide'
                        width='188px'
                        onChange={color => {
                          props.onChange(color)
                        }}
                      />
                    )
                  default:
                    throw new UnreachableCaseError(pickerType)
                }
              })()}
            </PickerWrapper>
          </Popover>)
        }
      </SwatchWrapper>
    </StyledInputWrapper>
  )
}

type ColorFieldProps = FieldProps & CustomProps
const ColorField: React.FunctionComponent<ColorFieldProps> = ({
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <ColorFieldRaw
      {...props}
      value={field.value}
      onChange={color => {
        form.setFieldValue(field.name, color.rgb)
        form.setFieldTouched(field.name)
      }}
      name={field.name}
    />
  )
}

export default ColorField
