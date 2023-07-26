import { UnreachableCaseError } from '#veewme/lib/error'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { StyledIcon } from 'styled-icons/types'
import styled from '../styled-components'
import { ButtonSize } from './basicButton'

const PlainIcon = styled.div<{size: ButtonSize}>`
  ${props => {
    switch (props.size) {
      case 'big': return `
        width: 30px;
        height: 30px;
      `
      case 'medium': return `
        width: 20px;
        height: 20px;
      `
      case 'small': return `
        width: 15px;
        height: 15px;
      `
      default:
        throw new UnreachableCaseError(props.size)
    }
  }}
  background: transparent;
  display: inline-block;
  outline: none;
  border: none;
  cursor: pointer;
  position: relative;
  & > * {
    fill: ${props => props.theme.colors.BORDER};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  &:hover {
    & > * {
      fill: ${props => props.theme.colors.GREEN};
    }
  }
`

interface InitialIconButtonProps {
  className?: string
  disabled?: boolean
  Icon: StyledIcon | React.SVGFactory | React.ComponentType
  size: ButtonSize
}

interface ButtonProps extends InitialIconButtonProps {
  castAs: 'button'
  onClick?: (e: React.MouseEvent) => void
  type: 'button' | 'reset' | 'submit'
}

interface LabelProps extends InitialIconButtonProps {
  castAs: 'label'
  htmlFor: string
  onClick?: (e: React.MouseEvent) => void
}

interface LinkProps extends InitialIconButtonProps {
  castAs: 'link'
  to: string
}

interface RawLinkProps extends InitialIconButtonProps {
  castAs: 'a'
  href: string
  download?: boolean
  target?: string
}

type IconButtonProps = ButtonProps | LabelProps | LinkProps | RawLinkProps

const IconButton: React.FunctionComponent<IconButtonProps> = ({ castAs, Icon, ...props }) => {
  return (
    <PlainIcon
      as={castAs === 'link' ? Link : castAs}
      {...props}
    >
      <Icon />
    </PlainIcon>
  )
}

IconButton.defaultProps = {
  size: 'medium',
  type: 'button'
}

export default IconButton
