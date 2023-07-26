import { perPaginationPage } from '#veewme/web/common/consts'
// import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import LegendBar, { LegendBarProps } from './legendBar'
import Pagination from './pagination'

const StyledInfoBar = styled.div `
  min-height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.TEXT};
  font-size: 11px;
`

const StyledPaginationBar = styled.div `
  min-height: 90px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 3px solid ${props => props.theme.colors.BUTTON_BORDER};
`

const StyledFooter = styled.div `
  width: 100%;
  display: flex;
  flex-direction: column;
`
export interface PaginationProps {
  totalRecords: number,
  pageLimit: number,
  maxButtons: number
  onPageChange?: (page: number) => void
  paginationKey?: string
}

type ListFooterProps = LegendBarProps & PaginationProps & { label?: string }

const ListFooter: React.FunctionComponent<ListFooterProps> = ({
  label,
  pageLimit = perPaginationPage,
  statuses,
  totalRecords = 0,
  onPageChange,
  paginationKey
}) => (
  <StyledFooter>
    <StyledInfoBar>
      <>
        {label &&
          <p>{label}</p>
        }
      </>
      <LegendBar statuses={statuses}/>
    </StyledInfoBar>
    <StyledPaginationBar>
      <Pagination
        key={paginationKey}
        perPage={pageLimit}
        pageCount={totalRecords}
        pageRangeDisplayed={pageLimit}
        onChange={p => onPageChange && onPageChange(p)}
      />
    </StyledPaginationBar>
  </StyledFooter>
)

export default ListFooter
