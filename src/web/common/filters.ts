import styled from './styled-components'

/*
  Styled components for basic filters layout
*/

export const FiltersWrapper = styled.div`
  padding: 25px 0 0 0;
  display: flex;
  flex-wrap: wrap;
`

export const FieldWrapper = styled.div`
  display: flex;
  flex: 0 1 auto;
  min-width: 100px;
  margin-right: 25px;
  border-right: 2px solid  ${props => props.theme.colors.BORDER};
  padding-right: 25px;

  input {
    flex: 1 0 auto;
  }

  > div {
    width: 100%;
  }
`

export const ResetButton = styled.button`
  padding: 6px 15px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  border-radius: 5px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  background-color: transparent;
  font-weight: 600;
  cursor: pointer;
  transition: border .5s, color .5s;

  &:hover {
    border: 2px solid ${props => props.theme.colors.GREY};
  }
`
