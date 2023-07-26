import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { Tour } from '../../../types'
import Panorama from '../../common/panoramaWithToolbar'
import { Container, SectionTitle } from '../styled'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding-top: 30px;
  padding-bottom: 50px;
`

interface PanoramaProps {
  tour: Tour
}

const Panoramas: FunctionComponent<PanoramaProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <Wrapper mainColor={mainColor} id='panoramas'>
      <SectionTitle mainColor={mainColor}>Panorama</SectionTitle>
      <Panorama tour={tour} aspectRatio='1 / 0.4'/>
    </Wrapper>
  )
}
export default Panoramas
