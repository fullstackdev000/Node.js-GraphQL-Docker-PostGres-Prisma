import * as React from 'react'
import { PureSlider } from './formikFields/sliderField'
import styled from './styled-components'

const Slider = styled(props => <PureSlider {...props} />)`
  display: flex;
  margin: 15px 0 20px;
  flex-wrap: nowrap;
  justify-content: flex-end;

  &&& label {
    width: auto;
    flex: 0 0 auto;
    margin: 0;
    padding-right: 7px;
  }

  & > div {
    flex: 0 0 240px;
  }

  & > div > span {
    display: none;
  }

  .rc-slider-handle {
    height: 16px;
    top: 8px;
  }
`

interface PhotoSizeSliderProps {
  onChange: (v: number) => void
  name?: string
  label?: string
  min?: number
  max?: number
}

const PhotoSizeSlider: React.FC<PhotoSizeSliderProps> = ({
  label,
  min = 85,
  max = 125,
  name,
  onChange
}) => {
  let initialValue = 100
  if (name) {
    const savedValue = localStorage.getItem(name)
    initialValue = savedValue ? Number(savedValue) : initialValue
  }

  const [value, setValue] = React.useState(initialValue)

  const handleChange = React.useCallback((v: number) => {
    setValue(v)

    if (name) {
      localStorage.setItem(name, String(v))
    }
  }, [name])

  React.useEffect(() => {
    onChange(value / 100)
  }, [value])

  return (
    <Slider
      label={label}
      min={min}
      max={max}
      step={1}
      value={value}
      onChange={handleChange}
      tipFormatter={(v: number) => `${v}%`}
    />
  )
}

export default PhotoSizeSlider
