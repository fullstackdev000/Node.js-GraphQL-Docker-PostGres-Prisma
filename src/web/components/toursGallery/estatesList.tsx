import { itemShadowHover } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom'
import ThumbsCarousel from './thumbsCarousel'
import { Gallery, GalleryRealEstate, Tours } from './types'

import { Area } from 'styled-icons/boxicons-regular'
import { Bed } from 'styled-icons/boxicons-solid'
import { Bath } from 'styled-icons/fa-solid'

const ListWrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, 224px) !important;
  grid-column-gap: 20px;
  grid-row-gap: 30px;
  margin-top: 30px;
`

const ListItemStyled = styled.li<{
  status: GalleryRealEstate['status']
}>`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  ${itemShadowHover};

  &:before {
    display: none;
    box-sizing: border-box;
    content: 'Experience this property';
    position: absolute;
    top: 95px;
    width: 200px;
    padding: 5px 10px;
    left: 50%;
    margin-left: -100px;
    border-radius: 3px;
    font-weight: 500;
    color: #fff;
    text-align: center;
    pointer-events: none;
    border: 1px solid #fff;
    font-size: 13px;
    z-index: 15;
  }

  &:hover:before {
    display: block;
  }

  img {
    display: block;
    width: 100%;
    height: 135px;
    object-fit: cover;
  }

  ${({
    theme,
    status
  }) => {
    if (!status) {
      return ''
    }
    const color = status === 'Sold' ? theme.colors.ALERT : theme.colors.ORANGE
    const text = status === 'Sold' ? 'SOLD' : 'PENDING'

    return `
      border: 4px solid ${color};

      &:before {
        display: block;
        box-sizing: border-box;
        content: '${text}';
        position: absolute;
        top: 95px;
        width: 180px;
        padding: 5px 10px;
        left: 50%;
        margin-left: -90px;
        border-radius: 3px;
        font-weight: 500;
        color: #fff;
        text-align: center;
        background: ${color};
        pointer-events: none;
        opacity: 0.9;
        border: 0 none;
      }
    `
  }}

`

const ItemContent = styled.div`
  padding: 0 10px;
  margin-top: 7px;
`

const Details = styled.div`
  margin: 10px 10px;
  display: flex;
  justify-content: space-between;
`

const Detail = styled.div`
  width: 55px;
  flex: 0 0 auto;
  text-align: center;
  color: ${props => props.theme.colors.DARKER_GREY};

  svg {
    fill: ${props => props.theme.colors.GREY};
    color: ${props => props.theme.colors.GREY};
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    width: 25%;
  }
`

const IconHolder = styled.div`
  height: 30px;
`

const Label = styled.div`
  margin: 5px 0
  font-size: 10px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.DARKER_GREY};

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    font-size: 11px;
  }
`

const TextLine = styled.p<{
  fontSize?: number
  bold?: boolean
  topSpace?: boolean
}>`
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '17px'};
  font-weight: ${props => props.bold ? '600' : '400'};
  margin: 0 0 2px 0;
  color: ${props => props.theme.colors.DARKER_GREY};
  ${props => props.topSpace && 'margin-top: 20px;'}
`

const Price = styled(TextLine).attrs({
  bold: true,
  fontSize: 17
})`
  text-align: right;
  position: relative;
  padding-bottom: 8px;
`

export const PhotoPlaceholder = styled.div`
  height: 135px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.DARKER_GREY};
  background-color: ${props => props.theme.colors.LIGHT_BLUISH_GREY};
  background: linear-gradient(0, rgba(0, 0, 0, 0.3), ${props => props.theme.colors.LIGHT_BLUISH_GREY} 50%);
`

const ListItem: React.FC<{
  data: Tours[0]
}> = ({ data: tourData }) => {
  const data = tourData.realEstate
  const formattedType = React.useMemo(() => data.listingType.split(/(?=[A-Z])/).join(' '), [data])
  const currency = data.currency || 'USD'
  const formattedPrice = new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency'
  })
  .format(data.price)

  let photoComponent = data.status ? (
    <img src={data.photos[0].thumbUrl} />
  ) : (
    <ThumbsCarousel photos={data.photos} />
  )

  if (!data.photos.length) {
    photoComponent = (
      <PhotoPlaceholder>
        No photos
      </PhotoPlaceholder>
    )
  }

  return (
    <ListItemStyled status={data.status}>
      <NavLink to={`/tour/${tourData.id}/l/l1`} target='_blank'>
        {photoComponent}
        <ItemContent>
          <TextLine fontSize={13}>{data.street}</TextLine>
          <TextLine fontSize={13} bold>{`${data.city}, ${data.state} ${data.zip}`}</TextLine>
          <TextLine fontSize={13}>{formattedType}</TextLine>
          <Details>
            <Detail>
              <IconHolder><Bed size='25'/></IconHolder>
              <Label>{data.bedrooms} beds</Label>
            </Detail>
            <Detail>
              <IconHolder><Bath size='25'/></IconHolder>
              <Label>{data.fullBathrooms + data.halfBathrooms * 0.5} baths</Label>
            </Detail>
            <Detail>
              <IconHolder><Area size='25'/></IconHolder>
              <Label>{data.homeSize}</Label>
            </Detail>
          </Details>
          <Price>{formattedPrice}</Price>
        </ItemContent>
      </NavLink>
    </ListItemStyled>
  )
}

interface EstatesListProps {
  data: Gallery['tours']
}

const EstatesList: FunctionComponent<EstatesListProps> = ({
  data = []
}) => {
  return (
    <ListWrapper>
      {data.map(tour => <ListItem data={tour} key={tour.id} />)}
    </ListWrapper>
  )
}
export default EstatesList
