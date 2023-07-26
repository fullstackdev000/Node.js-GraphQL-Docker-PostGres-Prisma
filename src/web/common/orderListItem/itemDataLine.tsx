import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { StyledOrderItemText } from './styled'

const StyledItemText = styled(StyledOrderItemText) `
  margin: 7px 0 3px 0;
  min-width: 0;
`

const StyledLabel = styled.span `
  color: ${props => props.theme.colors.LABEL_TEXT};
`

interface ItemDataLineProps {
  title: string,
  value: React.ReactNode
  className?: string
}

const ItemDataLine: React.FunctionComponent<ItemDataLineProps> = props => (
  <StyledItemText className={props.className} >
    <StyledLabel>
      {props.title}
    </StyledLabel>
    {props.value}
  </StyledItemText>
)

export default ItemDataLine
