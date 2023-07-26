import styled, { css } from '#veewme/web/common/styled-components'
import { NavLink } from 'react-router-dom'
import { themeColors } from './colors'
import { BREAKPOINT_LG, BREAKPOINT_XL } from './mediaBreakpoints'

export const StyledMainWrapper = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  @media (max-width: ${BREAKPOINT_XL}) {
    padding: 0 20px;
  }
  @media (max-width: ${BREAKPOINT_LG}) {
    padding: 0 10px;
  }
`

export const StyledH4 = styled.h4 `
  font-weight: 500;
  font-size: 19px;
  color: ${themeColors.LABEL_TEXT};
`

export const MAIN_SECTION_HEADER_HEIGHT_PX = 70

export const StyledMainSectionHeader = styled.header `
  height: ${MAIN_SECTION_HEADER_HEIGHT_PX}px;
  display: flex;
  border-bottom: 3px solid ${themeColors.BUTTON_BORDER};
`

export const StyledLinkButton = styled(NavLink) `
  position: relative;
  margin: 0 4px;
  padding: 8px 18px;
  outline: none;
  border: none;
  background-color: transparent;
  background-color: white;
  border-radius: 5px;
  border: 2px solid ${themeColors.BUTTON_BORDER};
  transition: border .5s;

  &:hover, &:active {
    color: inherit;
    border: 2px solid ${themeColors.BUTTON_BORDER_HOVER};
  }
`

export const itemShadow = css`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

export const itemShadowHover = css`
  transition: box-shadow .4s;

  &:hover,
  &:active {
    ${itemShadow}
  }
`
