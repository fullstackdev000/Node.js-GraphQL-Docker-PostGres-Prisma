import { nameof } from '#veewme/lib/util'
import TextField from '#veewme/web/common/formikFields/textareaField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { Profile } from '../common/types'

const StyledPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const HintText = `Internal note is a note about your client only accessible to Affiliate
from the Orders page as a Note Pin. It is often used to remind
you or customer service of relevant information upon ordering.
`

const InternalNote: React.FunctionComponent<{}> = () => {
  return (
    <StyledPanel
      heading='Internal Note'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text={HintText}
        />
      }
    >
      <Field component={TextField} name={nameof<Profile>('internalNote')} />
    </StyledPanel>
  )
}

export default InternalNote
