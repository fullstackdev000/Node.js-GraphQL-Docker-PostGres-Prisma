import styled from '#veewme/web/common/styled-components'
import React from 'react'
import screenfull from 'screenfull'

import { ExitFullscreen, Fullscreen } from 'styled-icons/boxicons-regular'

export const StyledButton = styled.span`
  display: inline-block;
  cursor: pointer;
`
interface FullScreenBtnProps {
  elementSelector: string
  globalStyleComponent?: JSX.Element
}
const FullScreenBtn: React.FunctionComponent<FullScreenBtnProps> = ({
  elementSelector,
  globalStyleComponent
}) => {
  const [ isFullScreen, setFullScreen ] = React.useState<boolean>(false)

  React.useEffect(() => {
    const callback = () => {
      const isFullscreen = screenfull.isEnabled && screenfull.isFullscreen
      setFullScreen(isFullscreen)
    }
    screenfull.isEnabled && screenfull.on('change', callback)

    return () => { screenfull.isEnabled && screenfull.off('change', callback) }
  }, [])

  // Safari requires that fullscreen API call is placed directly in click handler.
  // If it was placed inside e.g. useEffect hook it wouldn't work
  const fullscreenClickHandler = () => {
    if (!screenfull.isEnabled) {
      return
    }
    const el: HTMLElement = document.querySelector(elementSelector) as HTMLElement

    if (!screenfull.element) {
      screenfull.request(el).catch(() => 'Problem toggling full screen')
    } else {
      screenfull.exit().catch(() => 'Problem toggling full screen')
    }
  }

  return (
    <StyledButton onClick={fullscreenClickHandler}>
      {!isFullScreen ? <Fullscreen size='20' /> : <ExitFullscreen size='20' />}
      {isFullScreen && globalStyleComponent}
    </StyledButton>
  )
}

export default FullScreenBtn
