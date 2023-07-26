import * as React from 'react'
import styled from '../styled-components'

const StyledCarouselIndicatorItem = styled.div<{ active?: boolean }> `
  border: 5px solid ${props => props.active ? props.theme.colors.BUTTON_BORDER_HOVER : props.theme.colors.BUTTON_BORDER};
  border-radius: 5px;
  margin: 0 10px;
`

const StyledWrapper = styled.div `
  display: flex;
  justify-content: center;
`

interface CarouselIndicatorProps {
  itemsTotal: number
  activeItems?: number[]
}

const CarouselIndicator: React.FunctionComponent<CarouselIndicatorProps> = props => (
  <StyledWrapper>
    {[...Array(props.itemsTotal).keys()].map((_, i) => (
        <StyledCarouselIndicatorItem key={i} active={props.activeItems && props.activeItems.includes(i)}/>
    ))}
  </StyledWrapper>
)

export default CarouselIndicator
