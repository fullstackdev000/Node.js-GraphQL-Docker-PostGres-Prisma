import * as React from 'react'
import { components } from 'react-select'
import { OptionProps } from 'react-select/lib/components/Option'
import { StyledIcon } from 'styled-icons/types'
// import { IndicatorProps } from 'react-select/lib/components/indicators'
import DeleteConfirmation from '../../../common//deleteConfirmation'
import Button from '../../../common/buttons/basicButton'
import { OptionValue, Select } from '../../../common/formikFields/selectField'
import styled from '../../../common/styled-components'
import { PhotosSelection, Sort } from '../types'
import { PhotoItem } from './photos'

import { SortDown, SortUp, Star } from 'styled-icons/boxicons-regular'
import { Star as StarSolid } from 'styled-icons/boxicons-solid'
import { Eye, EyeBlocked } from 'styled-icons/icomoon'
import { Close } from 'styled-icons/material'

const SelectButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 15px 0 0;
  padding-right: 15px;
  flex: 0 0 auto;
  border-right: 1px solid ${props => props.theme.colors.BORDER};

  button:last-child {
    margin-right: 0;
  }
`

const ToolbarRigtHolder = styled.div`
  display: flex;
  flex: 1 0 auto;
  margin-top: 15px;
  justify-content: flex-end;
  z-index: 2;

  div:first-child > div {
    margin-bottom: 0;
  }

  @media (max-width: 1385px) {
    width: 100%;
    padding: 10px 0;
    justify-content: flex-start;
  }
`

const SelectOptions = styled.div`
  flex: 0 0 auto;
  margin-top: 15px;
  padding-right: 15px;
  align-items: center;

  button:last-child {
    margin-right: 0;

    svg {
      fill: ${props => props.theme.colors.ALERT};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-right: 0;

    button {
      padding-right: 12px;
      padding-left: 8px;
    }
  }
`

const PhotosInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 315px;
  margin-left: 15px;
  flex: 0 0 auto;
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-size: 13px;
  font-weight: 500;

  div {
    display: flex;
    margin-left: 15px;
    padding-left: 15px;
    border-left: 1px solid ${props => props.theme.colors.BORDER};

    svg {
      margin-right: 3px;
    }
  }
`

const PhotosInfoItem = styled.span`
  display: flex;
  padding: 0 8px;
  align-items: center;
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-size: 13px;
  font-weight: 500;
`

const StyledNumber = styled.span`
  color: ${props => props.theme.colors.FIELD_TEXT};
  padding: 0 5px;
`

const ToolbarStyled = styled.div`
  padding: 20px 0 15px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid ${props => props.theme.colors.BORDER};

  button {
    margin-right: 10px;
  }

  ${PhotosInfo},
  ${SelectOptions},
  ${SelectButtonsWrapper} {
    svg {
      max-width: 17px;
      max-height: 17px;
      width: 17px;
      height: 17px;
      fill: ${props => props.theme.colors.GREY};
    }
  }
`

const StyledSortOption = styled.div`
  position: relative;

  svg {
    width: 18px;
    height: 18px;
    position: absolute;
    top: 7px;
    right: 6px;
  }
`
interface CustomOptionData {
  icon: StyledIcon
  sortInfo: Sort
}

const Option = (props: OptionProps<CustomOptionData>) => {
  const Icon = props.data.customData.icon
  return (
    <StyledSortOption>
      <components.Option {...props} />
      <Icon />
    </StyledSortOption>
  )
}

const sortOptions: Array<OptionValue<string, CustomOptionData>> = [{
  customData: {
    icon: SortDown,
    sortInfo: {
      fieldName: 'title',
      orderDesc: false
    }
  },
  label: 'Name (A - Z)',
  value: 'titleAsc' // value is used only to tell react-select which options is selected
}, {
  customData: {
    icon: SortUp,
    sortInfo: {
      fieldName: 'title',
      orderDesc: true
    }
  },
  label: 'Name (Z - A)',
  value: 'titleDesc'
}, {
  customData: {
    icon: SortDown,
    sortInfo: {
      fieldName: 'date',
      orderDesc: false
    }
  },
  label: 'Date (Older - Newer)',
  value: 'dateAsc'
}, {
  customData: {
    icon: SortUp,
    sortInfo: {
      fieldName: 'date',
      orderDesc: true
    }
  },
  label: 'Date (Newer - Older)',
  value: 'dateDesc'
}]

interface DeleteBtnProps {
  onDelete: () => void
}

const DeleteBtn: React.FunctionComponent<DeleteBtnProps> = props => (
  <DeleteConfirmation
    onConfirm={props.onDelete}
    message='Are you sure you want to delete selected photos?'
  >
    {toggleDeleteConfirmation => (<Button icon={Close} buttonTheme='primary' label='Delete' type='button' onClick={toggleDeleteConfirmation} />)}
  </DeleteConfirmation>
)

interface ToolbarProps {
  photos: PhotoItem[]
  photosSelection: PhotosSelection
  onSelectAll: (select: boolean) => void
  onUpdateSelected: (payload: Partial<PhotoItem>) => void
  onDeleteSelected: () => void
  onSort: (sort: Sort) => void
}

const Toolbar: React.FunctionComponent<ToolbarProps> = props => {
  const selectedPhotos = props.photos.filter(photo => props.photosSelection[photo.id])
  const selectedCount = selectedPhotos.length
  const allPhotosCount = props.photos.length

  const starredCount = props.photos.filter(item => item.star).length
  const hiddenCount = props.photos.filter(item => item.hidden).length

  const allSelectedAreStarred = selectedPhotos.every(item => item.star)
  const allSelectedAreHidden = selectedPhotos.every(item => item.hidden)

  const selectedOptions = (
    <SelectOptions>
      <Button
        buttonTheme='primary'
        icon={allSelectedAreStarred ? Star : StarSolid}
        label={allSelectedAreStarred ? 'Unstar' : 'Star'}
        type='button'
        onClick={() => props.onUpdateSelected({ star: !allSelectedAreStarred })}
      />
      <Button
        buttonTheme='primary'
        icon={allSelectedAreHidden ? Eye : EyeBlocked}
        label={allSelectedAreHidden ? 'Show' : 'Hide'}
        type='button'
        onClick={() => props.onUpdateSelected({ hidden: !allSelectedAreHidden })}
      />
      <DeleteBtn onDelete={props.onDeleteSelected} />
    </SelectOptions>
  )

  return (
    <ToolbarStyled>
      <SelectButtonsWrapper>
        <Button buttonTheme='primary' label='Select all' type='button' onClick={() => props.onSelectAll(true)} disabled={selectedCount === allPhotosCount} />
        <Button buttonTheme='primary' label='Deselect' type='button' onClick={() => props.onSelectAll(false)} disabled={!selectedCount} />
      </SelectButtonsWrapper>
      {!!selectedCount && selectedOptions}
      <ToolbarRigtHolder>
        <Select
          components={{
            Option
          }}
          options={sortOptions}
          onChange={selected => {
            if (selected && selected.customData) {
              props.onSort(selected.customData.sortInfo)
            }
          }}
        />
        <PhotosInfo>
          <StyledNumber>{selectedCount}</StyledNumber>
          {`Selected out of ${allPhotosCount}`}
          <div>
            <PhotosInfoItem><StarSolid /> {starredCount}</PhotosInfoItem>
            <PhotosInfoItem><EyeBlocked /> {hiddenCount}</PhotosInfoItem>
          </div>
        </PhotosInfo>
      </ToolbarRigtHolder>
    </ToolbarStyled>
  )
}

export default React.memo(Toolbar)
