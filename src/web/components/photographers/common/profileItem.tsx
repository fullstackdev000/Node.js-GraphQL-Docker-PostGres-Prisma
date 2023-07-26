import { privateUrls } from '#veewme/lib/urls'
import IconButton from '#veewme/web/common/buttons/iconButton'
import DeleteConfirmation from '#veewme/web/common/deleteConfirmation'
import * as log from '#veewme/web/common/log'
import { ImageWrapper, MailIcon, PersonBox, StyledDropDownButton } from '#veewme/web/common/styled-listItem'
import { BooleanIcon, NoteModal, PhoneLink } from '#veewme/web/common/ui-helpers'
import * as React from 'react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import Avatar from '../../../assets/svg/male-user.svg'
import { StyledLinkButton } from '../../../common/styled'
import styled from '../../../common/styled-components'
import { StyledCell, StyledRow } from '../../../common/table'
import { Profile } from './types'

import { SpeakerNotes } from 'styled-icons/material/SpeakerNotes'

const PhoneWrapper = styled.div`
  white-space: nowrap;
  width: 100%;
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-size: 11px;
  font-weight: 500;

  a {
    color: ${props => props.theme.colors.FIELD_TEXT};
    font-weight: 500;
  }
`

const PersonalInfoWrapper = styled.div`
  font-size: 13px;
  font-weight: 600;
`

const InternalNoteButton = styled(props => <IconButton {...props} />)`
  & svg {
    fill: ${props => props.theme.colors.ORANGE}
  }
`

export type ListProfile = Omit<Profile, 'regionId'>
interface PhotographerItemProps extends RouteComponentProps {
  profile: ListProfile
  onPinClick: (id: Profile['id']) => void
  onDelete: (id: Profile['id']) => void
  role?: 'Processor' | 'Photographer'
}

const PhotographerItem: React.FunctionComponent<PhotographerItemProps> = ({
  match,
  profile,
  onDelete,
  onPinClick,
  role
}) => {
  const currentUrl = match.url

  const roleIdPrefix = role === 'Photographer' ? 'photographerId' : 'processorId'

  const [isOpen, toggleModal] = React.useState<boolean>(false)

  return (
    <>
      <DeleteConfirmation
        onConfirm={() => onDelete(profile.id)}
        message={`Are you sure you want to delete ${role}?`}
      >
        {toggleDeleteConfirmation => (
          <StyledRow>
            <StyledCell>
              <PersonBox>
                <div>
                  {role === 'Photographer' && <ImageWrapper>
                      {profile.profilePicture && profile.profilePicture.path ? <img src={profile.profilePicture.path} alt='Photographer' /> : <Avatar width='40' height='40' />}
                    </ImageWrapper>
                  }
                  <PersonalInfoWrapper>
                    <NavLink to={`${currentUrl}/edit/${profile.id}`}>
                      {`${profile.user.firstName} ${profile.user.lastName}`}
                    </NavLink>
                    <PhoneWrapper><PhoneLink value={profile.phone || ''} /></PhoneWrapper>
                  </PersonalInfoWrapper>
                </div>
                <div>
                  <a href={`mailto: ${profile.user.email}`}><MailIcon /></a>
                  {
                    profile.internalNote && (
                      <InternalNoteButton
                        onClick={() => toggleModal(prev => !prev)}
                        size='small'
                        Icon={SpeakerNotes}
                      />
                    )
                  }
                </div>
              </PersonBox>
            </StyledCell>
            <StyledCell>
              {profile.city || '-'}
            </StyledCell>
            <StyledCell>
              {profile.region ? profile.region.label : '-'}
            </StyledCell>
            <StyledCell>
              <BooleanIcon value={!!profile.activatable} />
            </StyledCell>
            {
              role === 'Photographer' && <StyledCell>
                <BooleanIcon value={!!profile.schedulable} />
              </StyledCell>
            }
            {
              role === 'Photographer' && <StyledCell>
                <BooleanIcon value={!!profile.enableServiceDone} />
              </StyledCell>
            }
            {
              role === 'Photographer' && <StyledCell>
                <BooleanIcon value={!!profile.changeable} />
              </StyledCell>
            }
            <StyledCell darker center>
              <StyledLinkButton to={`${privateUrls.orders}/?${roleIdPrefix}=${profile.id}`}>
                Orders
              </StyledLinkButton>
            </StyledCell>
            <StyledCell darker>
              <StyledDropDownButton
                list={[{
                  items: [{
                    label: 'Edit',
                    linkTo: `${currentUrl}/edit/${profile.id}`
                  }, {
                    label: 'Suspend',
                    onClick: () => log.debug(`Suspend clicked ${profile.id}`)
                  }, {
                    label: 'Delete',
                    onClick: toggleDeleteConfirmation
                  }]
                }]}
              />
            </StyledCell>
          </StyledRow>
        )}
      </DeleteConfirmation>
      <NoteModal
        title={`${role} Note`}
        isOpen={isOpen}
        toggleModal={() => toggleModal(prev => !prev)}
        centerVertically={true}
        colorTheme='PAYMENT'
        background='LIGHT'
        showBorderRadius={false}
        note={profile.internalNote}
        hideCredits
      />
    </>
  )
}

export default withRouter(PhotographerItem)
