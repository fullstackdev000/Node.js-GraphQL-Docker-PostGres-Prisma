import { FlyerLayoutName } from '#veewme/gen/graphqlTypes'
import { isLayoutName } from '#veewme/web/common/util'
import * as React from 'react'
import flyerLayoutIcons from '../../../common/flyerIcons'
import styled from '../../../common/styled-components'

const Wrapper = styled.div<{ wrapItems: boolean }>`
  display: grid;
  grid-template-columns: repeat(${props => props.wrapItems ? 2 : 5}, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 25px;

  ${props => props.wrapItems && `
      @media (min-width: ${props.theme.breakpoints.BREAKPOINT_MD}) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: ${props.theme.breakpoints.BREAKPOINT_LG}) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (min-width: ${props.theme.breakpoints.BREAKPOINT_XL}) {
        grid-template-columns: repeat(5, 1fr);
      }
  `}
`

type ChildrenRenderer = (layoutName: FlyerLayoutName, isActive: boolean, i: number) => void
interface FlyerListProps {
  selectedLayoutName?: FlyerLayoutName
  children: ChildrenRenderer
  wrap?: boolean
}

const FlyerList: React.FunctionComponent<FlyerListProps> = ({
  children,
  selectedLayoutName,
  wrap = false
}) => {
  return (
    <Wrapper wrapItems={wrap}>
      {
        Object.keys(flyerLayoutIcons).map((layoutName, i) => {
          const isActive = selectedLayoutName === layoutName
          return isLayoutName(layoutName) && children(layoutName, isActive, i)
        })
      }
    </Wrapper>
  )
}

export default React.memo(FlyerList)
