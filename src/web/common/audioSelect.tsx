import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { components } from 'react-select'
import { ValueContainerProps } from 'react-select/lib/components/containers'
import { Select } from './formikFields/selectField'
import styled from './styled-components'

import { VolumeMedium, VolumeMute2 } from 'styled-icons/icomoon'

const AudioSelectWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  & > div {
    min-width: 250px;
    margin-right: 5px;
  }
`

const SelectWrapper = styled.div<{
  noValue?: boolean
}>`
  padding-left: 26px;
  display: flex;
  flex: 1;
  align-items: center;

  svg {
    position: absolute;
    left: 6px;
    top: 0;
    padding: 4px;
    color: ${props => props.noValue ? props.theme.colors.GREY : props.theme.colors.GREEN};
    ${props => props.noValue && 'opacity: 0.7;'}
    z-index: 10;
  }
`

const ValueContainer = (props: ValueContainerProps<string> & {
  isPlaying: boolean
  onClick: () => void
}) => {
  const valueSelected = !!props.selectProps.value.value
  const handleClick = () => {
    if (valueSelected) {
      props.onClick()
    }
  }
  const icon = !props.isPlaying || !valueSelected ? (
    <VolumeMute2
      size='28'
      onMouseDown={e => e.stopPropagation()}
      onClick={handleClick}
    />
  ) : (
    <VolumeMedium
      size='28'
      onClick={handleClick}
      onMouseDown={e => e.stopPropagation()}
    />
  )
  return (
    <SelectWrapper noValue={!valueSelected}>
      {icon}
      <components.ValueContainer {...props} />
    </SelectWrapper>
  )
}

interface AudioRefsMap {
  [audioId: string]: HTMLAudioElement
}

export interface AudioItem {
  id: string
  name: string
  src: string
}

export interface AudioSelectProps {
  className?: string
  audios: AudioItem[]
  label?: string
  onChange: (value: string) => void
  value: AudioItem['id']
  placeholder?: string
  preload?: 'auto' | 'meta' | 'none'
}

export const AudioSelect: React.FunctionComponent<AudioSelectProps> = ({
  audios,
  className,
  onChange,
  value: audioId,
  label,
  placeholder = 'Listen / Choose music track',
  preload = 'auto'
 }) => {
  const [ isPlaying, setPlaying ] = React.useState(false)
  // Ref holding arrays of refs to audio elements
  // https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
  // https://stackoverflow.com/questions/55995760/how-to-add-refs-dynamically-with-react-hooks
  // https://stackoverflow.com/questions/54940399/how-target-dom-with-react-useref-in-map
  const AudioRefs = React.useRef<AudioRefsMap>({})
  const audioOptions = audios.map(audioItem => ({
    label: audioItem.name,
    value: audioItem.id
  }))

  const options = [{
    label: 'No audio track',
    value: ''
  }, ...audioOptions]

  const playCurrentAudio = () => {
    const currentAudio = AudioRefs.current[audioId]
    if (currentAudio) {
      currentAudio.currentTime = 0
      currentAudio.play().catch(() => log.debug('Error: play rejected'))
    }
  }

  const stopPlaying = () => {
    Object.keys(AudioRefs.current).forEach(id => AudioRefs.current[id].pause())
  }

  React.useEffect(() => {
    if (isPlaying) {
      playCurrentAudio()
    } else {
      stopPlaying()
    }
  }, [isPlaying])

  React.useEffect(() => {
    if (audioId) {
      stopPlaying()
      setPlaying(true)
      playCurrentAudio()
    } else {
      stopPlaying()
      setPlaying(false)
    }
  }, [audioId])

  return (
    <AudioSelectWrapper className={className}>
      {/* render list of audios with partaially preloaded content to minimize delay in playing music when select value has changed*/}
      {audios.map(audioItem => (
        <audio key={audioItem.id} ref={el => el && (AudioRefs.current[audioItem.id] = el)} src={audioItem.src} preload={preload} />
      ))}
      <Select
        compactMode
        components={{
          ValueContainer: props => <ValueContainer {...props} isPlaying={isPlaying} onClick={() => setPlaying(prev => !prev)} />
        }}
        label={label}
        value={audioId}
        placeholder={placeholder}
        options={options}
        onChange={selected => {
          if (selected) {
            onChange(selected.value)
          }
        }}
      />
    </AudioSelectWrapper>
  )
}

export default React.memo(AudioSelect)
