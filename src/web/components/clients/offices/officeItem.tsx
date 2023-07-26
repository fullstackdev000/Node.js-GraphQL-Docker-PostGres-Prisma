import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Phone } from 'styled-icons/material/Phone'
import CheckMarkSvg from '../../../assets/svg/checkmark.svg'
import MailSvg from '../../../assets/svg/mail.svg'
import X from '../../../assets/svg/x.svg'
import Button from '../../../common/buttons/basicButton'
import DropDownButton from '../../../common/buttons/dropDownButton'
import IconButton from '../../../common/buttons/iconButton'
import styled from '../../../common/styled-components'
import { Cell, CellContentWrapper, Row } from '../tableItems'

const AgentsCell = styled(props => <Cell {...props} />)`
  & > ${CellContentWrapper} {
    justify-content: center;
  }
`
const AdminCell = styled(props => <Cell {...props} />)`
  & > ${CellContentWrapper} {
    justify-content: space-between;
  }
`

const EditBrokerage = styled(Link)`
${props => props.theme.colors.FIELD_TEXT};
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

const AdminName = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  & > div::after {
    content: "\u2002";
  }
`

const GreenButton = styled(props => <IconButton {...props} />)`
  & svg {
    fill: ${props => props.theme.colors.GREEN}
  }
`

const AdminPhone = styled.div`
  margin: 5px 0;
  display: flex;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const PhoneIcon = styled.div`
  margin-right: 5px;
  & > svg {
    fill: ${props => props.theme.colors.TEXT};
    height: 13px;
  }
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

const actionOptions = [{
  items: [{
    label: 'Edit',
    onClick: () => log.debug(`Edit clicked`)
  }, {
    label: 'Suspend',
    onClick: () => log.debug(`Suspend clicked`)
  }, {
    label: 'Delete',
    onClick: () => log.debug(`Delete clicked`)
  }]
}]

export interface OfficeItemProps {
  adminEmail: string
  adminName: string
  adminPhone: string
  agentsList: string
  agentsNumber: number
  brokerageName: string
  city: string
  companyPay?: boolean
  editOffice: string
  region: string
  stateCode: string
  street: string
  zipCode: string
}

const OfficeItem: React.FunctionComponent<OfficeItemProps> = props => (
  <Row>
    <Cell><EditBrokerage to={props.editOffice}>{props.brokerageName}</EditBrokerage></Cell>
    <Cell>
      {props.street}, {props.city}, {props.stateCode}, {props.zipCode}
    </Cell>
    <Cell>{props.region}</Cell>
    <Cell>
      {props.companyPay ? <CheckIcon/> : <Xicon/>}
    </Cell>
    <AgentsCell>{props.agentsNumber}</AgentsCell>
    <AdminCell>
      <AdminName>
        <div>{props.adminName}</div>
        <GreenButton to={`mailto:${props.adminEmail}`} size='small' Icon={MailSvg} />
      </AdminName>
      <AdminPhone>
        <PhoneIcon><Phone /></PhoneIcon>
        <div>{props.adminPhone}</div>
      </AdminPhone>
    </AdminCell>
    <Cell>
      <Button to={props.agentsList} label='Agents' size='small' />
    </Cell>
    <Cell>
      <DropdownStyled list={actionOptions} />
    </Cell>
  </Row>
)

export default OfficeItem
