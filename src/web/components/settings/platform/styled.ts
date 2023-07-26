import styled from '#veewme/web/common/styled-components'

export const StyledSection = styled.section `
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.LABEL_TEXT};
  & + section {
    padding-top:16px;
    margin-top: 16px;
  }
`

export const StyledInputWrapper = styled.div `
  flex: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  margin-bottom: 16px;
  & > div {
    flex: 1;
    margin: 0 10px 0 0;
    & > div {
      margin: 0;
    }
  }
  input {width: 100%;}
`
