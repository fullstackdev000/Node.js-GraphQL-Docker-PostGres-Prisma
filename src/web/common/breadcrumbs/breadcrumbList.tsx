import * as React from 'react'
import styled from '../styled-components'
import Breadcrumb, { BreadcrumbType } from './breadcrumb'
import Connector from './connector'

const StyledWrapper = styled.nav `
  flex: 0 0 165px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid ${props => props.theme.colors.BORDER};
  padding-right: 8px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    flex: 0 0 60px;
    flex-direction: row;
    justify-content: center;
    margin-left: 12px;
    border: none;
  }
`

const StyledBreadcrumbWrapper = styled.div `
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`

interface BreadcrumbListProps {
  breadcrumbs: BreadcrumbType[]
}

const BreadcrumbList: React.FunctionComponent<BreadcrumbListProps> = props => (
  <StyledWrapper>
    {props.breadcrumbs.map((breadcrumb, i) => (
      <StyledBreadcrumbWrapper key={i}>
        <Breadcrumb
          circleLabel={(i + 1).toString()}
          {...breadcrumb}
        />
        {(props.breadcrumbs.length > (i + 1)) &&
          <Connector
            active={breadcrumb.active || breadcrumb.completed}
          />
        }
      </StyledBreadcrumbWrapper>
    ))}
  </StyledWrapper>
)

export default BreadcrumbList
