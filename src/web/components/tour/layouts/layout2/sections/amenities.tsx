import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { Tour } from '../../../types'
import { Container, SectionTitle } from '../styled'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding-top: 30px;
`

const AmenitiesList = styled.ul<{ mainColor: string }>`
  display: flex;
  flex-wrap: wrap;
  padding-top: 8px;

  li {
    margin-right: 30px;
    margin-bottom: 10px;
    font-family: 'American Typewriter', sans-serif;
    color: ${props => props.theme.colors.LAYOUT_2_FONT};
    font-size: 22px;

    &:after {
      content: '';
      display: inline-block;
      margin-left: 10px;
      width: 15px;
      height: 15px;
      background: ${props => props.mainColor};
    }
  }
`

interface AmenitiesProps {
  tour: Tour
}

const Amenities: FunctionComponent<AmenitiesProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <Wrapper mainColor={mainColor} id='amenities'>
      <SectionTitle mainColor={mainColor}>Amenities & Features</SectionTitle>
      {
        tour.amenities.length > 0 && (
          <AmenitiesList mainColor={mainColor}>
            {
              tour.amenities.map(amenity => (
                <li key={amenity}>
                  {amenity}
                </li>
              ))
          }
          </AmenitiesList>
        )
      }
    </Wrapper>
  )
}
export default Amenities
