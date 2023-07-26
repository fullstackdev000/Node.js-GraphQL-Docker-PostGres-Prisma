// import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { Check } from 'styled-icons/fa-solid'
import styled from '../../../common/styled-components'

const StyledFalseIcon = styled.span`
  &:after {
    display: block;
    content: '\\00d7';
    color: ${props => props.theme.colors.BUTTON_BORDER};
    text-align: center;
    font-size: 45px;
    font-weight: 400;
    line-height: 20px;
  }
`

const StyledCheckmark = styled(Check)`
  display: block;
  margin: auto;
  color: ${props => props.theme.colors.GREEN};
`

export const BooleanIcon: React.FunctionComponent<{ value: boolean }> = ({ value }) => (
  value ? <StyledCheckmark size='20' /> : <StyledFalseIcon />
)
