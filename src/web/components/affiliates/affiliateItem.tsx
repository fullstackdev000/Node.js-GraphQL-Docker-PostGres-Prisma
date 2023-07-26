import {
  ActivityStatus,
  AffiliatesQuery,
  DeleteAffiliateMutation,
  DeleteAffiliateMutationVariables,
  ToggleAffiliateStatusMutation,
  ToggleAffiliateStatusMutationVariables
} from '#veewme/gen/graphqlTypes'
import { Countries } from '#veewme/lib/constants'
import { DeleteAffiliate, ToggleAffiliateStatus } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import CheckMarkSvg from '#veewme/web/assets/svg/checkmark.svg'
import MailSvg from '#veewme/web/assets/svg/mail.svg'
import X from '#veewme/web/assets/svg/x.svg'
import Button from '#veewme/web/common/buttons/basicButton'
import DropDownButton from '#veewme/web/common/buttons/dropDownButton'
import IconButton from '#veewme/web/common/buttons/iconButton'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import { useMutation } from '@apollo/react-hooks'
import { format } from 'date-fns'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import { Globe } from 'styled-icons/boxicons-regular/Globe'
import { ActionCell, ActionRow, Cell, Cols, Row } from './tableItems'

const formatDate: (dateString: string) => {date: string, hour: string} = dateString => {
  const date = new Date(dateString)
  return {
    date: format(date, 'MM/DD/YY'),
    hour: format(date, 'hh:mm aa')
  }
}

const GreenButton = styled(props => <IconButton {...props} />)`
  & svg {
    fill: ${props => props.theme.colors.GREEN};
  }
  &:not(:first-child) {
    margin-right: 5px;
  }
`

const CheckIcon = styled(CheckMarkSvg)`
  width: 16px;
  height: 16px;
  fill: ${props => props.theme.colors.GREEN};
  margin: auto;
`

const Xicon = styled(X)`
  width: 13px;
  height: 13px;
  fill: ${props => props.theme.colors.BORDER};
  margin: auto;
`

const UserName = styled.p`color: ${props => props.theme.colors.GREEN};`
const ActivityParagraph = styled.p`
  color: ${props => props.theme.colors.ORANGE};
  text-transform: lowercase;
`
const FullName = styled.div`margin-right: 5px`

const ModalButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  & > * {
    margin: 10px;
  }
`

type AffiliateItemProps = AffiliatesQuery['affiliates'][0]

const AffiliateItem: React.FunctionComponent<AffiliateItemProps> = props => {
  const { addToast } = useToasts()

  const [deleteAffiliate, { loading: deleteLoading }] = useMutation<DeleteAffiliateMutation, DeleteAffiliateMutationVariables>(
    DeleteAffiliate,
    {
      awaitRefetchQueries: true,
      onCompleted: result => {
        addToast(
          `Affiliate was deleted successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 2000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while deleting Affiliate`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: ['Affiliates']
    }
  )

  const [toggleStatus, { loading: toggleStatusLoading }] = useMutation<ToggleAffiliateStatusMutation, ToggleAffiliateStatusMutationVariables>(
    ToggleAffiliateStatus,
    {
      awaitRefetchQueries: true,
      onCompleted: result => {
        addToast(
          `Affiliate was updated successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 2000 }
        )
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating Affiliate status`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      },
      refetchQueries: ['Affiliates']
    }
  )

  const [isOpen, toggleModal] = React.useState<boolean>(false)
  const activityStatus = props.activityStatus
  const affiliateType = props.accountExtensionType
  const accountConfirmed = props.accountConfirmed
  const joinDate = formatDate(props.user.joinDate)
  const lastActiveDate = formatDate(props.user.lastActive)
  const country = Countries.find(currentCountry => currentCountry.value === props.country)

  const activityLabel = activityStatus === 'SUSPENDED' ? 'Activate' : 'Suspend'
  const updateActivityStatus: ActivityStatus = activityStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
  return (
    <>
      <DotSpinnerModal isOpen={deleteLoading || toggleStatusLoading} />
      <Row accountConfirmed={!!accountConfirmed} colSpan={12}>
        <Cols>
          <tr>
            <Cell>
              <p>{props.companyName}</p>
              <UserName>({props.user.email})</UserName>
              {activityStatus === 'SUSPENDED' && <ActivityParagraph>{activityStatus}</ActivityParagraph>}
            </Cell>
            <Cell>{affiliateType}</Cell>
            <Cell>
              <p>{props.phoneOffice || props.phone}</p>
              <GreenButton castAs='link' to={`mailto:${props.emailOffice || props.user.email}`} size='small' Icon={MailSvg} />
              {props.website && <GreenButton castAs='link' to={props.website} size='small' Icon={Globe} />}
            </Cell>
            <Cell>{props.city}</Cell>
            <Cell>{props.state}</Cell>
            <Cell>{country && country.label}</Cell>
            <Cell>{props.customDomainEnabled ? <CheckIcon/> : <Xicon/>}</Cell>
            <Cell><p>{joinDate.date}</p><p>{joinDate.hour}</p></Cell>
            <Cell><p>{lastActiveDate.date}</p><p>{lastActiveDate.hour}</p></Cell>
            <Cell>{props.agents && props.agents.length || '0'}</Cell>
            <Cell>{props.orders && props.orders.length || '0'}</Cell>
            <Cell>
              <FullName>{props.user.firstName} {props.user.lastName}</FullName>
              <GreenButton castAs='link' to={`mailto:${props.phone}`} size='small' Icon={MailSvg} />
              <p>{props.phone}</p>
            </Cell>
          </tr>
          <ActionRow>
            <ActionCell colSpan={12}>
              <Button label='Agents' />
              <Button label='Orders' />
              <Button label='Tours' />
              <DropDownButton
                list={[
                  {
                    items: [
                      {
                        label: accountConfirmed ? activityLabel : 'Confirm account',
                        onClick: () => {
                          const status = accountConfirmed ? { activityStatus: updateActivityStatus } : { accountConfirmed: true }
                          toggleStatus({
                            variables: {
                              id: props.id,
                              ...status
                            }
                          }).catch(error => log.debug(error.message))
                        }
                      },
                      {
                        label: 'Edit',
                        linkTo: `${privateUrls.affiliates}/${props.id}`
                      }, {
                        label: 'Delete',
                        onClick: () => toggleModal(prev => !prev)
                      }
                    ]
                  }
                ]}
                label='Actions'
              />
            </ActionCell>
          </ActionRow>
        </Cols>
      </Row>
      <Modal
        centerVertically
        isOpen={isOpen}
        onRequestClose={() => toggleModal(prev => !prev)}
        title={`Do you want to delete ${props.companyName} affilate (account: ${props.user.email})?`}
      >
        <ModalButtonsWrapper>
          <Button label='Cancel' onClick={() => { toggleModal(prev => !prev) }} />
          <Button
            buttonTheme='alert'
            label='Confirm'
            full
            onClick={() => {
              toggleModal(prev => !prev)
              return deleteAffiliate({ variables: { id: props.id } })
            }}
          />
        </ModalButtonsWrapper>
      </Modal>
    </>
  )
}

export default AffiliateItem
