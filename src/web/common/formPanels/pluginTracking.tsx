import { nameof } from '#veewme/lib/util'
import Textarea from '#veewme/web/common/formikFields/textareaField'
import Panel from '#veewme/web/common/panel'
import styled, { css } from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FacebookSquare, Google } from 'styled-icons/boxicons-logos'
import { PluginsTracking, PluginsTrackingValues } from './valuesInterfaces'

export const LabelIconStyle = css`
  width: 25px;
  margin-right: 5px;
`

export const StyledGoogle = styled(Google)`
  ${LabelIconStyle};
  fill: ${props => props.theme.colors.GOOGLE};
`

export const StyledFacebook = styled(FacebookSquare)`
  ${LabelIconStyle};
  fill: ${props => props.theme.colors.FACEBOOK};
`

const PluginPanel = styled(Panel)`
  & > div:last-child {
    padding-top: 0;
  }
  textarea {
    min-height: 75px;
    height: 75px;
  }
`

const TrackingPanel = styled(Panel)`
  border: none;
  &:last-child {
    border-top: 1px solid ${props => props.theme.colors.BORDER};
  }
  & > div {padding-bottom: 0;}
  & > div, & > header {
    padding-left: 0;
    padding-right: 0;
  }
`

interface PluginTrackingState {
  showHeadingText: boolean
}

class PluginTracking extends React.PureComponent<{}, PluginTrackingState> {
  state = { showHeadingText: false }

  render () {
    const panelHeading = this.state.showHeadingText ? 'Plugin / Tracking' : undefined
    return (
      <PluginPanel
        heading={panelHeading}
        onExpand={() => this.setState({ showHeadingText: false })}
        onCollapse={() => this.setState({ showHeadingText: true })}
        id='pluginTracking'
        toggleable
      >
        <TrackingPanel heading='Plugin'>
          <Field
            label='Plugin Embeded Code:'
            name={`${nameof<PluginsTrackingValues>('pluginsTracking')}.${nameof<PluginsTracking>('plugin')}`}
            component={Textarea}
          />
        </TrackingPanel>
        <TrackingPanel heading='Tracking'>
          <Field
            label={<><StyledGoogle />Google Tracking Embeded Code:</>}
            name={`${nameof<PluginsTrackingValues>('pluginsTracking')}.${nameof<PluginsTracking>('googleTracking')}`}
            component={Textarea}
          />
          <Field
            label={<><StyledFacebook /> Facebook Tracking Embeded Code:</>}
            name={`${nameof<PluginsTrackingValues>('pluginsTracking')}.${nameof<PluginsTracking>('facebookTracking')}`}
            component={Textarea}
          />
        </TrackingPanel>
      </PluginPanel>
    )
  }
}

export default PluginTracking
