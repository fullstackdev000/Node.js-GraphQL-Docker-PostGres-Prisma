import styled from '#veewme/web/common/styled-components'
import { NavLink } from 'react-router-dom'

export const PageWrapper = styled.div`
  margin: 50px 10%;
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-size: 12px;
  line-height: 16px;
`

export const FormHeader = styled.h2`
  margin-bottom: 50px;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 24px;
`

export const FormWrapper = styled.div`
  padding: 20px 30px;
  border: 1px solid ${props => props.theme.colors.BORDER};
  border-radius: 5px;
  margin: 10px 0 30px;
  background: ${props => props.theme.colors.EXTRA_LIGHT_GREY};

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    max-width: 50%;

    & > div {
      max-width: 395px;
    }
  }

  button {
    margin-top: 20px;
    text-transform: capitalize;
  }

  label {
    color: ${props => props.theme.colors.FIELD_TEXT};
  }
`

export const HeadingP = styled.p`
  margin: -20px 0 30px 0;
  color: ${props => props.theme.colors.FIELD_TEXT};
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-size: 13px;
  line-height: 17px;
`

export const ForgotLink = styled(NavLink)`
  display: block;
  margin: 10px 0 5px 0;
  max-width: 395px;
  color: ${props => props.theme.colors.BLUE};
  font-size: 13px;
  line-height: 17px;
`
