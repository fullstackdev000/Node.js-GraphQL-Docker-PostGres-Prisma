// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import ProfilesList from '../common/profilesList'
import { Processor } from '../common/types'
import Filters, { FiltersFormValues } from './filters'

interface ProcessorsListProps {
  processors: Processor[]
  onPinClick: (id: Processor['id']) => void
  onSortClick: () => void
  isSortReverse: boolean
  onDelete: (id: Processor['id']) => void
  onFiltersChange: (val: FiltersFormValues) => void
  pageCount: number
  onPageChange: (skip: number) => void
  paginationKey: string
}

const ProcessorsListView: React.FunctionComponent<ProcessorsListProps> = props => (
  <>
    <Filters onSubmit={props.onFiltersChange} />
    <ProfilesList
      paginationKey={props.paginationKey}
      profiles={props.processors} // TODO remove cast
      onPinClick={props.onPinClick}
      onSortClick={props.onSortClick}
      isSortReverse={props.isSortReverse}
      onDelete={props.onDelete}
      role='Processor'
      onPageChange={p => props.onPageChange(p)}
      pageCount={props.pageCount}
    />
  </>
)

export default ProcessorsListView
