import { Role } from '#veewme/gen/graphqlTypes'
import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { AgentValues, User, UserValues } from './valuesInterfaces'

const FieldSpanAll = styled(Field)``

const AccountGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px;
  column-gap: 30px;
  & > * {
    grid-column: 1
    & > * {width: 100%}
  }
  & > *:nth-child(7) {
    grid-column: 2;
    grid-row-start: 1;
    grid-row-end: 6;
    margin-top: 35px;
  }
  & > *:last-child, & > *:nth-last-child(2) {grid-column: 1/-1}
`

const BioLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  & > *:last-child {
    margin-left: 10px;
  }
`

const bioTooltip = `A link (url) to agent bio-video. If entered
it will display on your property site headshot
as a video play icon. We recommend you use
a direct link to a video vs. a web page showing video.
`

interface AccountInformationProps {
  role: Role
}

class AccountInformation extends React.PureComponent<AccountInformationProps> {
  render () {
    return (
      <Panel
        heading='Account Information'
        id='account'
        toggleable
      >
        <AccountGrid>
          <Field component={InputField} name={`${nameof<UserValues>('user')}.${nameof<User>('firstName')}`} label='First Name' />
          <Field label='Last Name:' component={InputField} name={`${nameof<UserValues>('user')}.${nameof<User>('lastName')}`}/>
          <Field label='Title:' component={InputField} name={nameof<AgentValues>('title')}/>
          <Field label='Agent ID:' component={InputField} name={nameof<AgentValues>('agentMLSid')}/>
          <Field label='Designations:' component={InputField} name={nameof<AgentValues>('designations')}/>
          <Field label='Others (CalBRE, etc.):' component={InputField} name={nameof<AgentValues>('others')}/>
          <Field
            component={UploadImageField}
            name={nameof<AgentValues>('profilePicture')}
            cropShape='round'
          />
          <FieldSpanAll label='Agent Bio:' component={Editor} name={nameof<AgentValues>('bio')} />
          <FieldSpanAll
            label={
              <BioLabelWrapper>
                <span>Agent bio/profile video URL:</span>
                <InlineHelp
                  text={bioTooltip}
                />
              </BioLabelWrapper>
            }
            type='url'
            component={InputField}
            name={nameof<AgentValues>('profileUrl')}
          />
        </AccountGrid>
      </Panel>
    )
  }
}

export default AccountInformation
