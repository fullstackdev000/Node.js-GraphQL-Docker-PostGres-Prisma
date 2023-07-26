// import { LegendStatus } from '#veewme/web/common/footer/legendBar'
import Pagination from '#veewme/web/common/footer/pagination'
import { useRole } from '#veewme/web/common/hideForRole'
// import { getOrderLegendStatus } from '#veewme/web/common/status'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Filters, { FiltersFormValues } from './filters'
import MediaItem from './mediaItem'
import { MediaAccessOrder } from './types'

export const Wrapper = styled.div`
  border-top: 2px solid ${props => props.theme.colors.BORDER};
`

export const StyledMediaList = styled.ul`
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 3px solid ${props => props.theme.colors.BUTTON_BORDER};
`

/*
const statuses: LegendStatus[] = [
  getOrderLegendStatus('Published'),
  getOrderLegendStatus('Unpublished'),
  getOrderLegendStatus('MediaOnly')
]
*/

interface MediaListProps {
  orders: MediaAccessOrder[]
  perPage: number
  refetch: (skip: number) => void
  pageCount: number
  onFiltersSubmit: (values: FiltersFormValues) => void
  paginationKey: string
}

const MediaList: React.FunctionComponent<MediaListProps> = props => {
  const { orders } = props
  const role = useRole()
  return (
    <Wrapper>
      <Filters onSubmit={values => props.onFiltersSubmit(values)} />
      <StyledMediaList>
        {orders.length === 0 && 'No matching data found'}
        {orders.map(order => <MediaItem key={order.id} order={order} role={role}/>)}
      </StyledMediaList>
      <Pagination
        key={props.paginationKey}
        pageCount={props.pageCount}
        perPage={props.perPage}
        onChange={p => {
          const skip = p * props.perPage
          props.refetch(skip)
        }}
      />
    </Wrapper>
  )
}

export default MediaList
