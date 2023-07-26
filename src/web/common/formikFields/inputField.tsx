import Tooltipped from '#veewme/web/common/tooltipped'
import { FieldProps, getIn } from 'formik'
import * as React from 'react'
import styled from '../styled-components'
import { fieldBottomMargin, Label, ValidationError } from './styled'

export const StyledInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`

export const FakeInput = styled.div<{
  focus: boolean
  error?: boolean
  compactMode?: boolean
  disabled?: boolean
  required?: boolean
}>`
  margin-bottom: ${props => props.compactMode ? '5px' : fieldBottomMargin};
  border-radius: 5px;
  font-size: 13px;
  box-sizing: border-box;
  height: 32px;
  width: 100%;
  background-color: ${props => props.disabled ? props.theme.colors.BACKGROUND : '#fff'};
  display: flex;
  border: 2px solid ${props => props.error ? props.theme.colors.ALERT : props.theme.colors.BORDER};
  ${props => (
    props.focus && `
      border-color: ${props.theme.colors.GREEN};
      outline: none;
    `
  )}
  ${props => props.required && `
    border-left: 5px solid ${props.theme.colors.ALERT};
  `}
`

const PassedComponentWrapper = styled.div`
  flex-basis: fit-content;
  flex: 0 0;
  display: flex;
  align-items: center;
`

export const StyledInput = styled.input`
  padding: 5px 10px;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  flex-basis: fill;
  flex: 1 1;
`

export const Counter = styled.span`
  display: flex;
  align-items: center;
`

const CounterInner = styled.span<{
  alert?: boolean
}>`
  width: 23px;
  height: 23px;
  padding: 3px;
  margin-right: 2px;
  background: ${props => props.alert ? props.theme.colors.ALERT : props.theme.colors.BUBBLE_BACKGROUND};
  font-size: 11px;
  border-radius: 100%;
  text-align: center;
  color: #fff;
  line-height: 18px;
  cursor: pointer;
`

const CounterTooltipText = styled.div`
  padding: 2px;
  font-size: 11px;
  line-height: 18px;

  strong {
    font-weight: 500;
  }
`

const CharsCounterRaw: React.FC<{
  maxLength?: number
  currentLength?: number
}> = ({
  currentLength = 0,
  maxLength
}) => {
  const charsLeft = maxLength ? maxLength - currentLength : 0

  const tooltipContent = (
    <CounterTooltipText>
      Max text length: <strong>{maxLength}</strong><br/>
      Characters left: <strong>{charsLeft}</strong>
    </CounterTooltipText>
  )

  if (!maxLength) {
    return null
  }

  return (
    <Counter>
      <Tooltipped
        position='top'
        tooltip={tooltipContent}
      >
        <PassedComponentWrapper>
          <CounterInner alert={!charsLeft}>
            {charsLeft}
          </CounterInner>
        </PassedComponentWrapper>
      </Tooltipped>
    </Counter>
  )
}

export const CharsCounter = React.memo(CharsCounterRaw)

interface CustomProps {
  className?: string
  label?: string
  leftComponent?: JSX.Element
  rightComponent?: JSX.Element
  disabled?: boolean
  maxLength?: number
  compactMode?: boolean // in compactMode field doesn't display error message and its bottom margin is smaller
  autoFocus?: boolean
  required?: boolean
}

interface FormikInputState {
  focus: boolean
}

type FormikInputProps = FieldProps & CustomProps
class FormikInput extends React.PureComponent<FormikInputProps, FormikInputState> {
  state = {
    focus: false
  }
  render () {
    const {
      className,
      field, // { name, value, onChange, onBlur }
      form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
      required,
      ...props
    } = this.props
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

    return (
      <StyledInputWrapper className={className} >
        {props.label && <Label htmlFor={field.name} error={showError}>{props.label}</Label>}
        <FakeInput
          focus={this.state.focus}
          error={showError}
          compactMode={compactMode}
          disabled={props.disabled}
          required={required}
        >
          {
            props.leftComponent &&
            <PassedComponentWrapper>
              {props.leftComponent}
            </PassedComponentWrapper>
          }
          <StyledInput
            {...field}
            {...props}
            id={field.name}
            value={value}
            onFocus={() => { this.setState({ focus: true }) }}
            onBlur={e => {
              form.handleBlur(e)
              this.setState({ focus: false })
            }}
          />
          <ValidationError show={showError && !compactMode}>{error}</ValidationError>
          <CharsCounter
            maxLength={props.maxLength}
            currentLength={value.length}
          />
          {
            props.rightComponent &&
            <PassedComponentWrapper>
              {props.rightComponent}
            </PassedComponentWrapper>
          }
        </FakeInput>
      </StyledInputWrapper>
    )
  }
}

export default FormikInput
