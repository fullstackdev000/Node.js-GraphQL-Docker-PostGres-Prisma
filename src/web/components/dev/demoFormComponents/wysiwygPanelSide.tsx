import { Field } from 'formik'
import * as React from 'react'
import Editor from '../../../common/formikFields/wysiwygEditor'
import Panel from '../../../common/panel'

const WysiwygPanelSide: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='WYSIWYG 2'>
      <Field
        name='wysiwyg2'
        label='Wysiwyg 2'
        component={Editor}
      />
    </Panel>
  )
}

export default WysiwygPanelSide
