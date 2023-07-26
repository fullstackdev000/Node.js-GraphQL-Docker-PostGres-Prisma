import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from './form'

const StyledSection = styled.section `
  display: flex;
  flex-direction: column;
  align-content: stretch;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.LABEL_TEXT};
  & + section {
    padding-top:20px;
    margin-top: 20px;
    border-top: 1px solid ${props => props.theme.colors.BORDER};
  }
  input { width: 100%; }
`

interface SupportPagesProps {
  values: FormValues
}

const SupportPages: React.FunctionComponent<SupportPagesProps> = props => (
  <Panel heading='Support Pages' id='support' toggleable>
    <StyledSection>
      <Field
        name={nameof<FormValues>('supportPagesSystem')}
        component={InputField}
        label='System Support Page (visible to Affiliates)'
        compactMode
      />
    </StyledSection>
    <StyledSection>
      <Field
        name={nameof<FormValues>('supportPagesSelfServiceClient')}
        component={InputField}
        label="Self-service Clients Support Page (visible to Affiliate's clients)"
        compactMode
      />
    </StyledSection>
    <StyledSection>
      <Field
        name={nameof<FormValues>('supportPagesDefaultAffiliate')}
        component={Editor}
        label="Default Affiliate Support Page (visible to Affiliate's clients)"
        compactMode
      />
    </StyledSection>
  </Panel>
)

export default SupportPages
