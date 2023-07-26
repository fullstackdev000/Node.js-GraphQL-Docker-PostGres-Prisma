import { publicUrls } from '#veewme/lib/urls'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { World } from 'styled-icons/boxicons-regular/World'
import { FacebookF } from 'styled-icons/fa-brands/FacebookF'
import { Twitter } from 'styled-icons/fa-brands/Twitter'
import Logo from '../../../assets/svg/logo.svg'
import dimensions from './dimensionsConstants'

const currentYear = new Date().getFullYear()

const MainFooter = styled.ul`
  background-color: ${props => props.theme.colors.PUBLIC_MAIN_FOOTER};
  padding: 50px ${dimensions.pageMargin};
  border-top: 1px solid ${props => props.theme.colors.BORDER};
  li {
    padding: 40px 0;
    width: 300px;
    margin:auto;
    text-align: center;
    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.colors.BORDER};
    }
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      margin-left: 0;
      text-align: left;
    }
  }
  h4 {
    color: ${props => props.theme.colors.GREEN};
    font-size: 24px;
    font-weight: 500;
    margin: 20px 0;
  }
  p {
    font-size: 15px;
    font-weight: 300;
    margin: 5px 0px;
    line-height: 1.5em;
    color: ${props => props.theme.colors.FIELD_TEXT};
  }
`

const SecondaryFooter = styled.div`
  padding: 50px ${dimensions.pageMargin};
  background-color: ${props => props.theme.colors.PUBLIC_SECONDARY_FOOTER};
  & > div {
    text-align: center;
    &:first-child {
      margin-bottom: 30px;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: flex;
    justify-content: space-between;
  }
`

const MainFooterLink = styled(Link)`
  &, &:visited {
    color: ${props => props.theme.colors.BLUE};
  }
  &:hover, &:focus {
    color: ${props => props.theme.colors.LIGHT_BLUE};
  }
`

const Email = styled(MainFooterLink)`
  font-weight: 600;
`

const Tel = styled(Link)`
  font-weight: 600;
  &, &:visited {
    color: ${props => props.theme.colors.FIELD_TEXT};
  }
  &:hover, &:focus {
    color: ${props => props.theme.colors.LABEL_TEXT};
  }
`

const DesaturatedLogo = styled(Logo)`
  filter: saturate(0) contrast(0) brightness(70%);
  width: 170px;
`

const Country = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.GREY};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
  & > svg {
    width: 18px;
    margin-right: 10px;
  }
`

const Copyright = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.COPYRIGHT};
`

const SocialLink = styled(Link)`
  display: inline-flex;
  height: 50px;
  width: 50px;
  position: relative;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  &:first-child {
    margin-right: 15px;
  }
  &, &:visited {
    color: white
  }
  &:hover, &:active {
    opacity: 0.7;
  }
  & > svg {
    height: 50%;
    fill: white;
  }
`

const FacebookLink = styled(SocialLink)`
  background-color: ${props => props.theme.colors.FACEBOOK}
`

const TwitterLink = styled(SocialLink)`
  background-color: ${props => props.theme.colors.TWITTER}
`

const Footer: React.FunctionComponent = () => {
  return (
    <footer id={publicUrls.contact}>
      <MainFooter>
        <li>
          <h4>For Support</h4>
          <p>Or any general information</p>
        </li>
        <li>
          <p>AnnArbor, MI, USA</p>
          <p>Email: <Email to='mailto:support@veewme.com'>support@veewme.com</Email></p>
          <p>Phone: <Tel to='tel:+17344850818'>+1 (734) 485 0818</Tel></p>
        </li>
        <li>
          <h4>Information</h4>
          <p><MainFooterLink to={publicUrls.privacyPolicy}>Privacy Policy</MainFooterLink></p>
          <p><MainFooterLink to={publicUrls.termsAndConditions}>Terms & Conditions</MainFooterLink></p>
        </li>
      </MainFooter>
      <SecondaryFooter>
        <div>
          <DesaturatedLogo />
          <Country><World/> United States</Country>
          <Copyright>© {currentYear} Ogle Media, Inc. All Rights Reserved.</Copyright>
        </div>
        <div>
          <FacebookLink to={publicUrls.facebook}><FacebookF /></FacebookLink>
          <TwitterLink to={publicUrls.twitter}><Twitter /></TwitterLink>
        </div>
      </SecondaryFooter>
    </footer>
  )
}

export default Footer
