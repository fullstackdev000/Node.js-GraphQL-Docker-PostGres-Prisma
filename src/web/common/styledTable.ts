import { StyledContainer } from './sortButton'
import styled from './styled-components'

export const StyledTable = styled.table`
  width: 100%;
  max-width: 100%;
  padding: 0 25px 0 0;
  font-weight: 500;
  text-transform: capitalize;
  border-collapse: collapse;
  border-spacing: 0;
`

export const StyledHeaderCell = styled.th<{ activeSort?: boolean }>`
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.TEXT};
  background: ${props => props.activeSort ? props.theme.colors.TEXT : props.theme.colors.BORDER}
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.activeSort ? props.theme.colors.FIELD_TEXT : props.theme.colors.LABEL_TEXT};
  text-align: left;
  cursor: pointer;

  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &:first-child {
    border-left-width: 0;
  }

  &:last-child {
    border-right-width: 0;
  }

  ${StyledContainer} {
    height: 26px;
    margin-right: 0;

    ${props => !props.activeSort && `
      transform: none;
   `}

    div {
      border-top-color: ${p => p.activeSort ? '#fff' : p.theme.colors.LABEL_TEXT};
    }

    div:first-child {
      border-bottom-color: ${p => p.activeSort ? p.theme.colors.FIELD_TEXT : p.theme.colors.LABEL_TEXT};
    }
  }
`

export const StyledRow = styled.tr`
  margin: 0 0 15px 0;
  background-color: #fff;
  font-size: 13px;
  border-radius: 5px;

  &:last-child td {
    border-bottom-color: #fff;
  }
`

export const StyledCell = styled.td`
  padding: 20px 15px;
  border: 1px solid ${props => props.theme.colors.BORDER};
  border-width: 0 1px 2px 0;
  border-right-style: dashed;
  background-color: #fff;
  color: ${props => props.theme.colors.FIELD_TEXT};

  &:last-child {
    border-right: 0 none;
  }
`
