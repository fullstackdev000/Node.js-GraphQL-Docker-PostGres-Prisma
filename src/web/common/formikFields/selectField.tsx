import { FieldProps, getIn } from 'formik'
import * as React from 'react'
import ReactSelect, { components } from 'react-select'
import { ValueContainerProps } from 'react-select/lib/components/containers'
import { IndicatorProps } from 'react-select/lib/components/indicators'
import { FocusEventHandler, Theme } from 'react-select/lib/types'
import { Search } from 'styled-icons/boxicons-regular/Search'
import Arrow from '../../assets/svg/arrow.svg'
import XSvg from '../../assets/svg/x.svg'
import { themeColors } from '../colors'
import styled from '../styled-components'
import { fieldBottomMargin, Label, ValidationError } from './styled'

export const StyledSelectWrapper = styled.div<{
  error?: boolean,
  compactMode?: boolean ,
  required?: boolean
}>`
  position: relative;
  min-width: 200px;
  font-size: 13px;

  ${ValidationError} {
    bottom: -18px;
  }

  && > div {
    width: 100%;
    box-shadow: none;
    margin-bottom: ${props => props.compactMode ? '5px' : fieldBottomMargin};

    & > div  {
      border-width: 2px;
      min-height: 32px;
      ${props => props.error && `border-color ${props.theme.colors.ALERT};`}

      &:first-of-type  {
        ${props => props.required && `
          border-left: 5px solid ${props.theme.colors.ALERT};
        `}
      }
    }

    & > div:first-of-type  {
      box-shadow: none;
    }
  }
`

export const StyledClearIndicator = styled(XSvg)`
  margin-left: 8px;
  width: 12px;
  height: 12px;
  fill: ${props => props.theme.colors.ALERT};
  cursor: pointer;
`

const ClearIndicator = (props: IndicatorProps<any>) => {
  const { children = <StyledClearIndicator/>, innerProps: { ref, ...restInnerProps } } = props
  return (
    <div {...restInnerProps} ref={ref}>
      {children}
    </div>
  )
}

export const StyledDropdownIndicator = styled(Arrow)`
  margin: 0 9px;
  width: 11px;
  height: 11px;
  fill: ${props => props.theme.colors.GREEN};
`

const IndicatorSeparator = () => (null)

const SearchIcon = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  & > svg {
    width: 80%;
    fill: ${props => props.theme.colors.LABEL_TEXT};
  }
  & ~ * {
    cursor: text;
    padding-left: 25px;
  }
`

const StyledValue = styled(components.ValueContainer)`
  padding-left: 40px;
  cursor: text;
`
const ValueContainer = (props: ValueContainerProps<any> & { isSearchable?: boolean }) => {
  const { isSearchable, ...valueProps } = props
  if (isSearchable) {
    return (
      <StyledValue {...valueProps} >
        <>
          <SearchIcon><Search/></SearchIcon>
          {props.children}
        </>
      </StyledValue>
    )
  } else {
    return (
      <components.ValueContainer {...valueProps} />
    )
  }
}

export interface OptionValue<T = string | number, K = string> {
  customData?: K
  label: string
  value: T
  options?: Array<OptionValue<T, K>>
}

interface SelectCustomProps<T, K> {
  options: Array<OptionValue<T, K>>
  label?: string
  className?: string
  isSearchable?: boolean
}

type SingleSelectedType<T, K> = OptionValue<T, K> | undefined | null
// below type needed because of react-select type bug
// https://github.com/JedWatson/react-select/issues/2902
type SelectedType<T, K> = Array<OptionValue<T, K>> | SingleSelectedType<T, K>

// Type-guard that determines whether single options is selected
export function isSelectedSingleValue<T, K> (val: SelectedType<T, K>): val is OptionValue<T, K> {
  return !Array.isArray(val) && ((val as OptionValue<T, K>).value !== undefined)
}

export const customTheme = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    neutral20: themeColors.BORDER,
    neutral30: themeColors.BORDER,
    neutral5: themeColors.BACKGROUND,
    primary: themeColors.GREEN
  }
})

interface SelectProps<T, K> extends SelectCustomProps<T, K> {
  name?: string
  value?: T
  placeholder?: string
  required?: boolean
  onChange: (selected: SingleSelectedType<T, K>) => void
  components?: Partial<typeof components>
  error?: string
  onBlur?: FocusEventHandler
  compactMode?: boolean
  maxMenuHeight?: number,
  filterOption?: (data: { data: OptionValue<T, K> } , query: string) => boolean // just temp type missing in lib typings TODO: update react-select typings
}

export class Select<T = string, K = string> extends React.Component<SelectProps<T, K>> {
  render () {
    const { className, error, name, label, onBlur, onChange, options, value, required, ...props } = this.props

    const flatOptions = (selectOptions: Array<OptionValue<T, K>>) => {
      let result: Array<OptionValue<T, K>> = []
      selectOptions.forEach(option => {
        result.push(option)
        if (Array.isArray(option.options)) {
          result = result.concat(flatOptions(option.options))
        }
      })
      return result
    }

    // if `value` prop is not passed it means component is used as 'uncontrolled' and react-select should
    // handle value changes on its own. In such case react-select 'value' prop must be 'undefined'
    const selectValue = typeof value !== 'undefined' ? (flatOptions(options).find(o => o.value === value) || null) : undefined
    const compactMode = props.compactMode === undefined ? !label : props.compactMode

    return (
      <StyledSelectWrapper
        className={className}
        error={!!error}
        compactMode={compactMode}
        required={required}
      >
        {label && <Label htmlFor={name} error={!!error}>{label}</Label>}
        <ReactSelect
          {...props}
          isMulti={false}
          value={selectValue}
          options={options}
          onChange={(selected: SelectedType<T, K>) => {
            // TODO: in case multiple options selection is needed this handler have to be extended
            onChange(selected && isSelectedSingleValue(selected) ? selected : null)
          }}
          isSearchable={props.isSearchable}
          components={{
            ClearIndicator,
            DropdownIndicator: () => <StyledDropdownIndicator />,
            IndicatorSeparator,
            ValueContainer: (valueProps: ValueContainerProps<any>) => (
              <ValueContainer {...valueProps} isSearchable={props.isSearchable} />
            ),
            ...props.components
          }}
          onBlur={onBlur}
          theme={customTheme}
        />
        <ValidationError show={!!error && !compactMode}>{error}</ValidationError>
      </StyledSelectWrapper>
    )
  }
}

export function isString (val: string | any): val is string {
  return typeof val === 'string'
}

type FormikSelectProps<T, K> = FieldProps & SelectCustomProps<T, K>

class FormikSelect<T = string, K = string> extends React.Component<FormikSelectProps<T, K>> {
  render () {
    const { field, form, ...props } = this.props
    const value = typeof field.value !== 'undefined' ? field.value : null
    const errorMsg = getIn(form.errors, field.name)
    const error = !!errorMsg
    const touched = getIn(form.touched, field.name)
    const showError = error && (touched || form.submitCount)

    return (
      <>
        <Select
          {...props}
          error={showError && isString(errorMsg) ? errorMsg : ''}
          value={value}
          name={field.name}
          options={props.options}
          onBlur={() => form.setFieldTouched(field.name)}
          onChange={selected => {
            form.setFieldValue(field.name, selected ? selected.value : null)
            form.validateField(field.name)
            form.setFieldTouched(field.name)
          }}
        />
      </>
    )
  }
}

export default FormikSelect
