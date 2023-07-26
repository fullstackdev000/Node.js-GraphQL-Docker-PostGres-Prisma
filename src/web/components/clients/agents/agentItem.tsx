import { AgentsPaginatedQuery as AgentsQuery } from '#veewme/gen/graphqlTypes'
import { privateUrls, publicUrls } from '#veewme/lib/urls'
import DeleteConfirmation from '#veewme/web/common/deleteConfirmation'
import Tooltipped from '#veewme/web/common/tooltipped'
import { BooleanIcon, NoteModal, PhoneLink } from '#veewme/web/common/ui-helpers'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Globe } from 'styled-icons/boxicons-regular/Globe'
import { Home } from 'styled-icons/boxicons-regular/Home'
import { AddCircle } from 'styled-icons/material/AddCircle'
import { ImportantDevices } from 'styled-icons/material/ImportantDevices'
import { SpeakerNotes } from 'styled-icons/material/SpeakerNotes'
import MailSvg from '../../../assets/svg/mail.svg'
import Avatar from '../../../assets/svg/male-user.svg'
import Button from '../../../common/buttons/basicButton'
import DropDownButton from '../../../common/buttons/dropDownButton'
import IconButton from '../../../common/buttons/iconButton'
import styled from '../../../common/styled-components'
import { Cell, CellContentWrapper, Row } from '../tableItems'

const AgentCell = styled(props => <Cell {...props} />)`
  & > ${CellContentWrapper} {
    flex-wrap: nowrap;
    & > * {
      margin-bottom: 5px;
      margin-top: 5px;
    }
  }
`

const LastOrderDateCell = styled(props => <Cell {...props} />)`
  border-right-style: solid;
`

const NewOrderCell = styled(props => <Cell {...props} />)`
  border-right-style: none;
`

const MoreCell = styled(props => <Cell {...props} />)`
  & > ${CellContentWrapper} > * {
    justify-content: flex-end;
    flex-wrap: nowrap;
  }
`

export const AvatarContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.BORDER};
  margin-right: 10px;
  flex-shrink: 0;
  & > * {
    object-fit: cover;
    width: 100%;
    height: 100%;
    fill: ${props => props.theme.colors.BUTTON_ICON};
  }
`

const AgentData = styled.div``

const AgentName = styled(Link)`
  margin-bottom: 5px;
  display: block;
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

const AgentButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  & > * {
    margin-right: 10px;
  }
`

const GreenButton = styled(props => <IconButton {...props} />)`
  & svg {
    fill: ${props => props.theme.colors.GREEN}
  }
`

const GreenLink = styled(({ to, ...props }) => <a href={to}><IconButton {...props} /></a>)`
  & svg {
    fill: ${props => props.theme.colors.GREEN}
  }
`

const InternalNoteButton = styled(props => <IconButton {...props} />)`
  & svg {
    fill: ${props => props.theme.colors.ORANGE}
  }
`

const DataParagraph = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`
const DataLabel = styled.div`
  color: ${props => props.theme.colors.TEXT};
  &::after {
    content: "\u2002";
  }
`
const DataContent = styled.div``

const AddOrderWrapper = styled.div`
  position: relative;
`
const OrderHome = styled(Home)``
const AddIcon = styled(AddCircle)`
  position: absolute;
  width: 60%;
  bottom: -20%;
  right: -20%;
`

const AddOrder: React.FunctionComponent = () => (
  <AddOrderWrapper>
    <OrderHome/>
    <AddIcon/>
  </AddOrderWrapper>
)

const DropdownStyled = styled(DropDownButton)`
  width: 100%;
  button {
    width: 100%;
    padding: 0 15px;
    background-color: transparent;
    border: none;
  }
`

const BooleanIconWrapper = styled.div`
  width: 100%;
`

export interface AgentItemProps {
  agent: AgentsQuery['agentsConnection']['agents'][0]
  onDelete: () => void
  toggleStatus: () => void
}

