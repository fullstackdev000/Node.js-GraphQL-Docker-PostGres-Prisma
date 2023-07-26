import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import { TourContext } from './'
import { Line as LineCSS, logoWidth } from './styled'

import { PurchaseTag } from 'styled-icons/boxicons-solid'

export const height = '90px'

const TopWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`

const HeaderInner = styled.div`

`

const Line = styled.div<{
  mainColor: string
}>`
  ${LineCSS}
`

const HeaderStyled = styled.header<{
  mainColor: string
}>`
  padding-top: 10px;
  padding-bottom: 20px;
  height: ${height};
  color: ${props => props.theme.colors.FIELD_TEXT};
  background: #fff;
  z-index: 3;
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    display: none;
  }
}

  ${HeaderInner} {
    position: relative;
    margin: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 19px;
    line-height: 1.2em;
    height: 65px;

    @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      height: 48px;
      font-size: 15px;

  }
`

const RightComponentWrapper = styled.div`
  padding-left: 10px;
  z-index: 1;
`

const ImageWrapper = styled.div`
  display: flex;
  padding-right: 10px;
  width: ${logoWidth};
  height: 100%;
  z-index: 1;

  img {
    display: block
    margin: 0 auto;
    align-self: center;
    max-height: 100%;
  }
`

const PriceStyled = styled.div<{
  mirrorIcon?: boolean
  mainColor: string
}>`
  font-size: 28px;
  font-weight: 600;
  color: #000;

  span {
    font-family: 'American Typewriter', sans-serif;
  }

  svg {
    margin-right: 10px;
    fill: ${props => props.mainColor};
    ${props => props.mirrorIcon && 'transform: scale(-1, 1);'}
    width: 38px;
    height: 38px;
  }

`

const HintText = styled.span`
  display: block;
  margin-top: -5px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 11px;
  }
`

const Price: React.FunctionComponent<{
  price: Tour['price']
  listingType: Tour['listingType']
  mainColor: string
}> = ({ mainColor, price, listingType }) => {
  const formattedType = React.useMemo(() => listingType.split(/(?=[A-Z])/).join(' '), [listingType])
  return (
    <PriceStyled mirrorIcon mainColor={mainColor}>
      <div>
        <PurchaseTag size='24'/>
        <span>{price}</span>
        <HintText>{formattedType}</HintText>
      </div>
    </PriceStyled>
  )
}

const Logo: React.FunctionComponent<{ url: Tour['headerLogoUrl'] }> = ({ url }) => url ? (
  <ImageWrapper><img src={url} alt='logo' /></ImageWrapper>
) : null

interface HeaderProps {
  tour: Tour
}

const Header: FunctionComponent<HeaderProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <TopWrapper>
      <HeaderStyled mainColor={mainColor}>
        <HeaderInner>
          <Logo url={tour.headerLogoUrl} />
          <Line mainColor={mainColor} />
          {
            !!tour.rawPrice && (
              <RightComponentWrapper>
                <Price
                  mainColor={mainColor}
                  price={tour.price}
                  listingType={tour.listingType}
                />
              </RightComponentWrapper>
            )
          }
        </HeaderInner>
      </HeaderStyled>
    </TopWrapper>
  )
}
export default Header
