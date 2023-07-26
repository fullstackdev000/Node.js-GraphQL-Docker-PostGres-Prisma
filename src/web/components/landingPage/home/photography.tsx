import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { H1, H2, H4, Section } from './styled'
import withImage, { WrappedComponentPropsWithRef } from './withImage'

const MultimediaOverview = styled.img`
  margin: 20px auto;
  width: 50%;
  border-radius: 6px;
  box-shadow: 0 3px 9px rgba(0,0,0,0.39);
`

const AdditionalMedia = styled.ul`
  li {
    text-align: center;
    img {
      margin-top: 30px;
      height: 160px;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: grid;
    grid-template-columns: repeat(3, 30%);
    grid-column-gap: 5%;
  }
`

interface AdditionalMediumInterface {
  imgAlt?: string
  imgSrc: string
  label: string
}

const AdditionalMedium: React.FunctionComponent<AdditionalMediumInterface> = props => {
  return (
    <li>
      <img src={props.imgSrc} alt={props.imgAlt ? props.imgAlt : props.label} />
      <H4>{props.label}</H4>
    </li>
  )
}

const Photography: React.FunctionComponent<WrappedComponentPropsWithRef> = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <Section showImage={props.showImage} ref={ref}>
      <H1>Engage the buyer with stunning photography</H1>
      <MultimediaOverview src='/public/static/img/multimedia-overview.jpg' alt='engage the buyer with stunning photography' />
      <H2>...hold their interest with additional media</H2>
      <AdditionalMedia>
        <AdditionalMedium imgSrc='/public/static/img/media-floor-plan-us.jpg' label='Floor Plans' />
        <AdditionalMedium imgSrc='/public/static/img/media-vr.jpg' label='VR & Panoramas' />
        <AdditionalMedium imgSrc='/public/static/img/media-video.jpg' label='Full Motion Video' />
      </AdditionalMedia>
      <H2>add any media in any combination and quantity</H2>
    </Section>
  )
})

export default withImage(Photography)
