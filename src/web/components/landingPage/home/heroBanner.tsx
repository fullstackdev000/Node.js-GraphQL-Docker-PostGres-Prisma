import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import dimensions from '../../layout/publicPage/dimensionsConstants'
import { scrollAnimation } from './styled'
import withImage, { WrappedComponentPropsWithRef } from './withImage'

const bannerImages: string[] = [
  '/public/static/img/hero-bg-1.jpg',
  '/public/static/img/hero-bg-2.jpg',
  '/public/static/img/hero-bg-3.jpg',
  '/public/static/img/hero-bg-4.jpg',
  '/public/static/img/hero-bg-5.jpg',
  '/public/static/img/hero-bg-6.jpg'
]

const bannerIndex: number = Math.floor(Math.random() * bannerImages.length)

const BannerWrapper = styled.section`
  position: relative;
`

const Banner = styled.div`
  background-image: url(${bannerImages[bannerIndex]});
  background-size: cover;
  background-position: center bottom;
  height: 760px;
  padding: 30px ${dimensions.pageMargin} 20px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-top: 90px;
  }
  h1 {
    color: white;
    font-weight: 600;
    font-size: 32px;
    text-align: center;
    text-shadow: 0 3px 10px rgba(0,0,0,0.72);
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      font-size: 48px;
      text-align: left;
    }
  }
  h3 {
    font-size: 18px;
    text-align: center;
    text-shadow: 0 3px 10px rgba(0,0,0,0.72);
    color: #fff;
    line-height: 1.3em;
    font-weight: 300;
    margin: 10px auto;
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      font-size: 25px;
      text-align: left;
      width: 50%;
      margin-left: 0;
    }
  }
`

const ExampleTours = styled.a`
  display: block;
  width: 60%;
  margin: auto;
  min-width: 350px;
  margin-top: 12%;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  img {
    width: 100%;
    ${scrollAnimation};
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width:37%;
    position: absolute;
    right: 13%;
    bottom: 0;
    z-index: 2;
    transform: translateY(13%);
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    width: 30%;
    right: 20%;
  }
`

const Overlay = styled.div`
  position: absolute;
  background-color: rgba(20,57,91,0.75);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-transition: opacity 0.2s;
  -moz-transition: opacity 0.2s;
  transition: opacity 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  ${ExampleTours}:hover > & {
    opacity: 1;
    z-index: 1;
  }
`

const OverlayLabel = styled.div`
  color: #FFF;
  border: 2px solid #FFF;
  border-radius: 6px;
  padding: 15px 20px;
  text-align: center;
  font-size: 18px;
  text-transform: uppercase;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 25px;
    padding: 20px 30px;
  }
`

const HeroBanner: React.FunctionComponent<WrappedComponentPropsWithRef> = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <BannerWrapper ref={ref}>
      <Banner>
        <h1>Real Estate Never Looked This Good!</h1>
        <h3>Leading real estate content management and delivery platform for Photography Vendors, Brokers, and Agents</h3>
        <ExampleTours
          showImage={props.showImage}
          href='http://tour.3weekend.org/4376/234-dawn-patrol-st-hollywood-ca-64851'
          target='_blank'
        >
          <Overlay>
            <OverlayLabel>Show example tour</OverlayLabel>
          </Overlay>
          <img src='/public/static/img/example-tour.jpg' />
        </ExampleTours>
      </Banner>
    </BannerWrapper>
  )
})

export default withImage(HeroBanner)
