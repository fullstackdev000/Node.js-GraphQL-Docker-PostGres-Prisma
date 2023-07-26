import Article from '#veewme/web/common/article'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { StyledIcon } from 'styled-icons/types'
import { TourContext } from '../'
import { DescriptionName, Tour } from '../../../types'
import Interactives from './interactives'

// TODO replace 'assets' icons with styled-icons when proper icon is available
import Garage from '#veewme/web/assets/svg/garage.svg'
import Interior from '#veewme/web/assets/svg/interior.svg'
import Lot from '#veewme/web/assets/svg/lot.svg'
import { Bed, Home } from 'styled-icons/boxicons-solid'
import { Bath } from 'styled-icons/fa-solid'

const Wrapper = styled.div<{ mainColor: string }>`
  width: 100%;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width: 100%;
    padding-right: 0;
  }

  h3 {
    margin: 10px 0;
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-size: 20px;
    font-weight: 400;
  }

  p {
    margin: 10px 0 20px 0;
    padding-bottom: 20px;
    border-bottom: 1px solid ${props => props.theme.colors.BORDER};
    font-size: 15px;
    line-height: 1.3;
  }

  svg {
    width: 45px;
    height: 45px;
    max-width: 100%;
    max-height: 45px;
    fill: ${props => props.mainColor};
    color: ${props => props.mainColor};
  }

  .svg-icon,
  .svg-icon-stroke {
    fill: ${props => props.mainColor};
    color: ${props => props.mainColor};
  }

  mask + path {
    fill: #fff !important;
    stroke: ${props => props.mainColor};
    stroke-width: 4px;
  }
`

const Items = styled.div`
  margin: 5px 0;
  display: flex;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    flex-wrap: wrap;
  }
`

const Item = styled.div`
  width: 16.66666667%;
  flex: 0 0 auto;
  padding: 15px 15px;
  text-align: center;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    width: 25%;
  }
`
const IconHolder = styled.div`
  height: 45px;
`

const Label = styled.div`
  margin: 20px 0
  font-size: 13px;
  text-transform: capitalize;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 11px;
  }
`

const Value = styled.div<{ mainColor: string }>`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.mainColor};

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 13px;
  }
`

const Amenities = styled.div`
  margin: 50px 0 20px 0;
  padding: 20px 0;
  border-top: 2px solid ${props => props.theme.colors.BORDER};
  font-size: 16px;
  line-height: 1.3;

  h3 {
    margin: 10px 0;
    color: ${props => props.theme.colors.GREEN};
    font-size: 20px;
    font-weight: 400;
  }

  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
  }

  li {
    &:not(:last-child):after {
      content: '|';
      margin: 0 7px;
      opacity: 0.5;
    }
  }
`

const StyledArticle = styled(Article)`
  font-size: 18px;
`

type ItemIconsMap = {[K in DescriptionName]?: StyledIcon | React.SVGFactory }

const ItemIcons: ItemIconsMap = {
  'BATHS/HALF': Bath,
  'BEDS': Bed,
  'GARAGES': Garage,
  'INTERIOR': Interior,
  'LOT': Lot,
  'YEAR': Home
}

interface DescriptionProps {
  tour: Tour
}

const Description: FunctionComponent<DescriptionProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <Wrapper mainColor={mainColor}>
      <h3>Description</h3>
      {tour.descriptionText && (<StyledArticle content={tour.descriptionText} />)}
      <Items>
        {
          tour.descriptionItems.filter(item => item.value).map(item => {
            const Icon = ItemIcons[item.name]

            return (
              <Item key={item.name}>
                <IconHolder>{Icon && <Icon width='45' height='45' />}</IconHolder>
                <Label>{item.name.toLowerCase()}</Label>
                <Value mainColor={mainColor}>{item.value}</Value>
              </Item>
            )
          })
        }
      </Items>
      {
        tour.amenities.length > 0 && <Amenities>
          <h3>Amenities</h3>
          <ul>
          {
            tour.amenities.map(amenity => (
              <li key={amenity}>
                {amenity}
              </li>
            ))
          }
          </ul>
        </Amenities>
      }
      <Interactives tour={tour} />
    </Wrapper>
  )
}
export default Description
