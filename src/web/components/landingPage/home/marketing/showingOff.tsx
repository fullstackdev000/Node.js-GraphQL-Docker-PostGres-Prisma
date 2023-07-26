import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { H2, ImagesGroup, SubSection } from '../styled'
import withImage, { WrappedComponentPropsWithRef } from '../withImage'

const BlockOfText = styled.div`
  grid-column: 2;
`

const FlyerPreview = styled.img``

const FlyerOptions = styled.img``

const ShowcaseGroup = styled(ImagesGroup)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 1;
    grid-row: 1/span 3;
    align-items: start;
    justify-content: center;
    img {
      width: 460px;
      margin-left: 0;
    }
  }
`

const FlyerGroup = styled(ImagesGroup)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 2;
    ${FlyerPreview} {
      margin: 0 auto 0 0;
      width: 510px;
      max-width: 100%;
    }
    ${FlyerOptions} {
      margin: -915px 0 0 auto;
      width: 270px;
    }
  }
`

const ShowingOffSection = styled(SubSection)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) and (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: grid;
    grid-template-columns: repeat(3, 30%);
    grid-column-gap: 5%;
    * {
      grid-column: 1/-1;
    }
    ${ShowcaseGroup} {
      grid-column: 1;
      img {
        max-width: 96%;
      }
    }
    ${FlyerGroup} {
      grid-column: 2/-1;
      img {
        max-width: 46%;
        margin: 0;
        &:first-child {
          margin-right: 7%;
        }
      }
    }
  }
`

const ShowingOff: React.FunctionComponent<WrappedComponentPropsWithRef> = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <ShowingOffSection showImage={props.showImage} ref={ref}>
      <H2>Showing off</H2>
      <BlockOfText>
        <p>
        Tour gallery pages for all. Everyone can showcase their listings.
        Create Team / Broker tour gallery pages with interactive maps and banners highlighting your sold and/or pending listings.
        </p>
        <p>
          As a Ogle Media affiliate you can create a <strong>Tour Showcase page to show-off your photography and/or filmmaking skills,</strong>
          with direct links to an agent sign up form.
        </p>
        <p>
          Multiple simple yet effective Property Brochures dynamically created.
        </p>
      </BlockOfText>
      <ShowcaseGroup>
        <img src='/public/static/img/tour-hosting-for-real-estate-photographers.jpg' />
      </ShowcaseGroup>
      <FlyerGroup>
        <FlyerPreview src='/public/static/img/real-estate-agent-tour-hosting-platform.jpg' />
        <FlyerOptions src='/public/static/img/real-estate-brochure-selector.jpg' />
      </FlyerGroup>
    </ShowingOffSection>
  )
})

export default withImage(ShowingOff)
