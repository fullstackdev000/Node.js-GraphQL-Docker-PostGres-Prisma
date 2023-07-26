import { nameof } from '#veewme/lib/util'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import TextareaField from '#veewme/web/common/formikFields/textareaField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { AgentValues } from './valuesInterfaces'

const StyledPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const InternalNote: React.FunctionComponent<{}> = () => {
  return (
    <StyledPanel
      heading='Internal Note'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text={
            'Internal note is a note about your client only accessible to Affiliate\n'
            + 'from the Orders page as a Note Pin. It is often used to remind\n'
            + 'you or customer service of relevant information upon ordering.'
          }
        />
      }
    >
        <Field
          name={nameof<AgentValues>('showInternalNoteUponOrder')}
          component={CheckboxField}
          label='Show upon order'
        />
      <Field
        label=''
        component={TextareaField}
        name={nameof<AgentValues>('internalNote')}
      />
    </StyledPanel>
  )
}

export default InternalNote
