import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import { TourContext } from '../main'
import { Container } from '../main/styled'

const FooterBottom = styled.div<{ mainColor: string }>`
  padding: 25px 0;
  background: ${props => props.mainColor};
  color: #fff;
  font-size: 12px;
  text-align: center;
`

const FooterImgWrapper = styled.a`
  display: block;
  margin: 15px auto 20px;
  width: 150px;
  height: 65px;
  color: #bbb;
  text-align: center;
  line-height: 65px;

  img {
    max-height: 100%;
  }
`

interface FooterProps {
  tour: Tour
}

const Footer: FunctionComponent<FooterProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <FooterBottom mainColor={mainColor}>
      <Container>
        <div>Professional Media Services by</div>
        {tour.headerLogoUrl && (
          <FooterImgWrapper href='' target='_blank'>
            <img src={tour.headerLogoUrl} alt='logo' />
          </FooterImgWrapper>
        )}
        <div>All tour media are copyright of their respective owners.</div>
      </Container>
    </FooterBottom>
  )
}
export default Footer
