import MailSvg from '../assets/svg/mail.svg'
import DropDownButton from './buttons/dropDownButton'
import styled from './styled-components'

export const ImageWrapper = styled.div`
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  fill: ${props => props.theme.colors.BUTTON_ICON};
  margin-right: 15px;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.BUTTON_BORDER};
  overflow: hidden;

  & > img {
    width: 40px;
    height: 40px;
  }
`

export const PersonBox = styled.div`
  display: flex;

  & > div {
    display: flex;
    align-items: center;
    padding-right: 15px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    flex-direction: column;

      & > div:first-child {
        margin-top: 5px;
        margin-bottom: 15px;
      }
  }
`

export const MailIcon = styled(MailSvg)`
  position: relative;
  top: 1px;
  width: 15px;
  height: 15px;
  margin-right: 10px;
  fill: ${props => props.theme.colors.GREEN};
`

export const StyledDropDownButton = styled(DropDownButton)`
  width: 100%;

  button {
    width: 100%;
    padding: 0 25px;
    background-color: transparent;
    border: none;
  }
`
