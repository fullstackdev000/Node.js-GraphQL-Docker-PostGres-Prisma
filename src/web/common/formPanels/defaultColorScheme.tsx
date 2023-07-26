import { nameof } from '#veewme/lib/util'
import ColorField from '#veewme/web/common/formikFields/colorField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldProps } from 'formik'
import * as React from 'react'
import { RGBColor } from 'react-color'
import { DefaultColorSchemeValues } from './valuesInterfaces'

const ColorWrapper = styled.strong`
  display: flex;
  padding: 10px 0;
  border-top: 1px solid ${props => props.theme.colors.BORDER};
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
`

const Note = styled.p`
  font-size: 13px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  strong {
    color: ${props => props.theme.colors.GREEN}
  }
`

const ColorContent: React.FunctionComponent<FieldProps<RGBColor>> = props => {
  return (
    <>
      <Note>
        <strong>Note!</strong> Set your default property site & flyer color. Change made here will override Broker level setting.
      </Note>
      <ColorWrapper>
        <ColorField labelLast label='Click here to choose your default color' field={props.field} form={props.form} />
      </ColorWrapper>
    </>
  )
}

const DefaultColorScheme: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='Default Color Scheme' id='defaultColorScheme'>
      <Field
        name={`${nameof<DefaultColorSchemeValues>('defaultColorScheme')}`}
        component={ColorContent}
      />
    </Panel>
  )
}

export default DefaultColorScheme
