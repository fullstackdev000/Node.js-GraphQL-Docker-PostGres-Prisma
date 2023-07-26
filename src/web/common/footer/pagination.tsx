import * as React from 'react'
import ReactPaginate from 'react-paginate'
import styled from '../styled-components'

const StyledPagination = styled.div `
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a {
    display: inline-block;
    width: 30px;
    text-align: center;
    outline: none !important;
  }

  .page-item {
    width: 30px;
    height: 30px;
    margin: 0 5px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &.active {
      background-color: ${props => props.theme.colors.GREEN};
    }
  }

  .break {
    cursor: pointer;
  }

  .prev,
  .next {
    width: 30px;
    height: 30px;
    margin: 0 5px;
    border: 2px solid ${props => props.theme.colors.BORDER};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    line-height: 30px;
    color: ${props => props.theme.colors.BUTTON_ICON_HOVER};
    font-size: 38px;

    a {
      margin-top: -5px;
    }
  }
`
// TODO: Make props required when pgaination is integrated
export interface PaginationProps {
  pageRangeDisplayed?: number
  pageCount?: number
  perPage?: number
  onChange?: (v: number) => void
  className?: string
}

const Pagination: React.FunctionComponent<PaginationProps> = ({
  className,
  onChange,
  pageCount = 6,
  pageRangeDisplayed = 4
}) => {

  return (
    <StyledPagination className={className}>
      <ReactPaginate
        breakLabel={'...'}
        breakClassName='break'
        nextLabel={<>&#8250;</>}
        previousLabel={<>&lsaquo;</>}
        previousClassName='prev'
        nextClassName='next'
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={({ selected }) => onChange && onChange(selected)}
        activeClassName={'active'}
        containerClassName='container'
        pageClassName='page-item'
      />
    </StyledPagination>
  )
}
export default Pagination
