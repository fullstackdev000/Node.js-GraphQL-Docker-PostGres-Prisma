import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { H2, ImagesGroup, SubSection } from '../styled'
import withImage, { WrappedComponentPropsWithRef } from '../withImage'

const BlockOfText = styled.div`
  grid-column: 1;
`

const PropertiesImg = styled.img``

const VideoImg = styled.img``

const ManagingImages = styled(ImagesGroup)`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 2;
    grid-row: 1/span 2;
    ${PropertiesImg} {
      margin: 0 0 0 75px;
      width: 440px;
    }
    ${VideoImg} {
      margin: -100px 0 0 -145px;
      width: 350px;
    }
  }
`

const Managing: React.FunctionComponent<WrappedComponentPropsWithRef> = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <SubSection showImage={props.showImage} ref={ref}>
      <H2>Managing</H2>
      <BlockOfText>
        <p>
          Real estate visual content management has never been easier for the agent and/or photographer/filmmaker.
          Manage your listings and media from a powerful and <strong>feature rich system dashboard.</strong>
        </p>
        <p>
          As a media service provider, design and price your services as you wish.
          Collect payments via invoicing or use our <strong>hassle-free online payment gateway.</strong>
          Create promo-codes to offer specials to your Realtor clients.
        </p>
        <p>
          Select from multiple property site layouts, add tour banners and headlines.
          Create QR codes to attract buyers to your listing. Add dynamic Open House banners.
          Download photos in web and print sizes and/or create custom photo sized depending on MLS requirements.
        </p>
      </BlockOfText>
      <ManagingImages>
        <PropertiesImg src='/public/static/img/virtual-tour-hosting-photographers-filmmakers.jpg' />
        <VideoImg src='/public/static/img/real-estate-video-tours.jpg' />
      </ManagingImages>
    </SubSection>
  )
})

export default withImage(Managing)
