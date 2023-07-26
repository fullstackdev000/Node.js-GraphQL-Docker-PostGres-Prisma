// import * as log from '#veewme/web/common/log'
import Pagination, { PaginationProps } from '#veewme/web/common/footer/pagination'
import ListHeaderItem from '#veewme/web/common/listHeaderItem'
import * as React from 'react'
import { StyledHeaderCell, StyledTable } from '../../../common/table'
import ProfileItem, { ListProfile } from './profileItem'
import { Profile } from './types'

interface ProfilesListViewProps {
  profiles: ListProfile[]
  onPinClick: (id: Profile['id']) => void
  onDelete: (id: Profile['id']) => void
  onSortClick: () => void
  isSortReverse: boolean
  role?: 'Processor' | 'Photographer'
  pageCount?: number
  onPageChange?: (skip: number) => void
  paginationKey: string
}

const ProfilesListView: React.FunctionComponent<ProfilesListViewProps & PaginationProps> = ({
  role = 'Photographer',
  ...props
}) => (
  <>
    <StyledTable>
      <tbody>
        <tr>
          <StyledHeaderCell>
            <ListHeaderItem
              label={role}
              active
              reverseSort={props.isSortReverse}
              onSort={props.onSortClick}
            />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='City' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Region' />
          </StyledHeaderCell>
          <StyledHeaderCell>
            <ListHeaderItem label='Activate' />
          </StyledHeaderCell>
          {
            role === 'Photographer' && <StyledHeaderCell>
              <ListHeaderItem label='Schedule' />
            </StyledHeaderCell>
          }
          {
            role === 'Photographer' && <StyledHeaderCell>
              <ListHeaderItem label='Done' />
            </StyledHeaderCell>
          }
          {
            role === 'Photographer' && <StyledHeaderCell>
              <ListHeaderItem label='Change' />
            </StyledHeaderCell>
          }
        </tr>
        {props.profiles.map(profile => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            onPinClick={props.onPinClick}
            onDelete={props.onDelete}
            role={role}
          />
        ))}
      </tbody>
    </StyledTable>
    {props.profiles.length === 0 && 'No matching data found'}
    <Pagination
      key={props.paginationKey}
      pageCount={props.pageCount}
      onChange={p => {
        if (props.onPageChange) {
          props.onPageChange(p)
        }
      }}
    />
  </>
)

export default ProfilesListView
