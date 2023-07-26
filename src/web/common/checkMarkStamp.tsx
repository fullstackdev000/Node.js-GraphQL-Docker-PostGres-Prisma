import * as React from 'react'
import CheckMarkSvg from '../assets/svg/checkmark.svg'
import styled from './styled-components'

export interface CheckMarkStampProps {
  className?: string
}

const StyledCheckmark = styled(CheckMarkSvg) `
  width: 50%;
  height: 40%;
  fill: white;
`

const StyledStamp = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height:  50px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
`

const CheckMarkStamp: React.FunctionComponent<CheckMarkStampProps> = props => {
  return (
    <StyledStamp className={props.className}>
      <StyledCheckmark/>
    </StyledStamp>
  )
}

export default CheckMarkStamp
