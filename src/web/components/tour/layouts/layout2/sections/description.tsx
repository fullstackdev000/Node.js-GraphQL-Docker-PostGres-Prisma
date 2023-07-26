import { publicUrls } from '#veewme/lib/urls'
import Article from '#veewme/web/common/article'
import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { StyledIcon } from 'styled-icons/types'
import { TourContext } from '../'
import { DescriptionName, Tour } from '../../../types'

// TODO replace 'assets' icons with styled-icons when proper icon is available
import Garage from '#veewme/web/assets/svg/garage.svg'
import Interior from '#veewme/web/assets/svg/interior.svg'
import Lot from '#veewme/web/assets/svg/lot.svg'
import { Bed, Home } from 'styled-icons/boxicons-solid'
import { Bath } from 'styled-icons/fa-solid'

const Wrapper = styled.div<{ mainColor: string }>`
  margin: 25px 30px;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin: 0 10vw 0 0;
  }

  svg {
    width: 45px;
    height: 45px;
    max-width: 100%;
    max-height: 45px;
    fill: ${props => props.mainColor};
    color: ${props => props.mainColor};
  }

  .svg-icon,
  .svg-icon-stroke {
    fill: ${props => props.mainColor};
    color: ${props => props.mainColor};
  }

  mask + path {
    fill: #fff !important;
    stroke: ${props => props.mainColor};;
    stroke-width: 4px;
  }
`

const Items = styled.div`
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    justify-content: flex-start;
  }
`

const Item = styled.div`
  height: 105px;
  margin: 0 25px 20px 25px;
  flex: 0 0 105px;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    margin: 0 10px 20px 10px;
  }

  > div {
    height: 100%;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    background: #fff;
  }

`
const IconHolder = styled.div`
  height: 45px;
`

const Label = styled.div`
  margin-top: 7px;
  font-family: 'American Typewriter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 11px;
  }
`

const Value = styled.div`
  margin-bottom: 3px;
  font-family: 'American Typewriter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: ${props => props.theme.colors.LAYOUT_2_FONT};

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 13px;
  }
`

const Address = styled.h3`
  margin: 20px 0 30px 0;
  font-size: 22px;
  color: ${props => props.theme.colors.LAYOUT_2_FONT};
  font-family: 'American Typewriter', sans-serif;
  font-weight: 400;


  &:first-line {
    margin-bottom: 5px;
    font-size: 31px;
    line-height: 40px;
    font-weight: 700;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    font-size: 28px;

    &:first-line {
      font-size: 38px;
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin-top: 0;
    font-size: 35px;

    &:first-line {
      font-size: 43px;
    }
  }
`

const PropertiesButton = styled(props => <Button {...props}/>)<{ mainColor: string }>`
  background: ${props => props.mainColor} !important;
  border-color: ${props => props.mainColor} !important;
  width: 100%;
`

const PropertiesButtonHolder = styled.div`
  margin-bottom: 35px;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    max-width: 300px;
  }
`

const MobileLayout = styled.div`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: none;
  }
`
const LeftCol = styled.div`

`

const DesktopLayout = styled.div`
  display: none;

  margin-top: 20px;

  > div:first-child {
    flex: 0 0 400px;
  }

  > div:last-child {
    flex: 0 1 auto;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: flex;
    flex-wrap: wrap;

    ${LeftCol} {
      margin-top: -70px;
      position: relative;
      z-index: 1;
    }

  }
`

export const DescriptionText = styled.div`
  width: 100%;
  margin: 20px 0;
  color: ${props => props.theme.colors.LAYOUT_2_FONT};
  font-size: 18px;
  line-height: 23px;
`

export const StyledArticle = styled(Article)`
  font-size: 18px;
  color: ${props => props.theme.colors.LAYOUT_2_FONT};
`

type ItemIconsMap = {[K in DescriptionName]?: StyledIcon | React.SVGFactory }

const ItemIcons: ItemIconsMap = {
  'BATHS/HALF': Bath,
  'BEDS': Bed,
  'GARAGES': Garage,
  'INTERIOR': Interior,
  'LOT': Lot,
  'YEAR': Home
}

interface DescriptionProps {
  tour: Tour
}

const Description: FunctionComponent<DescriptionProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  const propertiesBtn = (
    <PropertiesButtonHolder>
      <PropertiesButton
        full
        size='big'
        buttonTheme='action'
        type='button'
        label='View Additional Featured Properties'
        mainColor={mainColor}
        to={`${publicUrls.toursGalleryRoot}/agent/${tour.contactPerson.id}`}
      />
    </PropertiesButtonHolder>
  )

  const address = (
    <>
      <Address>
        {tour.addressFull.street}<br />
        {`${tour.addressFull.city}, ${tour.addressFull.state} ${tour.addressFull.zip}`}
      </Address>
      {propertiesBtn}
    </>
  )

  const LeftColumn = (
    <LeftCol>
      <Items>
        {
          tour.descriptionItems.filter(item => item.value).map(item => {
            const Icon = ItemIcons[item.name]

            return (
              <Item key={item.name}>
                <div>
                  <Value>{item.value}</Value>
                  <IconHolder>{Icon && <Icon width='45' height='45' />}</IconHolder>
                  <Label>{item.name.toLowerCase()}</Label>
                </div>
              </Item>
            )
          })
        }
      </Items>
    </LeftCol>
  )

  return (
    <>
      <Wrapper mainColor={mainColor} id='description'>
        <MobileLayout>
          {address}
          {LeftColumn}
        </MobileLayout>
        <DesktopLayout>
          <div>{LeftColumn}</div>
          <div>
            {address}
          </div>
        </DesktopLayout>
      </Wrapper>
    </>
  )
}
export default Description
