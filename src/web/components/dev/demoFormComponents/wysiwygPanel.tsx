import OneLineWysiwygEditor from '#veewme/web/common/formikFields/oneLineWysiwyg'
import InlineHelp from '#veewme/web/common/inlineHelp'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import Editor from '../../../common/formikFields/wysiwygEditor'
import Panel from '../../../common/panel'

const StyledHelpWrapper = styled.div `
  display: flex;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  align-items: center;
  padding: 0 5px;
`

const helpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`

const WysiwygPanel: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='WYSIWYG'>
      <Field
        name='wysiwyg'
        label='Wysiwyg'
        component={Editor}
      />
      <Field
        name='wysiwyg'
        label='Wysiwyg with inline help button'
        component={Editor}
        toolbarCustomButtons={[
          <StyledHelpWrapper key={0}>
            <InlineHelp
              text={helpText}
            />
          </StyledHelpWrapper>
        ]}
      />
      <Field
        name='oneLineWysiwyg'
        label='One Line High Wysiwyg: '
        component={OneLineWysiwygEditor}
      />
    </Panel>
  )
}

export default WysiwygPanel
