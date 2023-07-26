import PanoramaViewer from '#veewme/web/common/panoramaViewer'
import styled from '#veewme/web/common/styled-components'
import { PannellumViewer } from 'pannellum'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import { TourContext } from './context'
import Toolbar from './toolbar'

const PanoramaStyled = styled(PanoramaViewer)<{
  aspectRatio?: string
  theaterMode?: boolean
}>`
  ${props => props.aspectRatio ?
    `
      aspect-ratio: ${props.aspectRatio};
      height: unset;
    `
    : 'height: calc(100vh - 105px);'
  }

  ${props => props.theaterMode ?
    `
      width: 100%;
      margin: 0;
    `
    : `
      width: 80%;
      margin: auto;
    `
  }
`

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`

interface PanoramaWithToolbarProps {
  tour: Tour
  aspectRatio?: string
}

const PanoramaWithToolbar: FunctionComponent<PanoramaWithToolbarProps> = props => {
  const { tour: { panoramas } } = props
  const panoramaEl = React.useRef<PanoramaViewer>(null)
  const mainColor = React.useContext(TourContext).mainColor
  const [ panoramaIndex, setPanoramaIndex ] = React.useState(0)
  const currentPanorama = React.useMemo(() => panoramas[panoramaIndex], [panoramas, panoramaIndex])

  const caller = (callback: (viewer: PannellumViewer) => void) => {
    if (panoramaEl.current && panoramaEl.current.viewer) {
      const viewer = panoramaEl.current.viewer
      callback(viewer)
      viewer.stopAutoRotate()
    }
  }

  if (!panoramas.length) {
    return null
  }

  return (
    <Wrapper>
      <PanoramaStyled
        key={currentPanorama.id}
        ref={panoramaEl}
        autoRotate={-1}
        panorama={currentPanorama.fullUrl}
        yaw={currentPanorama.initialHorizontalAngle}
        pitch={currentPanorama.initialVerticalAngle}
        // TODO: check exact meaning of hfov param in panorama uplaod when panorama generation (server side) is done
        // it seams that it acts as haov (needed for partial panoramas)
        haov={currentPanorama.hfov}
        hfov={currentPanorama.initialZoom}
        // TODO make below props optional
        onMouseDown={() => null}
        onMouseUp={() => null}
        onMouseMove={() => null}
        onZoomChange={() => null}
        aspectRatio={props.aspectRatio}
        theaterMode={currentPanorama.theaterMode}
      >
        <Toolbar
          mainColor={mainColor}
          setPanoramaIndex={setPanoramaIndex}
          panoramaIndex={panoramaIndex}
          panoramas={panoramas}
          caller={caller}
        />
      </PanoramaStyled>
    </Wrapper>
  )
}

export default PanoramaWithToolbar
