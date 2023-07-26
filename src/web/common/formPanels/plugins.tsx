import { nameof } from '#veewme/lib/util'
import Zendesk from '#veewme/web/assets/svg/zendesk.svg'
import Textarea from '#veewme/web/common/formikFields/textareaField'
import { LabelIconStyle, StyledFacebook, StyledGoogle } from '#veewme/web/common/formPanels/pluginTracking'
import { StyledNote, StyledNoteHighlight } from '#veewme/web/common/formPanels/styles'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { Messenger } from 'styled-icons/boxicons-logos'
import { PluginsValues } from '../../components/affiliates/editAffiliate/types'

const note1 = 'Visit the above platform sites to apply for an account. If you already have one then enter the provided embed code in the box to the above.'
const note2 = "Please note that the code you enter will run on your clients' every encrypted session in Ogle Media according to our Privacy Policy."
const note3 = 'We do not take responsibility for any malicious 3rd party software embedded intentionally into the platform.'
const note4 = 'If your are not sure whether you can safely use the code as intended, please contact us and we will be happy to help!'

const StyledMessenger = styled(Messenger)`
  ${LabelIconStyle};
  fill: ${props => props.theme.colors.MESSENGER};
`

const StyledZendesk = styled(Zendesk)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  fill: ${props => props.theme.colors.MESSENGER};
`

const PluginsPanel = styled(Panel)`
  & > div > div {
    border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  }
  & > div:last-child {
    padding-top: 0;
    padding-bottom: 0;
    border: none
  }
  textarea {
    min-height: 75px;
    max-height: 55px;
  }
`

const InnerPanel = styled(Panel)`
  border: none;
  padding-bottom: 16px;
  & > div {padding-bottom: 0;}
  & > div, & > header {
    padding-left: 0;
    padding-right: 0;
  }
`

interface PluginsState {
  showHeadingText: boolean
}

class Plugins extends React.PureComponent<{}, PluginsState> {
  state = { showHeadingText: false }

  render () {
    const panelHeading = this.state.showHeadingText ? 'Plugin / Chat Integration / Tracking' : ''
    return (
      <PluginsPanel
        heading={panelHeading}
        onExpand={() => this.setState({ showHeadingText: false })}
        onCollapse={() => this.setState({ showHeadingText: true })}
        id='plugin'
        toggleable
      >
        <InnerPanel heading='Plugins'>
          <Field
            label='Plugins Embeded Code:'
            name={nameof<PluginsValues>('plugin')}
            placeholder='Type here...'
            component={Textarea}
          />
        </InnerPanel>
        <InnerPanel heading='Chat Integration'>
          <Field
            label={<><StyledZendesk />Zendesk Chat Embeded Code:</>}
            name={nameof<PluginsValues>('zendeskIntegration')}
            placeholder='Type here...'
            component={Textarea}
          />
          <Field
            label={<><StyledMessenger /> Facebook Messenger Chat Embeded Code:</>}
            name={nameof<PluginsValues>('messengerIntegration')}
            placeholder='Type here...'
            component={Textarea}
          />
          <StyledNote>
            {note1}
          </StyledNote>
          <StyledNote>
            <StyledNoteHighlight>Note! </StyledNoteHighlight>
            {note2}{note3}{note4}
          </StyledNote>
        </InnerPanel>
        <InnerPanel heading='Tracking'>
          <Field
            label={<><StyledGoogle />Google Tracking Embeded Code:</>}
            name={nameof<PluginsValues>('googleTracking')}
            placeholder='Type here...'
            component={Textarea}
          />
          <Field
            label={<><StyledFacebook /> Facebook Tracking Embeded Code:</>}
            name={nameof<PluginsValues>('facebookTracking')}
            placeholder='Type here...'
            component={Textarea}
          />
        </InnerPanel>
      </PluginsPanel>
    )
  }
}

export default Plugins
