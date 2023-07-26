import { nameof } from '#veewme/lib/util'
import AudioField from '#veewme/web/common/formikFields/audioSelectField'
import Panel from '#veewme/web/common/panel'
// TODO remove mock data
import { AudioFilesMock } from '#veewme/web/components/dev/demoMedia'
import { Field } from 'formik'
import * as React from 'react'
import { FauxVideoMusicValues } from '../../components/affiliates/editAffiliate/types'

const FauxVideoMusic: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='Set Background Music' toggleable>
      <Field
        name={nameof<FauxVideoMusicValues>('slideShowMusic')}
        label='Select for Property Site Slideshow:'
        component={AudioField}
        audios={AudioFilesMock}
      />
      <Field
        name={nameof<FauxVideoMusicValues>('defaultFauxVideoMusic')}
        label='Select for Faux Video:'
        component={AudioField}
        audios={AudioFilesMock}
      />
    </Panel>
  )
}

export default FauxVideoMusic
