import React from 'react'
import screenfull from 'screenfull'
import { FullScreenBtn, GlobalFullScreenStyle } from './styled'

import { ExitFullscreen, Fullscreen } from 'styled-icons/boxicons-regular'

const CalendarFullScreenBtn: React.FunctionComponent = () => {
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
    const el: HTMLElement = document.querySelector('body') as HTMLElement

    if (!screenfull.element) {
      screenfull.request(el).catch(() => 'Problem toggling full screen')
    } else {
      screenfull.exit().catch(() => 'Problem toggling full screen')
    }
  }

  return (
    <FullScreenBtn onClick={fullscreenClickHandler}>
      {!isFullScreen ? <Fullscreen size='20' /> : <ExitFullscreen size='20' />}
      {isFullScreen && <GlobalFullScreenStyle />}
    </FullScreenBtn>
  )
}

export default CalendarFullScreenBtn
