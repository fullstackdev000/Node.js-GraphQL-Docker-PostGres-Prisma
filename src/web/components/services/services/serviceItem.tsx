import DeleteModal from '#veewme/web/common/deleteConfirmation'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import styled, { css } from '#veewme/web/common/styled-components'
import { useMutation } from '@apollo/react-hooks'
import { DocumentNode } from 'graphql'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { SortableHandle } from 'react-sortable-hoc'
import { SortableElement } from 'react-sortable-hoc'
import { useToasts } from 'react-toast-notifications'
import { Move, Pause } from 'styled-icons/boxicons-regular'
import { Edit } from 'styled-icons/boxicons-solid'
import { Close } from 'styled-icons/material'
import { StyledIcon } from 'styled-icons/types'
import { Card } from '../types'

const StyledServiceWrapper = styled.li `
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`

const StyledActionsContainer = styled.div `
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  & > * {
    &:hover {
      outline: 1px solid ${props => props.theme.colors.BORDER};
    }
  }
`
const buttonStyles = css`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  font-size: 12px;
  outline: none;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.LABEL_TEXT};
  cursor: pointer;
  & svg {
    fill: ${props => props.theme.colors.LABEL_TEXT};
  }
`
const StyledActionButton = styled.button `
  ${buttonStyles}
`

const StyledNavLink = styled(NavLink)`
  ${buttonStyles}
`

const StyledIcon = styled(props => <props.icon className={props.className}/>) `
  width: 16px;
  height: 16px;
  margin-right: 4px;
`

const StyledMoveIcon = styled(Move)`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  fill: ${props => props.theme.colors.LABEL_TEXT};
`

const StyledSortHandle = styled.div `
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  font-size: 12px;
  background: transparent;
  color: ${props => props.theme.colors.LABEL_TEXT};
  cursor: pointer;
`

interface ActionButtonProps {
  label: string
  icon: React.SVGFactory | StyledIcon
  onClick?: () => void
  to?: string
}

export const ActionButton: React.FunctionComponent<ActionButtonProps> = props => {
  return !props.to ? (
    <StyledActionButton onClick={props.onClick}>
      <StyledIcon icon={props.icon}/>
      {props.label && <p>{props.label}</p>}
    </StyledActionButton>
  ) : (
    <StyledNavLink to={props.to}>
      <StyledIcon icon={props.icon}/>
      {props.label && <p>{props.label}</p>}
    </StyledNavLink>
  )
}

const SortHandle = SortableHandle(() => (
  <StyledSortHandle>
    <StyledMoveIcon/>
    <p>move</p>
  </StyledSortHandle>
))

const StyledDeleteButton = styled(StyledActionButton)`
  & svg {
    fill: ${props => props.theme.colors.ALERT};
    margin-right: 0;
  }
`

const DeleteButton: React.FunctionComponent<{ onClick: () => void }> = props => (
  <StyledDeleteButton onClick={props.onClick}>
    <StyledIcon icon={Close}/>
  </StyledDeleteButton>
)

export enum ServiceItemActionId {
  Suspend,
  Edit
}

interface ServiceItemProps {
  card: Card
  onActionClick: (card: Card, action: ServiceItemActionId) => void
  deleteMutation: DocumentNode
  editUrl: string
}

const ServiceItem: React.FunctionComponent<ServiceItemProps> = props => {
  const { addToast } = useToasts()
  const [deleteItem, { loading }] = useMutation<{ id: number }, { id: number }>(
    props.deleteMutation,
    {
      awaitRefetchQueries: true,
      onCompleted: result => {
        addToast(
          `Service was deleted successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
      },
      onError: error => {
        addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
      },
      refetchQueries: ['ServiceListData']
    }
  )

  const includedInPackage = props.card.packageIds && props.card.packageIds.length > 0
  const deleteWarningMessage = (
    <>
     {includedInPackage && <>Some packages include this service.<br/></>}
      Do you really want to delete service <strong>{props.card.name}</strong>?
    </>
  )
  return (
    <>
      <StyledServiceWrapper>
        {props.children}
        <StyledActionsContainer>
          <SortHandle/>
          <ActionButton
            label={props.card.suspended ? 'unsuspend' : 'suspend'}
            icon={Pause}
            onClick={() => props.onActionClick(props.card, ServiceItemActionId.Suspend)}
          />
          <ActionButton
            label='edit'
            icon={Edit}
            to={props.editUrl}
          />
          <DeleteModal
            onConfirm={() => deleteItem({ variables: { id: props.card.id } })}
            message={deleteWarningMessage}
          >
            {onConfirm => (
              <DeleteButton onClick={onConfirm}/>
            )}
          </DeleteModal>
        </StyledActionsContainer>
      </StyledServiceWrapper>
      <DotSpinnerModal isOpen={loading} />
    </>
  )
}

const SortableServiceItem = SortableElement<ServiceItemProps>(ServiceItem)

export default SortableServiceItem
