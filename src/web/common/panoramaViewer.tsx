import { PannellumProps, PannellumViewer } from 'pannellum'
import 'pannellum/src/js/libpannellum.js'
import 'pannellum/src/js/pannellum.js'
import 'pannellum/src/js/RequestAnimationFrame'

import * as React from 'react'
import styled from './styled-components'

// Orignal pannellum styles include svg backgrounds which break our build process (lack of some webpack loader)
// Since these backgrounds are not needed in our case at all it doesn't make sense to complicate build process
// and it's easier to just copy a few lines of needed css
const Panorama = styled.div`
  width: 100%;
  height: 330px;
  background: #fff;

  .pnlm-container {
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    cursor: default;
    width: 100%;
    height: 100%;
    user-select: none;
    outline: 0;
    line-height: 1.4;
    contain: content;
    touch-action: none;
  }

  .pnlm-ui {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .pnlm-grab {
    cursor: grab;
  }

  .pnlm-grabbing {
    cursor: grabbing;
  }

  .pnlm-render-container {
    cursor: inherit;
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .pnlm-load-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 150px;
    margin: -75px 0 0 -100px;
    background-color: rgba(0,0,0,0.7);
    border-radius: 3px;
    text-align: center;
    font-size: 20px;
    display: none;
    color: #fff;

    p {
      margin: 20px 0;
    }
  }

  .pnlm-about-msg {
    display: none;
  }

  .pnlm-lbox {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    display: none;
  }

  .pnlm-loading {
    animation-duration: 1.5s;
    animation-name: pnlm-mv;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    height: 10px;
    width: 10px;
    background-color: #fff;
    position: relative;
  }

  @keyframes pnlm-mv {
    from {left:0;top:0;}
    25% {left:10px;top:0;}
    50% {left:10px;top:10px;}
    75% {left:0;top:10px;}
    to {left:0;top:0;}
  }

  @-webkit-keyframes pnlm-mv {
    from {left:0;top:0;}
    25% {left:10px;top:0;}
    50% {left:10px;top:10px;}
    75% {left:0;top:10px;}
    to {left:0;top:0;}
  }


  .pnlm-dragfix, .pnlm-preview-img {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .pnlm-lbar {
    width: 150px;
    margin: 0 auto;
    border:  ${props => props.theme.colors.GREEN} 1px solid;
    height: 6px;
  }

  .pnlm-lmsg {
    font-size: 12px;
  }

  .pnlm-lbar-fill {
    background: ${props => props.theme.colors.GREEN};
    height: 100%;
    width: 0;
  }

  .pnlm-pointer {
    cursor: pointer;
  }

  .pnlm-about-msg {
    font-size: 11px;
    line-height: 11px;
    color: #fff;
    padding: 5px 8px 5px 8px;
    background: rgba(0,0,0,0.7);
    border-radius: 3px;
    position: absolute;
    top: 50px;
    left: 50px;
    display: none;
    opacity: 0;
    transition: opacity .3s ease-in-out;
    z-index: 1;

    a {
      color: #fff
    }
  }
`

const repeatCallback = (callback: () => void, interval: number, duration: number) => {
  let totalTime = 0
  const timer = setInterval(() => {
    totalTime += interval
    totalTime > duration ? clearInterval(timer) : callback()
  }, interval)
}

interface PanoramaViewerProps extends PannellumProps {
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseMove: (yaw: number, pitch: number) => void
  onZoomChange: (zoom: number) => void
  className?: string
  children?: React.ReactNode
}

interface PanoramaViewerState {
}

export default class PanoramaViewer extends React.PureComponent<PanoramaViewerProps, PanoramaViewerState> {
  viewer?: PannellumViewer

  updateYaw = (yaw: number) => {
    if (this.viewer) {
      this.viewer.setYaw(yaw, false)
    }
  }

  updatePitch = (pitch: number) => {
    if (this.viewer) {
      this.viewer.setPitch(pitch, false)
    }
  }

  updateZoom = (zoom: number) => {
    this.viewer && this.viewer.setHfov(zoom, false)
    const updatedZoom = this.viewer && this.viewer.getHfov()
    // check if given value has been actually set - in some cases final value is limited by pannellum
    if (typeof updatedZoom !== 'undefined' && updatedZoom !== zoom) {
      if (this.props.onZoomChange) {
        this.props.onZoomChange(updatedZoom)
      }
    }

  }

  componentDidMount () {
    const { autoRotate, panorama, yaw, haov, hfov, pitch } = this.props
    this.viewer = pannellum.viewer('panorama', {
      autoLoad: true,
      autoRotate,
      haov,
      hfov,
      keyboardZoom: false,
      maxHfov: 120,
      minHfov: 40,
      panorama,
      pitch,
      showControls: false,
      showZoomCtrl: false,
      type: 'equirectangular',
      yaw
    })

    this.viewer.on('mousedown', this.props.onMouseDown)
    this.viewer.on('mouseup', this.props.onMouseUp)
  }

  handleMouseMove = () => {
    const yaw = this.viewer!.getYaw()
    const pitch = this.viewer!.getPitch()
    let limitedPitch = pitch
    if (pitch > 90) {
      limitedPitch = 90
    } else if (pitch < -90) {
      limitedPitch = -90
    }
    this.props.onMouseMove && this.props.onMouseMove(yaw, limitedPitch)
  }

  handleWheel = () => {
    // there is not way to disable animation on mouse wheel in pannellum so slider value must be updated accordingly
    repeatCallback(() => {
      const hfov = this.viewer!.getHfov()
      this.props.onZoomChange && this.props.onZoomChange(hfov)
    }, 20, 1100)

  }

  componentDidUpdate (prevProps: PanoramaViewerProps) {
    const { pitch, yaw, hfov } = this.props
    if (typeof yaw !== 'undefined' && prevProps.yaw !== yaw) {
      this.updateYaw(yaw)
    }

    if (typeof pitch !== 'undefined' && prevProps.pitch !== pitch) {
      this.updatePitch(pitch)
    }

    if (typeof hfov !== 'undefined' && prevProps.hfov !== hfov) {
      this.updateZoom(hfov)
    }
  }

  render () {
    return (
      <Panorama className={this.props.className}>
        <div
          id='panorama'
          onMouseMove={this.handleMouseMove}
          onWheel={this.handleWheel}
        >
          {this.props.children}
        </div>
      </Panorama>
    )
  }
}
