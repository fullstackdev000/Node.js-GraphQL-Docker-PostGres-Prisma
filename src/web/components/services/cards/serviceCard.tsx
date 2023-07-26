import { ServiceCategory } from '#veewme/gen/graphqlTypes'
import Card, { HorizontalLine } from '#veewme/web/common/card'
import FlipCard from '#veewme/web/common/flipCard'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { ServiceCard as ServiceCardType } from '../types'
import { ServiceCardBackContent, ServiceCardFrontContent } from './serviceCardContent'
import { ServiceCardBackFooterContent, ServiceCardFrontFooterContent } from './serviceCardFooter'

const StyledServiceCardWrapper = styled.div`
  position: relative;
  margin: 6px 12px;
`

// width/height set to odd pixels number because otherwise border disappears after 3d tranformation in Chrome
// TODO find correct fix not hack
const StyledFlipCard = styled(FlipCard) `
  width: 249px;
  height: 429px;
`

const StyledCardFront = styled(Card) <{ category: ServiceCategory, suspended?: boolean }> `
  height: 100%;
  border-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString(props.category.color)};
  background-color: #fff;
  header {
    background-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString(props.category.color)};
  }

  ${HorizontalLine} {
    ${props => !props.suspended && 'display: none'};
  }

  footer {
    background-color: ${props => props.suspended ? 'transparent' : rgbaToString(props.category.color)};
    svg {
      fill: ${props => props.suspended ? props.theme.colors.SUSPENDED : '#fff'};
    }
    color: #fff;
  }
  cursor: auto;
`

const StyledCardBack = styled(Card) <{ category: ServiceCategory, suspended?: boolean }> `
  height: 100%;
  background-color: white;
  border-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString(props.category.color)};
  header {
    background-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString(props.category.color)};
  }

  ${HorizontalLine} {
    ${props => !props.suspended && 'display: none'};
  }

  footer {
    background-color: ${props => props.suspended ? '#fff' : rgbaToString({
      ...props.category.color
    })};
  }
  cursor: auto;
`

interface ServiceCardProps {
  className?: string
  category: ServiceCategory
  card: ServiceCardType
}

interface ServiceCardState {
  flipped: boolean
}

class ServiceCard extends React.PureComponent<ServiceCardProps, ServiceCardState> {
  state: ServiceCardState = {
    flipped: false
  }

  handleReadMoreClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ flipped: true })
  }

  handleFlipBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ flipped: false })
  }

  render () {
    const { card } = this.props
    return (
      <StyledServiceCardWrapper>
        <StyledFlipCard
          className={this.props.className}
          flipped={this.state.flipped}
          cardFront={
            <StyledCardFront
              id={card.id}
              category={this.props.category}
              suspended={card.suspended}
              title={card.name}
              footerContent={<ServiceCardFrontFooterContent
                category={this.props.category}
                price={'$ ' + card.price}
                suspended={card.suspended}
              />}
            >
              <ServiceCardFrontContent
                category={this.props.category}
                card={card}
                onReadMoreClick={this.handleReadMoreClick}
              />
            </StyledCardFront>
          }
          cardBack={
            <StyledCardBack
              id={card.id}
              category={this.props.category}
              title={card.name}
              suspended={card.suspended}
              footerContent={<ServiceCardBackFooterContent
                onClick={this.handleFlipBack}
                category={this.props.category}
                suspended={card.suspended}
              />}
            >
              <ServiceCardBackContent
                category={this.props.category}
                card={card}
                suspended={card.suspended}
              />
            </StyledCardBack>
          }
        />
      </StyledServiceCardWrapper>
    )
  }
}

export default ServiceCard
