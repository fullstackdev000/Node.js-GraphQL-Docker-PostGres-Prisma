import styled from './styled-components'

export const Label = styled.span`
  color: ${props => props.theme.colors.TEXT}
  &:after {content: '  '}
`

export const Data = styled.span`
  color: ${props => props.theme.colors.LABEL_TEXT}
`

export const Container = styled.ul`
  width:100%;
  font-size: 10px;
  padding: 25px 15px;
  li {
    line-height: 25px;
    font-weight: 600;
  }
`
