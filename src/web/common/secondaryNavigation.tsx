import styled from './styled-components'

const SecondaryNavigation = styled.ul`
  width: calc(100% - 5px);
  border-radius: 5px;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.BORDER}
  padding: 25px;
  position:relative;
  &:after {
    content:'';
    display: block;
    width:15px;
    height:15px;
    transform: rotate(45deg);
    background-color:white;
    position:absolute;
    right:-8px;
    top: 29px;
    border-top: 1px solid ${props => props.theme.colors.BORDER};
    border-right: 1px solid ${props => props.theme.colors.BORDER};
  }
  li {
    margin: 10px 0;
    a {
      color: ${props => props.theme.colors.SECONDARY_NAVIGATION_LINK};
      font-size: 13px;
      font-weight: 600;
      &:hover, &.active {color: ${props => props.theme.colors.GREEN}}
    }
  }
`

export default SecondaryNavigation
