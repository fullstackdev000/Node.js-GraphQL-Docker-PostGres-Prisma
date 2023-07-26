import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
// import { Tour } from '../../types'

const Wrapper = styled.div`
  position: absolute;
  width: 350px;
  height: 200px;
  right: 0;
  bottom: 150px;;
  overflow: hidden;
  pointer-events: none;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    right: 20px;
  }
`

const Label = styled.span`
  display: block;
  position: absolute;
  top: -42px;
  right: 0;
  width: 200px;
  height: 42px;
  padding: 8px;
  border-radius: 8px 8px 0 0;
  background: rgba(103, 103, 103, 1);
  text-transform: uppercase;
  font-size: 22px;
  color: #fff;
  font-weight: 500;
  text-align: center;
  transform: rotate(-90deg);
  transform-origin: bottom right;
  cursor: pointer;
  pointer-events: all;
`

const Content = styled.div<{
  collapsed: boolean
}>`
  width: 350px;
  height: 200px;
  position: absolute;
  right: ${props => props.collapsed ? '-350px' : '0'};
  padding: 15px 55px 15px 15px;
  color: #fff;
  background: rgba(103, 103, 103, 0.7);
  transition: right .5s;

  h4 {
    margin-bottom: 15px;
    padding: 0 0 10px 20px;
    border-bottom: 1px solid #fff;
    font-size: 30px;
    font-weight: 500;
  }
`

const OpenHouseDate = styled.div`
  padding: 0 0 20px 40px;

  span {
    display: block;
    padding-bottom: 3px;
  }
`

interface OpenHouseBannerProps {
}

const OpenHouseBanner: FunctionComponent<OpenHouseBannerProps> = () => {
  const [collapsed, setCollapsed] = React.useState(true)
  return (
    <Wrapper>
      <Content collapsed={collapsed}>
        <h4>Open House</h4>
        <OpenHouseDate>
          <span>Monday 7/12/20</span>
          <span>1:00 PM - 3:00 PM</span>
        </OpenHouseDate>
        <OpenHouseDate>
          <span>Wednesday 9/12/20</span>
          <span>2:00 PM - 3:00 PM</span>
        </OpenHouseDate>
      </Content>
      <Label onClick={() => setCollapsed(prev => !prev)}>Open House</Label>
    </Wrapper>
  )
}
export default OpenHouseBanner
