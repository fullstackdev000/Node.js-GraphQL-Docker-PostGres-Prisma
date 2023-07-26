import { UnreachableCaseError } from '#veewme/lib/error'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import * as React from 'react'
import { StyledInput } from './formikFields/inputField'
import { Label } from './formikFields/styled'
import styled from './styled-components'

import { Refresh } from 'styled-icons/material'

const Title = styled.h3`
  font-weight: 400;
  font-size: 19px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  margin: -15px 0 15px;
`

const Subtitle = styled.div`
  font-size: 15px;
`

const ImageWrapper = styled.div<{
  src?: string
}>`
  position: relative;
  width: 605px;
  height: 360px;
  max-width: 100%;
  margin-bottom: 10px;
  background: no-repeat url('${props => props.src}') center / cover;

  img {
    max-width: 100%;
  }
`

const PointsHolder = styled.div`
  position: absolute;
  left:0;
  top: 0;
  right: 0;
  bottom: 0;
  transform: scale(0.7);

  &:after {
    position: absolute;
    top: -20px;
    bottom: -20px;
    left: -20px;
    right: -20px;
    content: '';
    display: block;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.7);
  }
`
const pointSize = 30
const xPosition = 0
const yPosition = 0

const Point = styled.div<{
  x: SlideXDir
  y: SlideYDir
  isActive: boolean
}>`
  position: absolute;
  width: ${pointSize}px;
  height:${pointSize}px;
  background: ${props => props.isActive ? props.theme.colors.ORANGE : '#fff'}
  border-radius: 100%;
  z-index: 1;
  cursor: pointer;
  transition: background .5s;

  ${props => {
    switch (props.x) {
      case 'LEFT':
        return `
          left: ${xPosition};
          right: unset;
        `
      case 'CENTER':
        return `
          right: calc(50% - ${pointSize / 2}px);
          left: unset;
        `
      case 'RIGHT':
        return `
          right: ${xPosition};
          left: unset;
        `

      default:
        throw new UnreachableCaseError(props.x)
    }
  }}

  ${props => {
    switch (props.y) {
      case 'UP':
        return `
          top: ${yPosition};
          bottom: unset;
        `
      case 'CENTER':
        return `
          top: calc(50% - ${pointSize / 2}px);
          bottom: unset;
        `
      case 'DOWN':
        return `
          bottom: ${yPosition};
          top: unset;
        `

      default:
        throw new UnreachableCaseError(props.y)
    }
  }}
`

const SettingsBox = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;
`

const Arrow = styled.div<{
  isActive?: boolean
  dir?: Zoom
}>`
  height: 36px;
  width: 20px;
  position: relative;
  transform-origin: center;
  transform: rotate(-40deg);
  ${props => props.dir === 'OUT' && `transform: rotate(140deg);`}

  &:after {
    position: absolute;
    content: '';
    height: 0px;
    width: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 14px solid ${props => props.isActive ? props.theme.colors.ORANGE : props.theme.colors.LABEL_TEXT};
  }

  &:before {
    content: '';
    position: absolute;
    top: 13px;
    left: 8px;
    display: block;
    height: 22px;
    width: 4px;
    background-color: ${props => props.isActive ? props.theme.colors.ORANGE : props.theme.colors.LABEL_TEXT};
  }
`
const DurationBox = styled.div`
  display: flex;
  margin-left: 40px;
  align-items: center;

  ${Label} {
    width: unset;
    margin: 0 5px 0 0;
  }
`

const NumberInput = styled(StyledInput)`
  border: 2px solid${props => props.theme.colors.BORDER};
  border-radius: 5px;
  width: 75px;
  flex: 0 0 auto;
`

const ZoomSettingsSection = styled.div<{
  isActive?: boolean
  dir: Zoom
}>`
  position: relative;
  padding-right: 20px;
  margin-right: 20px;
  cursor: pointer;

  span {
    position: absolute;
    ${props => props.dir === 'IN' ? 'top: 2px;' : 'bottom: 2px;'}
    left: 25px;
    font-size: 15px;
    font-weight: 500;
  }
`

const ResetBtn = styled(Refresh)`
  margin-left: auto;
  transform: scale(1.25) rotate(225deg);
  fill: ${props => props.theme.colors.GREY};
  cursor: pointer;
`

// TODO update kenburns banner to suppor CENTER value. Currently `undefined` is considered as `center`
export type SlideXDir = 'LEFT' | 'CENTER' | 'RIGHT'
export type SlideYDir = 'UP' | 'CENTER' | 'DOWN'
export type Zoom = 'IN' | 'OUT'
export interface SlideDirection {
  x?: SlideXDir
  y?: SlideYDir
}

interface BannerSettingsModalProps {
  imgSrc?: string
  isOpen: boolean
  onRequestClose: () => void
}

export const BannerSettingsModal: React.FunctionComponent<BannerSettingsModalProps> = ({
  imgSrc,
  isOpen,
  onRequestClose
}) => {
  const [slideDir, setSlideDir] = React.useState<SlideDirection>({})
  const [zoom, setZoom] = React.useState<Zoom>()
  const [duration, setDuration] = React.useState<number>(5)

  const xValues: SlideXDir[] = ['LEFT', 'CENTER', 'RIGHT']
  const yValues: SlideYDir[] = ['UP', 'CENTER', 'DOWN']
  const points: JSX.Element[] = []

  xValues.forEach(x => {
    yValues.forEach(y => {
      const isActive = x === slideDir.x && y === slideDir.y
      points.push(
        <Point
          x={x}
          y={y}
          key={`${x}-${y}`}
          onClick={() => setSlideDir({ x, y })}
          isActive={isActive}
        />
      )
    })
  })

  const reset = () => {
    setSlideDir({})
    setZoom(undefined)
    setDuration(5)
  }

  React.useEffect(() => {
    const config = {
      duration,
      slideDir,
      zoom
    }

    log.debug('Update', config)
  }, [slideDir, zoom, duration])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        centerVertically
      >
        <Title>
          Setup slide zoom in/out, direction and duration
          <Subtitle>(Note - default is random)</Subtitle>
        </Title>
        <ImageWrapper
          src={imgSrc}
        >
          <PointsHolder>
            {points}
          </PointsHolder>
        </ImageWrapper>
        <SettingsBox>
          <ZoomSettingsSection
            dir='IN'
            onClick={() => setZoom('IN')}
          >
            <Arrow isActive={zoom === 'IN'}/>
            <span>In</span>
          </ZoomSettingsSection>
          <ZoomSettingsSection
            dir='OUT'
            onClick={() => setZoom('OUT')}
          >
            <Arrow
              dir='OUT'
              isActive={zoom === 'OUT'}
            />
            <span>Out</span>
          </ZoomSettingsSection>
          <DurationBox>
            <Label
              htmlFor='duration'
              title='Define value in seconds'
            >
              Slide duration:
            </Label>
            <NumberInput
              id='duration'
              type='number'
              value={duration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value))}
              placeholder='Enter caption'
              max='50'
            />
          </DurationBox>
          <ResetBtn size='30' title='Reset settings' onClick={() => reset()} />
        </SettingsBox>
      </Modal>
    </>
  )
}
