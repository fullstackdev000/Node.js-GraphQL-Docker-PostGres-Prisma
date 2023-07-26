import * as log from '#veewme/web/common/log'
import * as React from 'react'
import AudioSelect from '../../common/audioSelect'
import styled from '../../common/styled-components'

export const AudioFilesMock = [{
  id: 'ap1',
  name: 'African Party',
  src: '/public/static/audio/african-party.mp3'
}, {
  id: 'cb2',
  name: 'Cannonballs',
  src: '/public/static/audio/cannonballs.mp3'
}, {
  id: 'so3',
  name: 'Startover',
  src: '/public/static/audio/startover.mp3'
}, {
  id: 'sb4',
  name: 'Summer beat',
  src: '/public/static/audio/summer-beat.mp3'
}, {
  id: 'md5',
  name: 'Magic dreams',
  src: '/public/static/audio/magic-dreams.mp3'
}]

const Wrapper = styled.div`
  padding: 30px;
`

const MediaDemo: React.FunctionComponent = () => {
  const [currentMusic, changeMusic] = React.useState('')
  log.debug(currentMusic)
  return (
    <Wrapper>
      <AudioSelect
        label='Select audio track'
        audios={AudioFilesMock}
        value={currentMusic}
        onChange={value => changeMusic(value)}
      />
    </Wrapper>
  )
}

export default MediaDemo
