import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { Camera } from 'styled-icons/boxicons-regular/Camera'
import { Upload } from 'styled-icons/boxicons-regular/Upload'
import { ShareAlt } from 'styled-icons/boxicons-solid/ShareAlt'
import { H1, H2, H3, Section } from './styled'

const StepGroup = styled.div`
  margin-top: 50px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: grid;
    grid-template-columns: repeat(3, 30%);
    grid-column-gap: 5%;
  }
`

const StepElement = styled.div`
  margin: 50px 0;
  &:last-child {
    margin-bottom: 0;
  }
  svg {
    height: 100px;
    fill: ${props => props.theme.colors.GREEN};
    margin: 10px auto;
  }
`

const Steps: React.FunctionComponent = () => {
  return (
    <Section>
      <H1>Beautiful Property Sites in Three Simple Steps</H1>
      <H3>creating a stunning single property website is fast & easy…</H3>
      <StepGroup>
        <StepElement>
          <H2>Capture</H2>
          <Camera />
          <p>Capture your media – photos, videos, floor plans, VR – the way you like.</p>
        </StepElement>
        <StepElement>
          <H2>Upload</H2>
          <Upload />
          <p>
            Our platform automatically optimizes media for <strong>quality and loading speed, </strong>
            serving appropriate files depending on device used.
          </p>
        </StepElement>
        <StepElement>
          <H2>Publish & Share</H2>
          <ShareAlt />
          <p>
            Preview your tour and when ready click Publish. Tours are delivered in branded and unbranded versions
          </p>
          <p>
            Fully responsive for viewing on desktop and mobile devices. Easily shareable on Social Media platforms.
          </p>
        </StepElement>
      </StepGroup>
    </Section>
  )
}

export default Steps
