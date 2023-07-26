import {
  OrderDetailsQuery
} from '#veewme/gen/graphqlTypes'
import { privateUrls } from '#veewme/lib/urls'
import Avatar from '#veewme/web/assets/svg/male-user.svg'
import IconButton from '#veewme/web/common/buttons/iconButton'
import DeleteConfirmation from '#veewme/web/common/deleteConfirmation'
import { Checkbox } from '#veewme/web/common/formikFields/checkboxField'
import { StyledInput } from '#veewme/web/common/formikFields/inputField'
import { Switch } from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { BooleanIcon } from '#veewme/web/common/ui-helpers'
import * as React from 'react'
import { NavLink } from 'react-router-dom'

import * as log from '#veewme/web/common/log'

import { Close } from 'styled-icons/material'

const AgentBox = styled.div`
  display: flex;

  a {
    font-weight: 500;
    font-size: 16px;
    color: ${props => props.theme.colors.GREEN};

    &:hover {
      text-decoration: underline;
    }
  }

  & > div {
    min-width: 100px;
    flex: 1 0 auto;
  }

`

const AgentLabel = styled.span`
  display: flex;;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-weight: 500;
  font-size: 14px;
`

export const AvatarContainer = styled.div`
  width: 60px;
  height: 60px;
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

const AgentDataWrapper = styled.div`
  display: flex;
`

const AgentDetails = styled.div`
  padding: 5px;
`

const BrokerName = styled.div`
  font-size: 13px;
  font-weight: 500;
`

const CompanyPayBox = styled.span`
  margin-left: 10px;
`

const ListStyled = styled.ul`

`

const ItemBase = styled.li`
  display: grid;
  grid-template-columns: 60px minmax(100px, 1fr) 100px 80px 100px 55px;
  row-gap: 10px;
  column-gap: 0;
  margin-top: 10px;
  border-radius: 5px;
`

const Item = styled(ItemBase)`
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.07);
`

const Cell = styled.div`
  position: relative;
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.GREY};
  font-weight: 500;
  color: ${props => props.theme.colors.FIELD_TEXT};
  line-height: 28px;

  &:not(:last-child) {
    border-right: 0 none;
  }

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;;
  }
`

const ListHeaders = styled(ItemBase)`
  margin-top: 20px;
  font-weight: 500;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const ListHeader = styled.div`
  text-transform: capitalize;
`

const ListSection = styled.section`
  margin-top: 40px;
  margin-bottom: 30px;
  padding-top: 25px;
  border-top: 1px solid ${props => props.theme.colors.GREY};
  font-size: 14px;

  h3 {
    color: ${props => props.theme.colors.DARK_GREY};
    font-weight: 500;
    font-size: 14px;
  }
`

const CheckboxStyled = styled(Checkbox)`
  margin-bottom: 0;
  margin-top: 6px;
  padding: 0;
`

const DeleteButton = styled(props => <IconButton {...props} />)`
  position: absolute;
  right: 3px;
  top: 18px;

  svg {
    fill: ${props => props.theme.colors.ALERT};
  }

`

const PriceInput = styled(StyledInput)<{
  editable?: boolean
}>`
  width: 100%;
  height: unset;
  border: 1px solid ${props => props.theme.colors.INFO_BORDER};
  font-weight: 400;

  ${props => !props.editable && `
    border-color: transparent;
    font-weight: 500;
  `}

`

const SwitchStyled = styled(Switch)`
  margin-top: 15px;

  label {
    justify-content: flex-end;
  }
`

const SubItems = styled.ul`
  font-size: 13px;

  li {
    position: relative;
    padding-left: 15px;

    &:before {
      content: '';
      position: absolute;
      left: 2px;
      top: 11px;;
      display: block;
      width: 5px;
      height: 5px;
      border-radius: 100%;
      background-color: #000;
    }
  }
`

interface SubItem {
  id: number
  name: string
}

interface ItemData {
  id: number
  name: string
  type: string
  price: number
  pricePaid?: number
  done: boolean
  includedSubitems?: SubItem[]
}

interface UpdateData {
  done?: boolean
  pricePaid?: number
}

interface ListItemProps {
  data: ItemData
  editable?: boolean
  onDelete: () => void
  onUpdate: (delta: UpdateData) => void
}

const SubitemsList: React.FC<{
  data: SubItem[]

}> = props => {

  if (!props.data.length) {
    return null
  }

  return (
    <SubItems>
      {
        props.data.map(subitem => (
          <li key={subitem.id}>{subitem.name}</li>
        ))
      }
    </SubItems>
  )
}

