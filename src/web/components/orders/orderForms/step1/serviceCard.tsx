import { Color } from '#veewme/lib/types'
import Card, { HorizontalLine } from '#veewme/web/common/card'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import { CheckboxFlipCard } from '#veewme/web/common/formikFields/flipCardField'
import { FieldProps } from 'formik'
import * as React from 'react'
import styled from '../../../../common/styled-components'
import { ServiceCard as ServiceCardType } from '../types'
import { ServiceCardBackContent, ServiceCardFrontContent, StyledCardContent } from './serviceCardContent'
import { ServiceCardBackFooterContent, ServiceCardFrontFooterContent } from './serviceCardFooter'
import ServiceCardOverlay from './serviceCardOverlay'

const StyledServiceCardWrapper = styled.div`
  position: relative;
  margin: 6px 12px;
`

// width/height set to odd pixels number because otherwise border disappears after 3d tranformation in Chrome
// TODO find correct fix not hack
const StyledFlipCard = styled(CheckboxFlipCard)`
  width: 249px;
  height: 429px;
`

const StyledCardFront = styled(Card) <{ color: Color }> `
  height: 100%;
  border-color: ${props => rgbaToString(props.color)};
  background-color: #fff;

  header {
    background-color: ${props => rgbaToString(props.color)};
  }

  ${StyledCardContent} {
    background-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString({
      ...props.color,
      a: 0.5
    })};
  }

  ${HorizontalLine} {
    display: none;
  }

  footer {
    background-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString(props.color)};
    svg {
      fill: #fff;
    }
  }
`

const StyledCardBack = styled(Card) <{ color: Color }> `
  height: 100%;
  border-color: ${props => rgbaToString(props.color)};
  header {
    background-color: ${props => rgbaToString(props.color)};
  }
  ${StyledCardContent} {
    background-color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString({
      ...props.color,
      a: 0.5
    })};
  }

  ${HorizontalLine} {
    display: none;
  }


  footer {
    background-color: ${props => rgbaToString(props.color)}
  }
`

interface CustomProps {
  checked: boolean
  className?: string
  color: Color
  card: ServiceCardType
  icon: React.SVGFactory
  requireConfirm?: boolean
  setValue: () => void
}

type ServiceCardProps = CustomProps & FieldProps

const ServiceCard: React.FC<ServiceCardProps> = props => {
  const [flipped, setFlipped] = React.useState(false)
  const [showOverlay, setOverlay] = React.useState(false)

  const confirm = () => {
    if (!props.checked) {
      setOverlay(true)
    } else {
      props.setValue()
    }
  }

  const handleReadMoreClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    setFlipped(true)
  }

  const handleFlipBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setFlipped(false)
  }

  const handleOkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    props.setValue()
    setOverlay(false)
  }

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setOverlay(false)
  }

  const { card, color: { r, g, b, a } } = props
  const color = `rgba(${r}, ${g}, ${b}, ${a})`

  return (
    <StyledServiceCardWrapper>
      <StyledFlipCard
        checked={props.checked}
        className={props.className}
        flipped={flipped}
        id={card.id}
        confirmCallback={props.requireConfirm ? confirm : undefined}
        cardFront={
          <StyledCardFront
            id={card.id}
            color={props.color}
            title={card.name}
            footerContent={<ServiceCardFrontFooterContent color={color} price={'$ ' + card.price} />}
          >
            <ServiceCardFrontContent
              color={color}
              icon={props.icon}
              shortDescription={card.shortDescription}
              image={card.serviceImage ? card.serviceImage.path : undefined}
              onReadMoreClick={handleReadMoreClick}
              readMore={!!card.longDescription}
              checked={props.checked}
              title={card.title || ''}
            />
          </StyledCardFront>
        }
        cardBack={
          <StyledCardBack
            id={card.id}
            color={props.color}
            title={card.name}
            footerContent={<ServiceCardBackFooterContent color={color} onClick={handleFlipBack} />}
          >
            <ServiceCardBackContent
              color={color}
              icon={props.icon}
              longDescription={card.longDescription}
            />
          </StyledCardBack>
        }
        setValue={props.setValue}
      />
      {showOverlay &&
        <ServiceCardOverlay
          onConfirmClick={handleOkClick}
          onCancelClick={handleCancelClick}
          note={card.note || ''}
        />
      }
    </StyledServiceCardWrapper>
  )
}

export default ServiceCard
