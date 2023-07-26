import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import { ExpandableFiltersContext } from './contexts'
import styled from './styled-components'

import { Filter } from 'styled-icons/fa-solid'

export const FirstRowStyled = styled.div`
  display: flex;

  & > * {
    margin-right: 10px;
  }
`
const toggleBtnWidth = 40
export const SecondRowStyled = styled(FirstRowStyled)<{
  visible: boolean
}>`
  max-height: 0;
  padding-left: ${toggleBtnWidth + 10}px;
  margin-top: 5px;
  transition: max-height .5s;
  overflow: hidden;
  flex-wrap: wrap;

  ${({ visible }) => visible && `
    max-height: 100px;

    animation-duration: 0.5s;
    animation-name: 'myAnim';
    animation-iteration-count: 1;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  `}

  @keyframes myAnim {
    0% {
      overflow: hidden;
    }

    100% {
      overflow: visible;
    }
  }

`

const ToggleBtn = styled.span`
  display: block;
  width: ${toggleBtnWidth}px;
  padding: 6px;
  text-align: center;
  cursor: pointer;

  svg {
    color: ${props => props.theme.colors.BLUE};
    filter: drop-shadow( 0 0 2px rgba(0, 0, 0, .4));
  }
`

export const FirstRow: React.FunctionComponent = props => {
  const { toggle, visible } = React.useContext(ExpandableFiltersContext)
  const tooltipText = visible ? 'Less Filters' : 'More Filters'

  return (
    <FirstRowStyled>
      <Tooltipped tooltip={tooltipText} position='top'>
        <ToggleBtn onClick={toggle}>
          <Filter size={20} />
        </ToggleBtn>
      </ Tooltipped>
      {props.children}
    </FirstRowStyled>
  )
}

export const SecondRow: React.FunctionComponent = props => {
  const { visible } = React.useContext(ExpandableFiltersContext)

  return (
    <SecondRowStyled visible={visible}>
      {props.children}
    </SecondRowStyled>
  )
}

const ExpandableFilters: React.FunctionComponent = props => {
  const [visible, setVisibility] = React.useState(false)
  const toggleVisibility = React.useCallback(() => setVisibility(prev => !prev), [])

  return (
    <>
      <ExpandableFiltersContext.Provider
        value={{
          toggle: toggleVisibility,
          visible
        }}
      >
        {props.children}
      </ExpandableFiltersContext.Provider>
    </>
  )
}
export default ExpandableFilters
