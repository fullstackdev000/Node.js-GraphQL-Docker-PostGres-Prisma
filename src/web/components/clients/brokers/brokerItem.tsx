import { privateUrls, publicUrls } from '#veewme/lib/urls'
import DeleteConfirmation from '#veewme/web/common/deleteConfirmation'
import { Select } from '#veewme/web/common/formikFields/selectField'
import * as log from '#veewme/web/common/log'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { ImportantDevices } from 'styled-icons/material/ImportantDevices'
import { Settings } from 'styled-icons/octicons/Settings'
import CheckMarkSvg from '../../../assets/svg/checkmark.svg'
import X from '../../../assets/svg/x.svg'
import Button from '../../../common/buttons/basicButton'
import DropDownButton from '../../../common/buttons/dropDownButton'
import IconButton from '../../../common/buttons/iconButton'
import styled from '../../../common/styled-components'
import { Cell, CellContentWrapper, Row } from '../tableItems'
import { BrokerageData } from './brokers'

import PhotographerSvg from '../../../assets/svg/photographer.svg'
import { AvatarContainer } from '../agents/agentItem'

const ImageHolder = styled(AvatarContainer)`
  border-radius: 2px;

  svg {
    width: 60%;
    display: block;
    margin: auto;
  }

  img {
    object-fit: contain;
  }
`

const OfficesCell = styled(props => <Cell {...props} />)`
  & > ${CellContentWrapper} {
    justify-content: center;
  }
`
const AgentsCell = styled(props => <Cell {...props} />)`
  & > ${CellContentWrapper} {
    justify-content: center;
  }
`
const ActionsCell = styled(props => <Cell {...props} />)`
  & > ${CellContentWrapper} {
    flex-wrap: nowrap;
    & > *:not(:last-child) {
      margin-right: 15px;
    }
  }
`

const EditBrokerage = styled(Link)`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.FIELD_TEXT};

  &:visited {
    color: ${props => props.theme.colors.FIELD_TEXT};
  }
  &:hover {
    color: ${props => props.theme.colors.GREEN};
  }
`

const CheckIcon = styled(CheckMarkSvg)`
  width: 16px;
  fill: ${props => props.theme.colors.GREEN};
  margin: auto;
`

const Xicon = styled(X)`
  width: 13px;
  fill: ${props => props.theme.colors.BORDER};
  margin: auto;
`

const DropdownStyled = styled(DropDownButton)`
  width: 100%;
  button {
    width: 100%;
    padding: 0 15px;
    background-color: transparent;
    border: none;
  }
`

const StyledDeleteMessage = styled.div`
  max-width: 700px;
  min-height: 160px;
  display: block;
`

const StyledTextSection = styled.div`
  margin: 15px 0;
  line-height: 24px;
`

const NameHolder = styled.div`
  display: flex;
  align-items: center;
`

const BrokersSelectWrapper = styled.div`
  width: 290px;
`

interface OptionBroker {
  value: number
  label: string
}

export interface BrokerItemViewProps {
  item: BrokerageData
  onDelete: () => void
  onSuspend: () => void
  brokers: OptionBroker[]
}

const BrokerItemView: React.FunctionComponent<BrokerItemViewProps> = props => {
  const { item } = props

  const actionOptions = React.useMemo(() => {
    return [{
      items: [{
        label: 'Edit',
        linkTo: `${privateUrls.brokerages}/${item.id}`
      }, {
        label: 'Settings',
        linkTo: `${privateUrls.accountSettings}/broker/${item.id}`
      }, {
        label: item.status === 'ACTIVE' ? 'Suspend' : 'Unsuspend',
        onClick: () => props.onSuspend()
      }, {
        label: 'Delete',
        onClick: () => props.onDelete()
      }]
    }]
  }, [props])

  return (
    <Row
      suspended={item.status === 'SUSPENDED'}
    >
      <Cell>
        <NameHolder>
          <ImageHolder>{item.profilePicture ? <img src={item.profilePicture.path} /> : <PhotographerSvg width='20'/>}</ImageHolder>
          <EditBrokerage to={`${privateUrls.brokerages}/${props.item.id}`}>{item.companyName}</EditBrokerage>
        </NameHolder>
      </Cell>
      <Cell>
        {item.street}, {item.city}, {item.state}, {item.zip}
      </Cell>
      <Cell>{item.region && item.region.label}</Cell>
      <Cell>
        {item.companyPay ? <CheckIcon/> : <Xicon/>}
      </Cell>
      <Cell>
        {item.specialPricing ? <CheckIcon/> : <Xicon/>}
      </Cell>
      <OfficesCell>{item.offices.length}</OfficesCell>
      <AgentsCell>{item.agents.length}</AgentsCell>
      <ActionsCell>
        <IconButton castAs='link' to='#' size='big' Icon={Settings} />
        <Tooltipped
          tooltip='Media Gallery'
        >
          <IconButton castAs='link' to={`${publicUrls.toursGalleryRoot}/brokerage/${item.id}`} size='big' Icon={ImportantDevices} />
        </Tooltipped>
      </ActionsCell>
      <Cell>
        <Button to='#' label='Offices' size='small' />
      </Cell>
      <Cell>
        <DropdownStyled list={actionOptions} />
      </Cell>
    </Row>
  )
}

type BrokerItemWithDeleteConfirmationProps = Omit<BrokerItemViewProps, 'onDelete'> & {
  onDelete: (id?: number) => void
}

const BrokerItemWithDeleteConfirmation: React.FunctionComponent<BrokerItemWithDeleteConfirmationProps> = props => {
  const { brokers, item } = props
  const [ brokerId, setBrokerId ] = React.useState<number | undefined>()
  const optionsWithoutCurrentBroker = React.useMemo(() => brokers.filter(b => b.value !== item.id), [brokers])

  const brokerWithAgentsMsg = (
    <StyledDeleteMessage>
      <StyledTextSection>
        You cannot delete a Broker without first assigning all its clients to a new/different Broker.<br/>
        Make sure the new/different Broker is already in the system.
      </StyledTextSection>
      <BrokersSelectWrapper>
        <Select
          placeholder='Select Broker to transfer all clients to'
          options={optionsWithoutCurrentBroker}
          value={brokerId}
          maxMenuHeight={120}
          onChange={val => {
            if (val) {
              setBrokerId(val.value)
            }
          }}
        />
      </BrokersSelectWrapper>
      <StyledTextSection>
        Proceed with clients transfer to new/different Broker as well as Broker Office if tracked.
      </StyledTextSection>
    </StyledDeleteMessage>
  )
  const brokerWithoutAgentsMsg = 'Are you sure you want to delete this broker?'
  const hasAssignedAgents = props.item.agents.length > 0
  const msg = hasAssignedAgents ? brokerWithAgentsMsg : brokerWithoutAgentsMsg
  const deleteBtnLabel = hasAssignedAgents ? 'Transfer and delete' : 'Delete broker'

  return (
    <DeleteConfirmation
      disableSubmitBtn={hasAssignedAgents && !brokerId}
      submitBtnLabel={deleteBtnLabel}
      onConfirm={() => {
        if (hasAssignedAgents) {
          log.debug('Selected Broker to transfer to:', brokerId)
          props.onDelete(brokerId)
        } else {
          props.onDelete()
        }
      }}
      message={msg}
    >
      {toggleDeleteConfirmation => (
        <BrokerItemView {...props} onDelete={toggleDeleteConfirmation} />
      )}
    </DeleteConfirmation>
  )
}

export default BrokerItemWithDeleteConfirmation
