import * as React from 'react'
import styled from './styled-components'

const StyledFlipCard = styled.div `
  position: relative;
  width: 100%;
  height: 100%;
`

const StyledCardSide = styled.div `
  position: absolute;
  top: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform 400ms ease-in-out;
`

const StyledCardFront = styled(StyledCardSide)<{ flipped?: boolean }> `
  transform: rotateY(${props => props.flipped ? '180deg' : '0'});
  z-index: 10;
`

const StyledCardBack = styled(StyledCardSide)<{ flipped?: boolean }> `
  transform: rotateY(${props => props.flipped ? '0' : '180deg'});
`

export interface FlipCardProps {
  cardFront: React.ReactNode
  cardBack: React.ReactNode
  className?: string
  flipped?: boolean
}

const FlipCard: React.FunctionComponent<FlipCardProps> = props => (
  <StyledFlipCard className={props.className}>
    <StyledCardFront flipped={props.flipped}>
      {props.cardFront}
    </StyledCardFront>
    <StyledCardBack flipped={props.flipped}>
      {props.cardBack}
    </StyledCardBack>
  </StyledFlipCard>
)

export default FlipCard
