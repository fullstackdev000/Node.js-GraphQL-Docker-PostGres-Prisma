import { nameof } from '#veewme/lib/util'
import Checkbox from '#veewme/web/common/formikFields/checkboxField'
import Textarea from '#veewme/web/common/formikFields/textareaField'
import { StyledNote, StyledNoteHighlight } from '#veewme/web/common/formPanels/styles'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { WhiteLabelValues } from '../../components/affiliates/editAffiliate/types'

// TODO add proper help text
const customDomainHelp = 'Integer sed placerat tortor. /nAliquam aliquet tincidunt nisl a feugiat.'

const note1 = 'Follow the setup information and configure your domain correctly first.'
const note2 = 'How to configure a custom domain for white label.'
const note3 = "You will need to configure the domain in your Domain Provide's configuration panel:"
const note4 = 'When that is done, type your chosen domain above and click the "Enable" button. If your domain was set up properly, then it should activate without a problem. It can take some time for the record to propagate.'

const mainSteps = [
  'Go to configuration for the domain you want to link (Zone file).',
  'Click the "Add record" button.',
  'Configure the record:',
  'Complete the configuration by clicking "Save".',
  'Click "Save changes".'
]

const step3Steps = [
  'Set the "type" field value to "CNAME (alias)".',
  'Set the "host" field value to a domain/subdomain of your choosing.',
  'Set the "Points to" field value to "veewme.com".',
  'Leave other fields, including the "TTL" field, the same.'
]

const StyledPanel = styled(Panel)`
  & > div:last-child {
    padding-top: 0;
  }
  textarea {
    min-height: 75px;
    max-height: 55px;
  }
`

const InnerPanel = styled.div`
  padding: 16px 0;
`

const StyledLabelHelp = styled(InlineHelp) `
  margin-left: 16px;
`

const StyledMainSteps = styled.ol `
  margin-left: 8px;
  padding: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const StyledStep3Steps = styled.ul `
  margin-left: 8px;
  padding: 8px;
  list-style-type: disc;
  color: ${props => props.theme.colors.GREEN};
`

const WhiteLabel: React.FunctionComponent<{}> = () => (
  <StyledPanel
    heading='White Label'
    id='whiteLabel'
    toggleable
  >
    <InnerPanel>
      <Field
        label={
          <>
            Custom domain:
            <StyledLabelHelp
              text={customDomainHelp}
            />
          </>
        }
        name={`${nameof<WhiteLabelValues>('customDomain')}`}
        placeholder='Type here...'
        component={Textarea}
      />
      <StyledNote>
        <StyledNoteHighlight>Note! </StyledNoteHighlight>
        {note1}
      </StyledNote>
    </InnerPanel>
    <InnerPanel>
      <Field
        label='Enable white label'
        name={`${nameof<WhiteLabelValues>('enabled')}`}
        component={Checkbox}
      />
    </InnerPanel>
    <InnerPanel>
      <StyledNote>
        {note2}
      </StyledNote>
      <StyledNote>
        {note3}
      </StyledNote>
      <StyledMainSteps>
        <li><StyledNote>{mainSteps[0]}</StyledNote></li>
        <li><StyledNote>{mainSteps[1]}</StyledNote></li>
        <li>
          <StyledNote>{mainSteps[2]}</StyledNote>
          <StyledStep3Steps>
            {step3Steps.map((step, idx) => (
              <li key={idx}>
                <StyledNote>{step}</StyledNote>
              </li>
            ))}
          </StyledStep3Steps>
        </li>
        <li><StyledNote>{mainSteps[3]}</StyledNote></li>
        <li><StyledNote>{mainSteps[4]}</StyledNote></li>
      </StyledMainSteps>
      <StyledNote>
        {note4}
      </StyledNote>
    </InnerPanel>
  </StyledPanel>
)

export default WhiteLabel
