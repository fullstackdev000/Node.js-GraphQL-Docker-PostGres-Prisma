import { nameof } from '#veewme/lib/util'
import ColorField, { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import InputField from '#veewme/web/common/formikFields/inputField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import CheckboxField from '../../../common/formikFields/checkboxField'
import { FormValues } from './form'

const StyledContent = styled.div `
  display: flex;
  flex-direction: column;
`

export const InlineFields = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 5px;
  & > * {
    width: 50%;
    min-width: 200px;
  }
`

const StyledBanner = styled.div<{ values: FormValues }> `
  display: flex;
  align-items: center;
  min-height: 35px;
  border-radius: 5px;
  margin: 16px 0;
  padding: 8px;
  background-color: ${props => rgbaToString(props.values.color)};
  color: ${props => props.values.blackText ? 'black' : 'white'};
  user-select: none;
`

interface DetailsProps {
  values: FormValues
}

const BannerDetails: React.FunctionComponent<DetailsProps> = props => (
  <Panel heading='Details' id='details' toggleable>
    <StyledContent>
      <Field
        name={nameof<FormValues>('label')}
        label='Banner text: '
        component={InputField}
      />
      <StyledBanner
        values={props.values}
      >
        <p>{props.values.label}</p>
      </StyledBanner>
      <InlineFields>
        <Field
          name={nameof<FormValues>('color')}
          component={ColorField}
          label='Banner color:'
        />
        <Field
          name={nameof<FormValues>('blackText')}
          component={CheckboxField}
          label={'Black text'}
        />
      </InlineFields>
    </StyledContent>
  </Panel>
)

export default BannerDetails
