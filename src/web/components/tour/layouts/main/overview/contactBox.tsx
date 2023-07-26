import { publicUrls } from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { formatPhoneNumber } from 'react-phone-number-input/input'
import { TourContext } from '../'
import { Tour } from '../../../types'
import ContactModal from '../../common/contactForm'

import { FacebookF, Instagram, LinkedinIn, Pinterest, Twitter } from 'styled-icons/fa-brands'
import { GlobeAmericas } from 'styled-icons/fa-solid'

const Wrapper = styled.div<{ mainColor: string }>`
  h3 {
    width: 100%;
    margin: 15px 0;
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-size: 20px;
    font-weight: 400;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20px;

    h3 {
      padding-bottom: 20px;
      text-align: center;
    }
  }
`

const MiddleHolder = styled.div`
  display: flex;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    display: block;
    text-align: center;
  }
`

const MiddleRightHolder = styled.div`
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    padding-left: 10px
  }
`

const Name = styled.div`
  font-size: 18px;
  padding-bottom: 1px;
`

const DetailsRow = styled.div`
  font-size: 12px;
  padding-bottom: 1px;
  color: ${props => props.theme.colors.DARK_GREY};
`

const Title = styled(DetailsRow)`
  margin-bottom: 7px;
`

const ImageHolder = styled.div`
  flex: 0 0 150px;
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;

  img {
    width: 100%;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    margin: 0 auto 10px;
  }
`

const Links = styled.div`
  padding-bottom: 12px;
  display: flex;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
   justify-content: center;
   padding-top: 18px;
  }
`

const Link = styled.a`
  display: ${props => !props.href ? 'none' : 'inline-flex'};
  width: 30px
  height: 30px;
  margin-right: 4px;
  margin-top: 4px;
  border-radius: 100%;
  justify-content: center;
  align-items: center;
  ${props => !props.href && 'display: none;'}

  svg {
    color: #fff;
  }

  &:hover {
    opacity: 0.8;
  }

`

const FacebookLink = styled(Link)`
  background: ${props => props.theme.colors.FACEBOOK};
`

const WebsiteLink = styled(Link)<{ color: string }>`
  background: ${props => props.color};
`

const LinkedinLink = styled(Link)`
  background: ${props => props.theme.colors.LINKEDIN};
`

const TwitterLink = styled(Link)`
  background: ${props => props.theme.colors.TWITTER};
`

const PinterestLink = styled(Link)`
  background: ${props => props.theme.colors.PINTEREST};
`

const InstagramLink = styled(Link)`
  background: ${props => props.theme.colors.INSTAGRAM};
`

const CustomButton = styled(props => <Button {...props}/>)<{ color: string }>`
  background-color: ${props => props.color} !important;
  border-color: ${props => props.color} !important;

  &:first-child {
    margin-right: 7px;
  }

  &:hover {
    opacity: 0.8;
  }
`

const ContactBoxWrapper = styled.div`
  margin-bottom: 40px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    flex: 0 0 310px;
  }

`

const Buttons = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    text-align: center;
  }

`

interface ContactBoxProps {
  contactPerson: Tour['contactPerson']
}

const ContactBox: FunctionComponent<ContactBoxProps> = ({ contactPerson }) => {
  const mainColor = React.useContext(TourContext).mainColor
  const [ contactFormVisible, toggleContactForm ] = React.useState<boolean>(false)

  return (
    <ContactBoxWrapper>
      <MiddleHolder className='h-card'>
        <ImageHolder className='u-photo'>
            {contactPerson.profilePictureUrl && <img src={contactPerson.profilePictureUrl} alt='profile picture' />}
        </ImageHolder>
        <MiddleRightHolder>
          <Name className='p-name'>{contactPerson.name}</Name>
          <Title className='p-job-title'>
            {contactPerson.title}
          </Title>
          <DetailsRow className='p-org'>{contactPerson.company}</DetailsRow>
          <DetailsRow className='p-tel'>Office: {formatPhoneNumber(contactPerson.officeNumber)}</DetailsRow>
          <DetailsRow className='p-tel'>Mobile: {formatPhoneNumber(contactPerson.mobile)}</DetailsRow>
        </MiddleRightHolder>
      </MiddleHolder>
      <Links>
            <WebsiteLink className='u-url' href={contactPerson.websiteUrl} color={mainColor}>
              <GlobeAmericas size='16' />
            </WebsiteLink>
            <FacebookLink className='u-url' href={contactPerson.facebookUrl}>
              <FacebookF size='18' />
            </FacebookLink>
            <LinkedinLink className='u-url' href={contactPerson.linkedinUrl}>
              <LinkedinIn size='17' />
            </LinkedinLink>
            <TwitterLink className='u-url' href={contactPerson.twitterUrl}>
              <Twitter size='17' />
            </TwitterLink>
            <InstagramLink className='u-url' href={contactPerson.instagramUrl}>
              <Instagram size='17' />
            </InstagramLink>
            <PinterestLink className='u-url' href={contactPerson.pinterestUrl}>
              <Pinterest size='17' />
            </PinterestLink>
      </Links>
      <Buttons>
        <CustomButton color={mainColor} to={`${publicUrls.toursGalleryRoot}/agent/${contactPerson.id}`} label='More properties' buttonTheme='info' full />
        <CustomButton color={mainColor} onClick={() => toggleContactForm(true)} label='Contact Me' buttonTheme='info' full />
      </Buttons>
      <ContactModal modalVisible={contactFormVisible} toggleModal={() => toggleContactForm(false)}/>
    </ContactBoxWrapper>
  )
}

interface ContactProps {
  contactPerson: Tour['contactPerson']
  contactPerson2: Tour['contactPerson2']
}

const Contact: FunctionComponent<ContactProps> = ({ contactPerson, contactPerson2 }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <Wrapper mainColor={mainColor}>
      <h3>Contact</h3>
      <ContactBox contactPerson={contactPerson} />
      {contactPerson2 && <ContactBox contactPerson={contactPerson2} />}
    </Wrapper>
  )
}

export default Contact
