import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { H2, ImagesGroup, SubSection } from '../styled'
import withImage, { WrappedComponentPropsWithRef } from '../withImage'

const P = styled.p``

const SharePreview = styled.img``
const ShareDialog = styled.img``
const StatisticsPreview = styled.img``
const DiagramPreview = styled.img``

const SharingGroup = styled(ImagesGroup)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    ${SharePreview} {
      width: 450px;
      margin: 20px auto 0 0;
    }
    ${ShareDialog} {
      width: 100px;
      margin: -766px 0 0 317px;
    }
  }
`

const StatisticsGroup = styled(ImagesGroup)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-column: 2;
    grid-row: 1/-1;
    align-items: flex-start;
    justify-items: flex-start;
    ${DiagramPreview} {
      width: 225px;
      margin: 0;
      z-index: 1;
      position: absolute;
      top: 25px;
      left: 260px;
    }
    ${StatisticsPreview} {
      width: 510px;
      margin: 50px 0 0 0;
    }
  }
`

const Sharing: React.FunctionComponent<WrappedComponentPropsWithRef> = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <SubSection showImage={props.showImage} ref={ref}>
      <H2>Sharing</H2>
      <P>
        Sharing property sites and media is effortless, as is tracking your marketing efforts.
        Snapshot stats are available at a glance or click to view or share detailed statistics and traffic sources and send reports to your clients.
      </P>
      <SharingGroup>
        <SharePreview src='/public/static/img/veewme-sharing-real-estate-video-tour.jpg' />
        <ShareDialog src='/public/static/img/virtual-tour-hosting-social-media.jpg' />
      </SharingGroup>
      <StatisticsGroup>
        <DiagramPreview src='/public/static/img/statistics-real-estate-virtual-tour-hosting.jpg' />
        <StatisticsPreview src='/public/static/img/tour-hosting-platform-video-analytics.jpg' />
      </StatisticsGroup>
    </SubSection>
  )
})

export default withImage(Sharing)