const ListItem: React.FC<ListItemProps> = ({
  data,
  editable = false,
  onDelete,
  onUpdate
}) => {
  const isMounted = React.useRef(false)
  const [done, setDone] = React.useState(data.done)
  const [pricePaid, setPricePaid] = React.useState<string>(String(data.pricePaid || ''))

  React.useEffect(() => {
    if (isMounted.current) {
      onUpdate({
        done,
        pricePaid: Number(pricePaid)
      })
    } else {
      isMounted.current = true
    }
  }, [done, pricePaid])

  return (
    <DeleteConfirmation
      onConfirm={() => log.debug('Delete service')}
      message='Are you sure you want to delete this service from order?'
    >
      {toggleDeleteConfirmation => (
        <Item>
          <Cell>{data.id}</Cell>
          <Cell>{data.name}
            {
              editable && (
                <DeleteButton
                  castAs='button'
                  onClick={onDelete}
                  Icon={Close}
                />
              )
            }
            <SubitemsList data={data.includedSubitems || []} />
          </Cell>
          <Cell>{data.type}</Cell>
          <Cell>{data.price}</Cell>
          <Cell>
            <PriceInput
              editable={editable}
              disabled={!editable}
              value={pricePaid}
              onChange={e => {
                const value = e.target.value
                setPricePaid(value)
              }}
            />
          </Cell>
          <Cell>
            <CheckboxStyled
              checked={done}
              label=''
              labelFirst={false}
              onChange={e => setDone(e.target.checked)}
              disabled={!editable}
            />
          </Cell>
        </Item>
      )}
    </DeleteConfirmation>
  )
}

interface ListProps {
  data: ItemData[]
  editable?: boolean
  title: string
  onDelete: (id: number) => void
  onUpdate: (id: number, delta: UpdateData) => void
}

const List: React.FC<ListProps> = ({
  editable = false,
  data,
  onDelete,
  onUpdate,
  title
}) => {
  if (!data.length) {
    return null
  }

  return (
    <ListSection>
      <h3>{title}</h3>
      <ListHeaders as='div'>
        <ListHeader>Id</ListHeader>
        <ListHeader>Name</ListHeader>
        <ListHeader>Type</ListHeader>
        <ListHeader>Price</ListHeader>
        <ListHeader>Price paid</ListHeader>
        <ListHeader>Done</ListHeader>
      </ListHeaders>
      <ListStyled>
        {data.map(item => (
          <ListItem
            key={item.id}
            data={item}
            editable={editable}
            onDelete={() => onDelete(item.id)}
            onUpdate={delta => onUpdate(item.id, delta)}
          />
        ))}
      </ListStyled>
    </ListSection>
  )
}

interface OrderDetailsProps {
  data: OrderDetailsQuery
}

const OrderDetails: React.FunctionComponent<OrderDetailsProps> = ({
  data: { order }
}) => {

  const { realEstate: {
    agentPrimary: agent
  }} = order

  const servicesListData = React.useMemo(() => {
    if (!order) {
      return []
    }

    return order.services.filter(s => !s.includedInPackage).map(s => ({
      done: !(s.id % 2), // TODO just temp
      id: s.id,
      name: s.service.name,
      price: s.service.price,
      type: s.service.serviceType
    }))

  }, [order])

  const packagesListData = React.useMemo(() => {
    if (!order) {
      return []
    }

    return order.servicePackages.map(p => ({
      done: !(p.id % 2), // TODO just temp
      id: p.id,
      includedSubitems: p.services,
      name: p.name,
      price: p.price,
      type: 'Package'
    }))

  }, [order])

  const [editable, setEditable] = React.useState(false)

  return (
    <>
      <Panel
      >
        <AgentBox>
          <div>
            <AgentLabel>
              Agent:
            </AgentLabel>
            <AgentDataWrapper>
              <AvatarContainer>{agent.profilePicture ? <img src={agent.profilePicture.path} /> : <Avatar/>}</AvatarContainer>
              <AgentDetails>
                <NavLink to={`${privateUrls.agent}/${agent.id}`} >
                  {`${agent.user.firstName} ${agent.user.lastName}`}
                </NavLink>
                <BrokerName>{agent.brokerage.companyName}</BrokerName>
              </AgentDetails>
            </AgentDataWrapper>
          </div>
          <div>
            <AgentLabel>
              Invoice:
            </AgentLabel>
            <div>
              <NavLink to='#' >
                #123456789123
              </NavLink>
            </div>
          </div>
          <div>
            <AgentLabel>
              CompanyPay:
              <CompanyPayBox>
                <BooleanIcon value={agent.companyPay} />
              </CompanyPayBox>
            </AgentLabel>
          </div>
        </AgentBox>
        <SwitchStyled
          value={editable}
          name='editable'
          label='Make order adjustments'
          onChange={e => {
            setEditable(e.target.checked)
          }}
        />
        <List
          data={servicesListData}
          editable={editable}
          title='Services'
          onDelete={id => log.debug('Delete service', id)}
          onUpdate={(id, delta) => log.debug('Update service', id, delta)}
        />
        <List
          data={packagesListData}
          editable={editable}
          title='Packages'
          onDelete={id => log.debug('Delete package', id)}
          onUpdate={(id, delta) => log.debug('Update package', id, delta)}
        />
      </Panel>
    </>
  )
}

export default OrderDetails
