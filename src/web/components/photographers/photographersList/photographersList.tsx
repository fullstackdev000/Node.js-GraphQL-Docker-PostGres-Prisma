// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import ProfilesList from '../common/profilesList'
import { Photographer } from '../common/types'
import Filters, { FiltersFormValues } from './filters'

type ListPhotograper = Omit<Photographer, 'regionId'>
interface PhotographersListProps {
  photographers: ListPhotograper[]
  onPinClick: (id: Photographer['id']) => void
  onSortClick: () => void
  isSortReverse: boolean
  onDelete: (id: Photographer['id']) => void
  onFiltersChange: (val: FiltersFormValues) => void
  pageCount: number
  onPageChange: (skip: number) => void
  paginationKey: string
}

const PhotographersListView: React.FunctionComponent<PhotographersListProps> = props => (
  <>
    <Filters
      onSubmit={props.onFiltersChange}
    />
    <ProfilesList
      paginationKey={props.paginationKey}
      profiles={props.photographers} // TODO remove cast
      onPinClick={props.onPinClick}
      onSortClick={props.onSortClick}
      isSortReverse={props.isSortReverse}
      onDelete={props.onDelete}
      onPageChange={p => props.onPageChange(p)}
      pageCount={props.pageCount}
    />
  </>
)

export default PhotographersListView
