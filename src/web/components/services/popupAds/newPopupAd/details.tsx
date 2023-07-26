import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import OneLineWysiwygEditor from '#veewme/web/common/formikFields/oneLineWysiwyg'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from './form'

const helpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`

const StyledContent = styled.div `
  display: flex;
  flex-direction: column;
`

const StyledInlineHelpWrapper = styled.div `
  display: flex;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  align-items: center;
  padding: 0 5px;
`

const StyledInputField = styled(InputField) `
  margin-bottom: 32px;
`

const StyledTitle = styled.p `
  color: ${props => props.theme.colors.LABEL_TEXT};
  margin-bottom: 24px;
`

interface DetailsProps {
  values: FormValues
}

const Details: React.FunctionComponent<DetailsProps> = props => {
  return (
    <Panel heading='Details' id='details' toggleable>
      <StyledContent>
        <Field
          name={nameof<FormValues>('headline')}
          label='Headline: '
          component={OneLineWysiwygEditor}
        />
        <Field
          name={nameof<FormValues>('description')}
          label='Description'
          component={Editor}
          toolbarCustomButtons={[
            <StyledInlineHelpWrapper key={0}>
              <InlineHelp
                text={helpText}
              />
            </StyledInlineHelpWrapper>
          ]}
        />
        <Field
          name={nameof<FormValues>('footNote')}
          component={StyledInputField}
          label='Footer Note/Disclaimer:'
        />
        <Field
          component={UploadImageField}
          fieldOrientation='landscape'
          name={nameof<FormValues>('imageUrl')}
          label={<>
            <StyledTitle>Main image:</StyledTitle>
            Choose the photo that will appear at the popup box.
          </>}
        />
      </StyledContent>
    </Panel>
  )
}

export default Details
