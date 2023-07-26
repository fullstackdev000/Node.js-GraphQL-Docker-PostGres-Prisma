import { Checkbox } from '#veewme/web/common/formikFields/checkboxField'
import * as React from 'react'
import Button from '../../../common/buttons/basicButton'
import { PureSlider } from '../../../common/formikFields/sliderField'
import * as Grid from '../../../common/grid'
import Panel from '../../../common/panel'
import PanoramaViewer from '../../../common/panoramaViewer'
import styled from '../../../common/styled-components'

import { OrderPanorama } from '../types'

const PanoramaHeading = styled.div`
  padding: 25px;
  background: ${props => props.theme.colors.DARK_BLUE};
  color: #fff;
  font-size: 13px;
  line-height: 1.5;

  span {
    color: ${props => props.theme.colors.GREEN};
  }
`

const Slider = styled(props => <PureSlider {...props} />)`
  margin-bottom: 20px;
  span {
    width: 50px;
  }
`

const PanoramaSection = styled.div`
  border-radius: 5px;
  overflow: hidden;
`

const SlidersWrapper = styled.div`
  user-select: none;
`

export type PanoramaData = Pick<OrderPanorama,
  'id'
  | 'fullUrl'
  | 'hfov'
  | 'initialZoom'
  | 'initialVerticalAngle'
  | 'initialHorizontalAngle'
  | 'theaterMode'
>

interface PanoramaEditorProps {
  panorama: PanoramaData
  onSubmit: (values: PanoramaData) => void
}

interface PanoramaEditorState {
  yaw: number
  pitch: number
  mouseDown: boolean
  zoom: number
  theaterMode: boolean
}

class PanoramaEditor extends React.PureComponent<PanoramaEditorProps, PanoramaEditorState> {
  state: PanoramaEditorState = {
    mouseDown: false,
    pitch: this.props.panorama.initialVerticalAngle,
    theaterMode: this.props.panorama.theaterMode,
    yaw: this.props.panorama.initialHorizontalAngle,
    zoom: this.props.panorama.initialZoom
  }

  handleMouseMove = (yaw: number, pitch: number) => {
    this.state.mouseDown && this.setState({
      pitch:  Math.round(pitch * 10) / 10,
      yaw:  Math.round(yaw * 10) / 10
    })
  }

  handleZoomChange = (zoom: number) => {
    this.setState({
      zoom: Math.round(zoom)
    })
  }

  handleSubmit = () => {
    const panoramaCopy = {
      ...this.props.panorama,
      initialHorizontalAngle: this.state.yaw,
      initialVerticalAngle: this.state.pitch,
      initialZoom: this.state.zoom,
      theaterMode: this.state.theaterMode
    }

    this.props.onSubmit(panoramaCopy)
  }

  render () {
    const { panorama } = this.props

    return (
      <>
        <Grid.MainColumn>
          <PanoramaSection>
            <PanoramaHeading>
              <span>Note!</span> You can adjust your panorama settings here.
              Drag the panorama around to set the perfect starting point of view. You can also use sliders.
            </PanoramaHeading>
            <PanoramaViewer
              panorama={this.props.panorama.fullUrl}
              yaw={this.state.yaw}
              pitch={this.state.pitch}
              // TODO: check exact meaning of hfov param in panorama uplaod when panorama generation (server side) is done
              // it seams that it acts as haov (needed for partial panoramas)
              haov={panorama.hfov}
              hfov={this.state.zoom}
              onMouseDown={() => this.setState({ mouseDown: true })}
              onMouseUp={() => this.setState({ mouseDown: false })}
              onMouseMove={this.handleMouseMove}
              onZoomChange={this.handleZoomChange}
            />
          </PanoramaSection>
          <Panel id='starting' heading='Starting Point'>
            <SlidersWrapper>
              <Slider
                label='Horizontal Start'
                min={-180}
                max={180}
                step={0.1}
                value={this.state.yaw}
                unit='&#176;'
                onChange={(v: number) => this.setState({ yaw: v })}
              />
              <Slider
                label='Vertical Start'
                min={-90}
                max={90}
                step={0.1}
                value={this.state.pitch}
                unit='&#176;'
                onChange={(v: number) => this.setState({ pitch: v })}
              />
              <Slider
                label='Initial Zoom'
                min={40}
                max={120}
                step={1}
                value={this.state.zoom}
                unit='&#176;'
                onChange={(zoom: number) => this.setState({ zoom })}
              />
            </SlidersWrapper>
            <Checkbox
              checked={this.state.theaterMode}
              label='Theater mode'
              labelFirst={false}
              onChange={e => this.setState({ theaterMode: e.target.checked })}
            />
          </Panel>
        </Grid.MainColumn>
        <Grid.FooterContainer>
          <Button type='button' full buttonTheme='action' label='Submit' onClick={this.handleSubmit} />
          <Grid.BackButton />
        </Grid.FooterContainer>
      </>
    )
  }
}

export default PanoramaEditor
