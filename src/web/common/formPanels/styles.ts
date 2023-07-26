import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'

export const StyledSection = styled.section `
  display: flex;
  flex-direction: column;
  align-items: stretch;
  color: ${props => props.theme.colors.LABEL_TEXT};
  & + section {
    padding-top:16px;
    margin-top: 16px;
    border-top: 1px solid ${props => props.theme.colors.BORDER}
  }
`

export const StyledDescription = styled.div`
  padding-right: 30px;
  line-height: 1.5;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

export const StyledFieldsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  input {width: 100%;}
`

export const FieldSpanAll = styled(Field) `
  grid-column-start: 1;
  grid-column-end: span 2;
  margin-top: 13px;
`

export const StyledNote = styled.p `
  margin: 8px 0;
  font-size: 12px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

export const StyledNoteHighlight = styled.span `
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.OK};
`
