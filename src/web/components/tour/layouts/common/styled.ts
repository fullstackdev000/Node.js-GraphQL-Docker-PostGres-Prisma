import styled, { css, keyframes } from '#veewme/web/common/styled-components'

export const ImagePlaceholder = styled.div<{
  width: number
  height: number
}>`
  aspect-ratio: ${props => props.width / props.height};
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-weight: 500;
  font-size: 26px;
  flex-wrap: wrap;

  div {
    width: 100%;
    padding: 0 20px;
    text-align: center;

    + div {
      margin-top: 15px;
      font-size: 34px;
      rotate: 90deg;
    }
  }
`

const expand = keyframes`
  from {
    max-height: 0;
  }

  to {
    max-height: 1000px;
  }
`

export const MapWrapper = styled.div`
  max-height: 0;
  overflow: hidden;
  animation-duration: .5s;
  animation-name: ${expand};
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards
`

export const PreviewLayer = css`
  &:after {
    content: 'Preview';
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.6);
    font-size: 70px;
    color: ${props => props.theme.colors.GREY};
    line-height: 500px;
    font-weight: 500;
    text-align: center;
    z-index: 100;
    pointer-events: none;
  }
`
