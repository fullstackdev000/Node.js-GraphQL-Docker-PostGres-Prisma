import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import ContactModal from '../common/contactForm'
import MainFooter from '../common/footer'
import MapSection from './map'
import { Container } from './styled'

import { MapMarkerAlt } from 'styled-icons/fa-solid'
import { Email, Print } from 'styled-icons/material'

const FooterTop = styled.div`
  padding: 20px 0;
  background: ${props => props.theme.colors.TOUR_FOOTER};

  ${Container} {
    display: flex;
    justify-content: flex-end;

    @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
      justify-content: center;
    }
  }
`

const Wrapper = styled.footer`
  flex: 0 0 auto;
`

const StyledLink = styled.div<{ href?: string, target?: string }>`
  flex: 0 0 auto;
  padding: 13px;
  margin-left: 20px;
  text-align: center;
  background: ${props => props.theme.colors.DARK_GREY};
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.75);
  font-size: 10px;
  transition: color .5s;
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  div {
    margin-top: 3px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding: 10px;
    height: 70px;
    min-width: 70px;
    font-size: 9px;
  }

`

interface FooterProps {
  tour: Tour
}

const Footer: FunctionComponent<FooterProps> = ({ tour }) => {
  const [ contactFormVisible, toggleContactForm ] = React.useState<boolean>(false)
  const [mapVisible, toggleMap] = React.useState(false)

  return (
    <Wrapper >
      <FooterTop>
        <Container>
          {
            tour.showMap && (
              <StyledLink onClick={() => toggleMap(prev => !prev)}>
                <MapMarkerAlt size='34'/>
                <div>MAP</div>
              </StyledLink>
            )
          }
          <StyledLink onClick={() => toggleContactForm(true)}>
            <Email size='34'/>
            <div>CONTACT</div>
          </StyledLink>
          <StyledLink as='a' href={tour.brochureUrl} target='_blank'>
            <Print size='34'/>
            <div>BROCHURE</div>
          </StyledLink>
        </Container>
      </FooterTop>
      {mapVisible && <MapSection tour={tour} />}
      <MainFooter tour={tour} />
      <ContactModal modalVisible={contactFormVisible} toggleModal={() => toggleContactForm(false)}/>
    </Wrapper>
  )
}
export default Footer
