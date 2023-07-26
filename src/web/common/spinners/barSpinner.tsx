import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const SpinnerWrapper = styled.div<{ height: number, width: number }>`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-clip: padding-box;
  overflow: hidden;
  &::before {
    content: "";
    background-color: ${props => props.theme.colors.GREEN};
    opacity: 0.2;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
  }
`

const Bar = styled.div`
  position: absolute;
  height: 100%;
  background-color: ${props => props.theme.colors.GREEN};
  background-clip: padding-box;
  display: block;
  will-change: left, right;
  overflow: hidden;
  border-radius: 2px;
`

const Bar1 = styled(Bar)`
  animation: 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) 0s infinite normal none running bar;
  @keyframes bar {
    0% {
      left: -35%;
      right: 100%;
    }
    60% {
      left: 100%;
      right: -90%;
    }
    100% {
      left: 100%;
      right: -90%;
    }
  }
`

const Bar2 = styled(Bar)`
  animation: 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite normal none running bar;
  @keyframes bar {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
`

interface BarSpinnerProps {
  height?: number
  width?: number
}

const BarSpinner: React.FunctionComponent<BarSpinnerProps> = ({ height = 4, width = 100 }) => {

  return (
    <SpinnerWrapper height={height} width={width} >
      <Bar1 />
      <Bar2 />
    </SpinnerWrapper>
  )
}

export default BarSpinner
