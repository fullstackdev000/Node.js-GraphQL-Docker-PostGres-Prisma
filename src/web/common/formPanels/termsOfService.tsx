import { nameof } from '#veewme/lib/util'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { TermsOfService } from './valuesInterfaces'

const StyledPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const TermsOfService: React.FunctionComponent<{}> = () => {
  return (
    <StyledPanel
      heading='Terms of Service'
      id='terms'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text={
            'Disclose your Terms of Service upon checkout'
          }
        />
      }
    >
      <Field label='' component={Editor} name={nameof<TermsOfService>('termsOfService')} />
    </StyledPanel>
  )
}

export default TermsOfService
