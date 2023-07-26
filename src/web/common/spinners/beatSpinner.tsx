import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const Message = styled.div`
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-size: 14px;
`

const LoaderWrapper = styled.div<{ messageLast?: boolean }>`
  display: flex;
  justify-content: ${props => props.messageLast ? 'flex-end' : 'flex-start'};
  align-items: center;
  flex-direction: ${props => props.messageLast ? 'row-reverse' : 'row'};
  ${Message} {
    ${props => props.messageLast
      ? 'margin-left: 10px;'
      : 'margin-right: 10px;'
    };
  }
`

const Loader = styled.div<{ size: number }>`
  & > * {
    width: ${props => props.size}px;
    height: ${props => props.size}px;
  }
`

const Dot = styled.div`
  display: inline-block;
  background-color: ${props => props.theme.colors.GREEN};
  border-radius: 100%;
  animation: 0.7s linear 0s infinite normal both running beat;
  @keyframes beat {
    50% {
      transform: scale(0.75);
      opacity: 0.2;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
  }
  &:nth-child(even) {
    animation-delay: 0.35s;
  }
  &:nth-child(odd) {
    animation-delay: 0s;
  }
`

interface BeatSpinnerProps {
  className?: string
  message?: string
  messageLast?: boolean
  size?: number
}

const BeatSpinner: React.FunctionComponent<BeatSpinnerProps> = ({ size = 7, ...props }) => {
  return (
    <LoaderWrapper className={props.className} messageLast={props.messageLast} >
      {props.message && <Message>{props.message}</Message>}
      <Loader size={size}>
        <Dot />
        <Dot />
        <Dot />
      </Loader>
    </LoaderWrapper>
  )
}

export default BeatSpinner
