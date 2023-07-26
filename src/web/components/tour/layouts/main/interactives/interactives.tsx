import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import { TourContext } from '..'
import { Tour } from '../../../types'
import InteractivePlayer from '../../common/interactive'
import { Container } from '../styled'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding-bottom: 50px;
`

const InteractiveHolder = styled.div`
  margin-top: 40px;
`

interface InteractivesProps {
  tour: Tour
}

const Interactives: FunctionComponent<InteractivesProps> = ({ tour }) => {
  const { id } = useParams<{ id: string }>()
  const mainColor = React.useContext(TourContext).mainColor

  const interactiveToShow = tour.interactives.find(v => v.id === Number(id)) || tour.interactives[0]

  return (
    <Wrapper mainColor={mainColor} as='main'>
      <InteractiveHolder>
        <InteractivePlayer
          interactive={interactiveToShow}
        />
      </InteractiveHolder>
    </Wrapper>
  )
}
export default Interactives