const AgentItem: React.FunctionComponent<AgentItemProps> = props => {
  const [isOpen, toggleModal] = React.useState<boolean>(false)
  const websiteUrl = props.agent.website || ''
  const prefixedWebsiteLink = websiteUrl.indexOf('http://') > -1 ? websiteUrl : `http://${props.agent.website}`
  return (
    <>
      <Row suspended={props.agent.status === 'SUSPENDED'}>
        <AgentCell>
          <AvatarContainer>{props.agent.profilePicture ? <img src={props.agent.profilePicture.path} /> : <Avatar/>}</AvatarContainer>
          <AgentData>
            <AgentName to={`${privateUrls.agent}/${props.agent.id}`}>{props.agent.user.firstName} {props.agent.user.lastName}</AgentName>
            <AgentButtonsWrapper>
              <GreenLink to={`mailto:${props.agent.user.email}`} size='small' Icon={MailSvg} />
              {props.agent.website && <IconButton castAs='a' href={prefixedWebsiteLink} target='_blank' size='small' Icon={Globe} />}
              {props.agent.internalNote &&
                <InternalNoteButton
                  onClick={() => toggleModal(prev => !prev)}
                  size='small'
                  Icon={SpeakerNotes}
                />
              }
            </AgentButtonsWrapper>
          </AgentData>
        </AgentCell>
        <Cell>
          {props.agent.brokerage ? (
            <>
              <DataParagraph>
                <DataContent>{props.agent.brokerage.companyName}</DataContent>
              </DataParagraph>
              <DataParagraph>
                <DataContent>
                  {props.agent.brokerage.city}, {props.agent.brokerage.state}, {props.agent.brokerage.zip}
                </DataContent>
              </DataParagraph>
            </>
          ) : <>-</>}
        </Cell>
        <Cell>
          <DataParagraph>
            <DataLabel>Office: </DataLabel>
            <DataContent><PhoneLink value={props.agent.phone} /></DataContent>
          </DataParagraph>
          { props.agent.phoneMobile &&
            <DataParagraph>
              <DataLabel>Mobile: </DataLabel>
              <DataContent><PhoneLink value={props.agent.phoneMobile} /></DataContent>
            </DataParagraph>
          }
        </Cell>
        <Cell>
          <BooleanIconWrapper>
            <BooleanIcon value={!!props.agent.specialPricing} />
          </BooleanIconWrapper>
        </Cell>
        <Cell>
          <BooleanIconWrapper>
            <BooleanIcon value={!!props.agent.companyPay} />
          </BooleanIconWrapper>
        </Cell>
        <Cell>{props.agent.region ? props.agent.region.label : '-'}</Cell>
        <LastOrderDateCell>
          -
        </LastOrderDateCell>
        <NewOrderCell>
          <Tooltipped
            tooltip='New Order'
          >
            <GreenButton castAs='link' to={`${privateUrls.addOrder}?agentId=${props.agent.id}`} size='big' Icon={AddOrder} />
          </Tooltipped>
        </NewOrderCell>
        <Cell>
          <Tooltipped
            tooltip='Media Gallery'
          >
            <IconButton castAs='link' to={`${publicUrls.toursGalleryRoot}/agent/${props.agent.id}`} size='big' Icon={ImportantDevices} />
          </Tooltipped>
        </Cell>
        <Cell>
          <Button to={`${privateUrls.orders}/?agentId=${props.agent.id}`} label='Orders' size='small' />
        </Cell>
        <MoreCell>
          <DropdownStyled
            list={[{
              items: [{
                label: 'Edit',
                linkTo: `${privateUrls.agent}/${props.agent.id}`
              }, {
                label: 'Settings',
                linkTo: `${privateUrls.accountSettings}/agent/${props.agent.id}`
              }, {
                label: props.agent.status === 'ACTIVE' ? 'Suspend' : 'Unsuspend',
                onClick: props.toggleStatus
              }, {
                label: 'Delete',
                onClick: props.onDelete
              }]
            }]}
          />
        </MoreCell>
      </Row>
      <NoteModal
        title='Agent Note'
        isOpen={isOpen}
        toggleModal={() => toggleModal(prev => !prev)}
        centerVertically={true}
        colorTheme='PAYMENT'
        background='LIGHT'
        showBorderRadius={false}
        note={props.agent.internalNote || ''}
      />
    </>
  )
}

type AgentItemWithDeleteWarningProps = Omit<AgentItemProps, 'onDelete'> & {
  onDelete: (id: number) => void
}
const AgentItemWithDeleteWarning: React.FunctionComponent<AgentItemWithDeleteWarningProps> = props => {
  return (
    <DeleteConfirmation
      onConfirm={() => props.onDelete(props.agent.id)}
      message='Are you sure you want to delete this client?'
    >
      {toggleDeleteConfirmation => (<AgentItem {...props} onDelete={toggleDeleteConfirmation} />)}
    </DeleteConfirmation>
  )
}

export default AgentItemWithDeleteWarning
