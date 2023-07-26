import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { Tour } from '../../../types'
import InteractivePlayer from '../../common/interactive'
import { Item, PhotoTitle, PhotoWrapper } from '../../common/interactiveWithPhotos'

const Wrapper = styled.div<{ mainColor: string }>`
  padding-top: 10px;
  padding-bottom: 50px;

  ${PhotoTitle} {
    font-weight: 400;
  }

  ${PhotoWrapper} {
    box-shadow: none;
  }

  ${Item} {
    padding: 10px;
    flex: 0 0 50%;

    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      flex: 0 0 33%;
    }

    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
      flex: 0 0 25%;
    }
  }
`

const InteractiveHolder = styled.div`
  padding-top: 10px;
  padding-bottom: 40px;
  border-top: 2px solid ${props => props.theme.colors.BORDER};
`

interface InteractivesProps {
  tour: Tour
}

const Interactives: FunctionComponent<InteractivesProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <Wrapper mainColor={mainColor} id='interactives'>
      {
        tour.interactives.filter(i => i.type === 'FLOORPLAN_PHOTOS').map(item => {
          return (
            <InteractiveHolder key={item.id}>
              <h3>{item.label}</h3>
              <InteractivePlayer
                interactive={item}
              />
            </InteractiveHolder>
          )
        })
      }
    </Wrapper>
  )
}
export default Interactives
