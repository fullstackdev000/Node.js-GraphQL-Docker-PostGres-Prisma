import styled from './styled-components'

export const StyledTable = styled.table`
  width: 100%;
  margin-bottom: 25px;
  padding: 0 25px 0 0;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  border-collapse:separate;
  border-spacing: 0 15px;
  font-weight: 500;
`

export const StyledRow = styled.tr`
  margin: 0 0 15px 0;
  background-color: #fff;
  font-size: 13px;
  border-radius: 5px;
`
export const StyledCell = styled.td<{ darker?: boolean, center?: boolean }>`
  padding: 8px 15px;
  border: 1px solid ${props => props.theme.colors.BORDER};
  border-width: 1px 1px 1px 0;
  border-right-style: dashed;
  background: ${props => props.darker ? props.theme.colors.ACTIONBAR_BACKGROUND : 'none'};
  ${props => props.center && 'text-align: center;'}
  height: 50px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-size: 11px;

  &:first-child {
    border-left-width: 1px;
    border-radius: 5px 0 0 5px;
    width: 40%;
  }

  &:last-child {
    padding: 0;
    border-right-style: solid;
    border-radius: 0 5px 5px 0;
    text-align: right;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    &:first-child {
      width: 15%;
    }

    &:last-child {
      width: auto;
    }
  }

  a {
    color: ${props => props.theme.colors.FIELD_TEXT};
    font-weight: 600;
  }
`

export const StyledHeaderCell = styled.th`
  position: relative;
  top: 3px;
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.theme.colors.LABEL_TEXT}
  text-align: left;

  &:first-child {
    border: 0 none;
  }
`
