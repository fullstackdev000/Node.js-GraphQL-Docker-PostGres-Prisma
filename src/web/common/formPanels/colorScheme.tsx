import { nameof } from '#veewme/lib/util'
import ColorField from '#veewme/web/common/formikFields/colorField'
import { StyledNote, StyledNoteHighlight } from '#veewme/web/common/formPanels/styles'
import Panel from '#veewme/web/common/panel'
import { Field } from 'formik'
import * as React from 'react'
import { EditAffiliateValues } from '../../components/affiliates/editAffiliate/types'

const note = 'Set your default property site & flyer color.'
const ColorScheme: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='Default Color Scheme' toggleable>
      <StyledNote>
        <StyledNoteHighlight>Note! </StyledNoteHighlight>
        {note}
      </StyledNote>
      <Field
        name={`${nameof<EditAffiliateValues>('defaultColorScheme')}`}
        label='Select Color:'
        component={ColorField}
      />
    </Panel>
  )
}

export default ColorScheme
