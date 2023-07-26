import styled from '#veewme/web/common/styled-components'

export const StyledNoteWrapper = styled.div `
  margin-top: 12px;
  margin-bottom: 30px;
  font-size: 14px;
`

export const StyledBold = styled.span `
    font-weight: 700;
`

export const StyledGreenBold = styled(StyledBold) `
  color: ${props => props.theme.colors.GREEN};
`
