import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import SelectField, { StyledSelectWrapper } from '#veewme/web/common/formikFields/selectField'
import HideForRole from '#veewme/web/common/hideForRole'
import * as log from '#veewme/web/common/log'
import { NoteModal } from '#veewme/web/common/ui-helpers'
import { Field } from 'formik'
import * as React from 'react'
import Panel from '../../../../common/panel'
import styled from '../../../../common/styled-components'
import { FormValues } from '../orderForm'
import { ConvertedAgent, RealEstateFormData } from '../types'

import Excl from '#veewme/web/assets/svg/excl.svg'

const StyledHeader = styled.header`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  & span {
    color: ${props => props.theme.colors.ALERT};
  }
`

const AgentPanelHeader: React.FunctionComponent<{}> = () => (
  <StyledHeader>
    <p>Agent <span>*</span></p>
    <p>Co-listing Agent</p>
  </StyledHeader>
)

const StyledInputsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  input {width: 100%;}

  ${StyledSelectWrapper} {
    > div {
      margin-bottom: 5px;

      & + span {
        bottom: -12px;
      }
    }
  }
`

const NotePlaceholder = styled.div<{
  visible: boolean
}>`
  display: flex;
  margin-top: 15px;
  height: 30px;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};

  && {
    button,
    button:hover,
    button:focus {
      background-color: ${props => props.theme.colors.ORANGE};
      border-color: ${props => props.theme.colors.ORANGE};
    }

    &:hover {
      opacity: 0.7;
    }
  }

  svg {
    width: 34px;
    height: 34px;
    fill: ${props => props.theme.colors.ORANGE};
  }
`

interface AgentNoteProps {
  selectedAgent?: ConvertedAgent
}

const AgentNote: React.FC<AgentNoteProps> = ({
  selectedAgent
}) => {
  const [noteModalVisible, toggleNoteModal] = React.useState(false)
  const noteButtonVisible = !!(selectedAgent && selectedAgent.showInternalNoteUponOrder && selectedAgent.internalNote)

  return (
    <>
      <HideForRole action='show' roles={['AFFILIATE']}>
        <NotePlaceholder visible={noteButtonVisible}>
            <Excl />
            <Button
              full
              disabled={!noteButtonVisible}
              buttonTheme='action'
              label='Click here to read Agent Note'
              size='small'
              onClick={() => toggleNoteModal(true)}
            />
        </NotePlaceholder>
      </HideForRole>
      <NoteModal
        background='LIGHT'
        title='Internal Note'
        centerVertically
        isOpen={noteModalVisible}
        toggleModal={toggleNoteModal}
        note={selectedAgent && selectedAgent.internalNote || ''}
      />
    </>
  )
}

interface AgentPanelProps {
  agents: ConvertedAgent[]
  isAgent?: boolean
  primaryAgentId?: ConvertedAgent['id']
}

const AgentPanel: React.FunctionComponent<AgentPanelProps> = props => {
  const agentOptions = React.useMemo(() => props.agents.map(agent => ({
    label: agent.firstName + ' ' + agent.lastName,
    value: agent.id
  })), [props.agents])

  const coAgentOptions = React.useMemo(() => agentOptions.filter(a => a.value !== props.primaryAgentId), [agentOptions, props.primaryAgentId])

  const selectedAgent = React.useMemo(() => {
    return props.agents.find(agent => agent.id === props.primaryAgentId)
  }, [props.agents, props.primaryAgentId])

  log.debug(selectedAgent)

  return (
    <Panel heading='' headingPlacedComponent={<AgentPanelHeader />}>
      <StyledInputsWrapper>
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('agentPrimaryId')}`}
          component={SelectField}
          placeholder='Agent...'
          options={agentOptions}
          isDisabled={props.isAgent}
          compactMode={false}
          required
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('agentCoListingId')}`}
          component={SelectField}
          placeholder='Co-listing Agent...'
          options={coAgentOptions}
        />
      </StyledInputsWrapper>
      <AgentNote
        selectedAgent={selectedAgent}
      />
    </Panel>
  )
}

export default AgentPanel
