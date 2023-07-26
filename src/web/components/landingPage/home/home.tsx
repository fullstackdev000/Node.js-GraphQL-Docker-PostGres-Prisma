import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { Parallax } from 'react-parallax'
import ExampleTours from './exampleTours'
import HeroBanner from './heroBanner'
import IntroInfo from './introInfo'
import Marketing from './marketing'
import Photography from './photography'
import Presentation from './presentation'
import Steps from './steps'
import { HomeWrapper } from './styled'

const StyledParallax = styled(Parallax)`
  height: 450px;
  width: 100%;
`

const Home: React.FunctionComponent = () => {
  return (
    <HomeWrapper>
      <HeroBanner />
      <IntroInfo />
      <Presentation />
      <Photography />
      <Marketing />
      <Steps />
      <ExampleTours />
      <StyledParallax bgImage='/public/static/img/pic-footer.jpg' strength={1000} />
    </HomeWrapper>
  )
}

export default Home
