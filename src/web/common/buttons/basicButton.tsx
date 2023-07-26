import * as React from 'react'
import { Link } from 'react-router-dom'
import { StyledIcon } from 'styled-icons/types'
import { UnreachableCaseError } from '../../../lib/error'
import styled, { AnyStyledComponent, css, ThemeInterface } from '../styled-components'

interface BasicButtonTheme {
  backgroundColor: string
  backgroundColorActionModified: string
  borderColor: string
  borderColorActionModified: string
  color: string
  colorActionModified: string,
  fill: string
}

type ButtonType = 'action' | 'alert' | 'info' | 'primary'
type ButtonColors = {[K in ButtonType]: {
  actionColor: string
  inversedTextColor: string
  primaryColor: string
}}

const createButtonTheme = (themeColors: ThemeInterface['colors'], type: ButtonType, full?: boolean, inverseTextColor?: boolean): BasicButtonTheme => {
  const buttonThemeColors: ButtonColors = {
    action: {
      actionColor: themeColors.DARKER_GREEN,
      inversedTextColor: themeColors.LIGHT_BLUISH_GREY,
      primaryColor: themeColors.GREEN
    },
    alert: {
      actionColor: themeColors.ALERT_HOVER,
      inversedTextColor: themeColors.LIGHT_BLUISH_GREY,
      primaryColor: themeColors.ALERT
    },
    info: {
      actionColor: themeColors.BUTTON_INFO_HOVER,
      inversedTextColor: themeColors.LIGHT_BLUISH_GREY,
      primaryColor: themeColors.BLUE
    },
    primary: {
      actionColor: themeColors.GREEN,
      inversedTextColor: themeColors.FIELD_TEXT,
      primaryColor: themeColors.LIGHT_BLUISH_GREY
    }
  }
  if (full) {
    return {
      backgroundColor: buttonThemeColors[type].primaryColor,
      backgroundColorActionModified: buttonThemeColors[type].actionColor,
      borderColor: buttonThemeColors[type].primaryColor,
      borderColorActionModified: buttonThemeColors[type].actionColor,
      color:  inverseTextColor ? themeColors.FIELD_TEXT : 'white',
      colorActionModified: inverseTextColor ? themeColors.FIELD_TEXT : 'white',
      fill: inverseTextColor ? themeColors.FIELD_TEXT : 'white'
    }
  } else {
    return {
      backgroundColor: 'transparent',
      backgroundColorActionModified: 'transparent',
      borderColor: buttonThemeColors[type].primaryColor,
      borderColorActionModified: buttonThemeColors[type].actionColor,
      color: inverseTextColor ? buttonThemeColors[type].primaryColor : themeColors.FIELD_TEXT,
      colorActionModified: buttonThemeColors[type].actionColor,
      fill: inverseTextColor ? buttonThemeColors[type].primaryColor : themeColors.FIELD_TEXT
    }
  }
}

export type ButtonSize = 'big' | 'medium' | 'small'

interface StyledComponentProps {
  iconIsDefined?: boolean
  iconLast?: boolean
  inverseTextColor?: boolean
  labelIsDefined?: boolean
  size?: ButtonSize
  theme: ThemeInterface
  buttonTheme: ButtonType
  full?: boolean
  disabled?: boolean
}

