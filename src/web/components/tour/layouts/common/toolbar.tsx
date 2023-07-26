import { itemShadow } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import { PannellumViewer } from 'pannellum'
import React, { FunctionComponent } from 'react'
import screenfull from 'screenfull'
import { Tour } from '../../types'

import { CaretDown, CaretUp, ChevronLeft, ChevronRight, ExitFullscreen, Fullscreen } from 'styled-icons/boxicons-regular'
import { GridAlt } from 'styled-icons/boxicons-solid'
import { Minus, Plus } from 'styled-icons/fa-solid'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'styled-icons/icomoon'

const ToolbarStyled = styled.div<{
  color: string
  collapsed: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;
  bottom: ${props => props.collapsed ? '-50px' : '20px'};
  transition: bottom .5s;
  width: 600px;
  height: 40px;
  padding: 0 10px;
  left: 50%;
  margin-left: -300px;
  background: ${props => props.color};
  ${itemShadow}
`

const ToolbarCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ToolbarSide = styled.div`
  display: flex;
  flex: 0 0 30%;
  justify-content: flex-start;
  align-items: center;

  & ~ & {
    justify-content: flex-end;
  }
`

const ToolbarToggle = styled.div<{
  show: boolean
}>`
  position: absolute;
  width: 40px;
  height: 40px;
  left: 50%;
  margin-left: -20px;
  bottom: ${props => props.show ? '0' : '-50px'};
  transition: ${props => props.show ? 'bottom .5s .5s' : 'bottom .5s'};
  cursor: pointer;
  z-index: 100;

  svg {
    fill: #fff;
    opacity: 0.9;
  }

`

const ToolbarBtn = styled.div<{
  disabled?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  cursor: pointer;

  ${props => props.disabled && `
    pointer-events: none;
    opacity: 0.4;
  `}

  svg {
    transition: transform .5s;
    &:hover {
      transform: scale(1.2);
    }
  }

  &:nth-child(4) {
    svg {
      margin-top: 5px;
    }
  }
`

const ThumbsToolbar = styled.div<{
  show: boolean
  color: string
}>`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: ${props => !props.show ? '0' : '110px'};
  transition: height .5s;
  overflow: hidden;
  background: ${props => props.color};
`

const ThumbsToolbarInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`

const Thumb = styled.div<{
  imgUrl: string
  isActive: boolean
}>`
  width: 100px;
  height: 80px;
  margin: 0 7px;
  border 1px solid ${props => props.isActive ? '#fff' : 'transparent'};
  background: center/cover url('${props => props.imgUrl}') no-repeat;
  cursor: pointer;
`
type SetIndexCallback = (stateUpdater: ((prev: number) => number) | number) => void
interface PanoramaToolbarProps {
  mainColor: string
  setPanoramaIndex: SetIndexCallback
  panoramas: Tour['panoramas']
  panoramaIndex: number
  caller: (callback: (viewer: PannellumViewer) => void) => void
}

const PanoramaToolbar: FunctionComponent<PanoramaToolbarProps> = ({
  caller,
  mainColor,
  panoramas,
  panoramaIndex,
  setPanoramaIndex
}) => {
  const [toolbarVisibility, setToolbarVisibility] = React.useState(true)
  const [ thumbsToolbarVisibility, setThumbsToolbarVisibility ] = React.useState(false)
  const [ isFullScreen, setFullScreen ] = React.useState<boolean>(false)
  const panoramasCount = panoramas.length
  // TODO move full screen button to separate component
  React.useEffect(() => {
    const callback = () => {
      const isFullscreen = screenfull.isEnabled && screenfull.isFullscreen
      setFullScreen(isFullscreen)
    }
    screenfull.isEnabled && screenfull.on('change', callback)

    return () => { screenfull.isEnabled && screenfull.off('change', callback) }
  }, [])

  return (
    <>
      <ToolbarStyled
        color={mainColor}
        collapsed={!toolbarVisibility}
      >
        <ThumbsToolbar
          show={thumbsToolbarVisibility}
          color={mainColor}
        >
          <ThumbsToolbarInner>
            {
              panoramas.map((p, i) => {
                return (
                  <Thumb
                    key={p.id}
                    onClick={() => setPanoramaIndex(i)}
                    imgUrl={p.thumbUrl}
                    isActive={i === panoramaIndex}
                  />
                )
              })
            }
            </ThumbsToolbarInner>
        </ThumbsToolbar>
        <ToolbarSide>
          <ToolbarBtn
            onClick={() => setPanoramaIndex(prev => Math.abs((prev - 1) % panoramasCount))}
            disabled={panoramasCount < 2}
          >
            <ChevronLeft size='40'/>
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => setThumbsToolbarVisibility(prev => !prev)}
            disabled={panoramasCount < 2}
          >
            <GridAlt size='30'/>
          </ToolbarBtn>
        </ToolbarSide>
        <ToolbarCenter>
          <ToolbarBtn
            onClick={() => caller(viewer => viewer.setYaw(viewer.getYaw() - 5))}
          >
            <ArrowLeft size='20'/>
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => caller(viewer => viewer.setYaw(viewer.getYaw() + 5))}
          >
            <ArrowRight size='20'/>
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => caller(viewer => viewer.setPitch(viewer.getPitch() + 5))}
          >
            <ArrowUp size='20'/>
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => caller(viewer => viewer.setPitch(viewer.getPitch() - 5))}
          >
            <ArrowDown size='20'/>
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => caller(viewer => viewer.setHfov(viewer.getHfov() - 5))}
          >
            <Plus size='20'/>
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => caller(viewer => viewer.setHfov(viewer.getHfov() + 5))}
          >
            <Minus size='20'/>
          </ToolbarBtn>
        </ToolbarCenter>
        <ToolbarSide>
          <ToolbarBtn
            onClick={() => {
              caller(viewer => viewer.toggleFullscreen())
              setFullScreen(prev => !prev)
            }}
          >
            {!isFullScreen ? <Fullscreen size='20' /> : <ExitFullscreen size='20' />}
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => {
              setThumbsToolbarVisibility(false)
              setToolbarVisibility(false)
            }}
          >
            <CaretDown size='40'/>
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => setPanoramaIndex(prev => Math.abs((prev + 1) % panoramasCount))}
            disabled={panoramasCount < 2}
          >
            <ChevronRight size='40'/>
          </ToolbarBtn>
        </ToolbarSide>
      </ToolbarStyled>
      <ToolbarToggle
        show={!toolbarVisibility}
        onClick={() => setToolbarVisibility(true)}
      >
        <CaretUp size='50' />
      </ToolbarToggle>
    </>
  )
}

export default PanoramaToolbar
