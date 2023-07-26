import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { Tour } from '../../../types'
import InteractivePlayer from '../../common/interactive'
import { Container, SectionTitle } from '../styled'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding-bottom: 50px;
`

const InteractiveHolder = styled.div`
  padding-bottom: 40px;
`

interface InteractivesProps {
  tour: Tour
}

const Interactives: FunctionComponent<InteractivesProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <Wrapper mainColor={mainColor} id='interactives'>
      {
        tour.interactives.map(item => {
          return (
            <InteractiveHolder key={item.id}>
              <SectionTitle mainColor={mainColor}>{item.label}</SectionTitle>
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
