import { itemShadowHover } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`

export const ListTitle = styled.h2<{ inline?: boolean }>`
  flex: ${props => props.inline ? '0 0 auto' : '1 0 auto'};
  padding-right: 10px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-weight: 400;
  font-size: 18px;

  a {
    margin-left: 10px;
  }

`

export const Subtitle = styled.div`
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-weight: 400;
  font-size: 13px;
`

export const ListWrapper = styled.section`
  padding: 30px;
  margin-bottom: 25px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.BORDER};
  background: #fff;
`

export const MediaItem = styled.div<{
  showShadow?: boolean
}>`
  display: flex;
  margin: 15px 0;
  border: 2px solid ${props => props.theme.colors.BORDER};
  border-radius: 4px;

  ${({ showShadow = true }) => showShadow && itemShadowHover}
`

export const MediaItemType = styled.div`
  width: 120px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.BACKGROUND};
  border-right: 1px solid ${props => props.theme.colors.BORDER};

  svg {
    fill: ${props => props.theme.colors.INFO_BORDER}};
    color: ${props => props.theme.colors.INFO_BORDER}};
  }

  span {
    margin-left: 5px;
    min-width: 45px;
    font-weight: 600;
    font-size: 17px;
    color: ${props => props.theme.colors.INFO_BORDER};
    text-transform: uppercase;
  }
`

export const MediaItemMain = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: 15px 25px;
`

export const MediaItemInfo = styled.div`
  span {
    display: block;
    margin-bottom: 2px;
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;

    &:first-child {
      color: ${props => props.theme.colors.FIELD_TEXT};
      text-transform: capitalize;
      font-size: 14px;
    }
  }
`

export const MediaItemButtons = styled.div`
  display: flex;
  align-items: center;

  a,
  button {
    svg {
      fill: ${props => props.theme.colors.GREY} !important;
      width: 18px;
      height: 18px;
      max-width: 18px;
      max-height: 18px;
    }
  }

  button {
    margin-left: 8px;

    svg {
      transform: scale(1.1);
      fill: ${props => props.theme.colors.ALERT} !important;
    }
  }
`

export const AppearanceHolder = styled.div`
  display: flex;
  margin: 10px 0 15px 0;
  flex-wrap: wrap;
`

export const PhotosMainListWrapper = styled.div<{
  panoramicItems?: boolean
  fixedSize?: boolean
  size?: number
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.panoramicItems ? 3 : 6}, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    grid-template-columns: repeat(${props => props.panoramicItems ? 2 : 5}, 1fr);
  }

  @media (max-width: 1600px) {
    grid-template-columns: repeat(${props => props.panoramicItems ? 2 : 4}, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: repeat(${props => props.panoramicItems ? 2 : 3}, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: repeat(${props => props.panoramicItems ? 1 : 2}, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: repeat(1, 1fr);
  }

  ${({
    fixedSize,
    size = 1
  }) => fixedSize && `
      grid-template-columns: repeat(auto-fill, ${size * 300}px) !important;
      align-content: space-around;
      justify-content: center;
  `}
`

export const TooltipContent = styled.span`
  span {
    display: block;
    margin: 4px 0;
  }
`

export const UploaderHolder = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-column-gap: 20px;
  grid-row-gap: 10px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: 100%;
  }
`
