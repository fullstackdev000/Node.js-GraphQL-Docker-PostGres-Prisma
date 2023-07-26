import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { HEADER_HEIGHT_PX } from '../constants'

const HAMBURGER_HEIGHT_PX: number = 27
const TOP: number = (HEADER_HEIGHT_PX - HAMBURGER_HEIGHT_PX) / 2

const StyledBar = styled.div`
  display: block;
  width: 100%;
  height: 5px;
  background-color: ${props => props.theme.colors.SIDEBAR_BACKGROUND};
  border-radius: 2px;
  position: absolute;
  opacity: 1;
  left: 0;
`

const StyledHamburger = styled.div<{ isOpen: boolean }>`
  width: 35px;
  height: 28px;
  z-index: 600;
  position: fixed;
  top: ${TOP}px;
  left: -35px;
  cursor: pointer;

  ${StyledBar}:nth-of-type(1) {
    top: 0px;
    transition: top 0.3s ease 0.3s, transform 0.3s ease-out 0.1s;
  }

  ${StyledBar}:nth-of-type(2) {
    top:11px;
    transition: ease 0.3s 0.3s;
  }

  ${StyledBar}:nth-of-type(3) {
    top: 22px;
    transition: top 0.3s ease 0.3s, transform 0.3s ease-out 0.1s;
  }

  ${props => props.isOpen && `
    ${StyledBar}:nth-of-type(1) {
      top: 11px;
      transform: rotate(45deg);
      transition: top 0.3s ease 0.1s, transform 0.3s ease-out 0.5s;
    }

    ${StyledBar}:nth-of-type(2) {
      opacity: 0;
    }

    ${StyledBar}:nth-of-type(3) {
      top: 11px;
      transform: rotate(-45deg);
      transition: top 0.3s ease 0.1s, transform 0.3s ease-out 0.5s;
    }
  `}

  @media (max-width: 1024px) {
    left: 25px;
  }
`

export interface HamburgerProps {
  onClick: () => void
  isOpen: boolean
}

const Hamburger: React.FunctionComponent<HamburgerProps> = ({ isOpen, onClick }) => {

  return (
    <StyledHamburger onClick={onClick} isOpen={isOpen}>
      <StyledBar/>
      <StyledBar/>
      <StyledBar/>
    </StyledHamburger>
  )
}

export default Hamburger
