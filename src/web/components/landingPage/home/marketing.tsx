import * as React from 'react'
import Managing from './marketing/managing'
import Sharing from './marketing/sharing'
import ShowingOff from './marketing/showingOff'
import { H1, H3, Section } from './styled'

const Marketing: React.FunctionComponent = () => {
  return (
    <Section>
      <H1>A Paradigm Shift in Real Estate Marketing</H1>
      <H3>a fresh and modern approach to marketing properties</H3>
      <Managing />
      <ShowingOff />
      <Sharing />
    </Section>
  )
}

export default Marketing