export const buttonStyle = (props: StyledComponentProps) => {
  const buttonTheme = createButtonTheme(props.theme.colors, props.buttonTheme, props.full, props.inverseTextColor)
  const buttonDimensionPx = (() => {
    switch (props.size) {
      case 'big': return 35
      case undefined:
      case 'medium': return 30
      case 'small': return 25
      default: throw new UnreachableCaseError(props.size)
    }
  })()
  return css`
    position: relative;
    display: inline-flex;
    flex-direction: ${() => props.iconLast ? 'row-reverse' : 'row'};
    align-items: center;
    justify-content: center;
    padding: ${() => {
      if (!props.iconIsDefined) {
        return '2px 15px'
      } else if (props.iconIsDefined && props.labelIsDefined) {
        return props.iconLast ? '2px 10px 2px 15px' : '2px 15px 2px 10px'
      }
      return ''
    }};
    border-radius: 2px;
    border-style: solid;
    border-width: 2px;
    border-radius: 3px;
    font-size: ${() => {
      switch (props.size) {
        case 'big': return '13px'
        case undefined:
        case 'medium': return '12px'
        case 'small': return '11px'
        default: throw new UnreachableCaseError(props.size)
      }
    }};
    font-weight: 600;
    outline: none;
    cursor: pointer;
    height: ${() => `${buttonDimensionPx}px`};
    opacity: ${props.disabled ? '0.5' : 1};
    pointer-events: ${props.disabled ? 'none' : 'auto'};
    ${() => props.iconIsDefined && !props.labelIsDefined ? `width: ${buttonDimensionPx}px` : ''};
    &, &:visited:not(:disabled) {
      border-color: ${buttonTheme.borderColor};
      background-color: ${buttonTheme.backgroundColor};
      color: ${buttonTheme.color};
      &:hover:not(:disabled), &:active:not(:disabled), &:focus:not(:disabled) {
        border-color: ${buttonTheme.borderColorActionModified};
        background-color: ${buttonTheme.backgroundColorActionModified};
        color: ${buttonTheme.colorActionModified};
        & > svg {fill: ${buttonTheme.colorActionModified}};
      }
      & > svg {
        fill: ${buttonTheme.fill};
        height: 50%;
        max-width: ${() => `${buttonDimensionPx * 0.4}px`};
        max-height: ${() => `${buttonDimensionPx * 0.4}px`};
        ${() => {
          if (props.labelIsDefined && !props.iconLast) {
            return 'margin-right: 7px'
          } else if (props.labelIsDefined && props.iconLast) {
            return 'margin-left: 7px'
          } else {
            return ''
          }
        }};
      }
    }
    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
}

const CommonButton = styled(({ type, onClick, disabled, ...props }) => (
  <button className={props.className} onClick={onClick} type={type} disabled={disabled}>
    {props.children}
  </button>
))<StyledComponentProps>`
  ${buttonStyle}
`

const LinkButton = styled(({ to, ...props }) => (
  <Link to={to} className={props.className}>
    {props.children}
  </Link>
))<StyledComponentProps>`
  ${buttonStyle}
`

const AButton = styled(({ className, href, target = '_self', children }) => (
  <a href={href} target={target} className={className}>
    {children}
  </a>
))<StyledComponentProps>`
  ${buttonStyle}
`

interface InitialButtonProps {
  buttonTheme?: ButtonType
  children?: never
  className?: string
  disabled?: boolean
  full?: boolean
  iconLast?: boolean
  inverseTextColor?: boolean
  size?: ButtonSize
}

interface LinkProps extends InitialButtonProps {
  to: string
  onClick?: never
  type?: never
  disabled?: boolean
  href?: never
  target?: never
}

interface AProps extends InitialButtonProps {
  href: string
  target?: string
  onClick?: never
  type?: never
  to?: never
}

interface ButtonProps extends InitialButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'reset' | 'submit'
  to?: never
  disabled?: boolean
  href?: never
  target?: never
}

type Icon = StyledIcon | React.SVGFactory

interface LinkLabelRequired extends LinkProps {
  label: string
  icon?: Icon
}

interface LinkIconRequired extends LinkProps {
  label?: string
  icon: Icon
}

interface ButtonLabelRequired extends ButtonProps {
  label: string
  icon?: Icon
}

interface ButtonIconRequired extends ButtonProps {
  label?: string
  icon: Icon
}

interface ALabelRequired extends AProps {
  label: string
  icon?: Icon
}

interface AIconRequired extends AProps {
  label?: string
  icon: Icon
}

export type BasicButtonProps = LinkLabelRequired | LinkIconRequired | ButtonLabelRequired | ButtonIconRequired | ALabelRequired | AIconRequired

const Button: React.FunctionComponent<BasicButtonProps> = props => {
  let Component: AnyStyledComponent
  if (props.to) {
    Component = LinkButton
  } else if (props.href) {
    Component = AButton
  } else {
    Component = CommonButton
  }

  return (
    <Component
      buttonTheme={props.buttonTheme}
      className={props.className}
      disabled={props.disabled}
      full={!!props.full}
      iconIsDefined={!!props.icon}
      iconLast={!!props.iconLast}
      inverseTextColor={!!props.inverseTextColor}
      labelIsDefined={!!props.label}
      onClick={props.onClick}
      size={props.size}
      to={props.to}
      type={props.type}
      href={props.href}
      target={props.target}
    >
      {props.icon && <props.icon/>}
      {props.label}
    </Component>
  )
}

Button.defaultProps = {
  buttonTheme: 'primary',
  size: 'medium',
  type: 'button'
}

export default Button
