
import Article from '#veewme/web/common/article'
import styled from '#veewme/web/common/styled-components'
import { wrapLinkUrl } from '#veewme/web/common/util'
import React, { FunctionComponent } from 'react'
import { formatPhoneNumber } from 'react-phone-number-input/input'
import { Gallery } from './types'

import Mail from '#veewme/web/assets/svg/mail.svg'
import { Mobile } from 'styled-icons/boxicons-regular'
import { Phone } from 'styled-icons/boxicons-solid'
import { FacebookF, Instagram, LinkedinIn, Pinterest, Twitter } from 'styled-icons/fa-brands'
import { GlobeAmericas } from 'styled-icons/fa-solid'

export const SidebarWrapper = styled.div<{
  mobileView?: boolean
}>`
  width: ${({ mobileView }) => mobileView ? '100%' : '250px'};
  ${({ mobileView }) => !mobileView ? 'padding: 0 20px 50px 20px' : 'padding: 0 25px 0 0'};
  ${({ mobileView }) => mobileView && 'margin-top: 70px'};
  background: #fff;
  z-index: 10;
  min-height: 300px;
  color:  ${props => props.theme.colors.DARK_GREY};
`

const Image = styled.img`
  display: block;
  margin: -60px auto 0 auto;
  width: 120px;
  height: 120px;
  border: 3px solid #fff;
  border-radius: 100%;
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
  background: #000;
  border: 2px solid ${props => props.theme.colors.DARKER_GREY};

  &:last-child {
    margin-right: 0;
  }

  svg {
    color: ${props => props.theme.colors.BACKGROUND};
    fill: ${props => props.theme.colors.BACKGROUND};
  }

  &:hover {
    opacity: 0.8;
  }

`

const Links = styled.div`
  display: flex;
  margin-bottom: 25px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 5px 0 15px 0;
  border-bottom: 2px solid ${props => props.theme.colors.DARKER_GREY};
`

const LinksBottom = styled(Links)`
  justify-content: space-between;
  width: 80px;
  border-radius: 50px;
  padding: 5px 7px 15px;
  margin: -25px auto 0 auto;
  border-bottom: 0 none;
  background: #fff;

  ${Link} {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin-right: 0;

    svg {
      color: ${props => props.theme.colors.DARK_GREY};
      fill: ${props => props.theme.colors.DARK_GREY};
    }
  }
`

const TextLine = styled.p<{
  fontSize?: number
  bold?: boolean
  topSpace?: boolean
}>`
  font-size: ${props => props.fontSize ? `${props.fontSize}px` : '20px'};
  font-weight: ${props => props.bold ? '500' : '400'};
  margin: 5px 0;
  ${props => props.topSpace && 'margin-top: 20px;'}
`

const StyledArticle = styled(Article)`
  font-size: 13px
  margin: 5px 0;
`

const Phones = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;
  border-bottom: 2px solid ${props => props.theme.colors.DARKER_GREY};
`

const PhoneLine = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  font-size: 18px;
  font-weight: 500;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    justify-content: center;
  }
`

const PhoneIconWrapper = styled.span`
  display: inline-flex;
  width: 27px;
  height: 27px;
  margin-right: 15px;
  border-radius: 100%;
  background: #fff;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: 2px solid ${props => props.theme.colors.DARKER_GREY};

  svg {
    color: ${props => props.theme.colors.DARK_GREY};
    fill: ${props => props.theme.colors.DARK_GREY};
  }
`

const Id = styled.div`
  font-size: 13px;
  margin: 10px 0 0 0;
  text-align: center;
  opacity: 0.7;
  font-weight: 500;

`

interface SidebarProps {
  data: Gallery['contact']
  mobileView?: boolean
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  data,
  mobileView
}) => {
  return (
    <SidebarWrapper mobileView={mobileView}>
      {data.imageUrl && <Image src={data.imageUrl}/>}
      <Id>
        CALBRE# {data.id}
      </Id>
      <Links>
        <Link className='u-url' href={wrapLinkUrl(data.facebookUrl)}>
          <FacebookF size='18' />
        </Link>
        <Link className='u-url' href={wrapLinkUrl(data.linkedinUrl)}>
          <LinkedinIn size='17' />
        </Link>
        <Link className='u-url' href={wrapLinkUrl(data.twitterUrl)}>
          <Twitter size='17' />
        </Link>
        <Link className='u-url' href={wrapLinkUrl(data.instagramUrl)}>
          <Instagram size='17' />
        </Link>
        <Link className='u-url' href={wrapLinkUrl(data.pinterestUrl)}>
          <Pinterest size='17' />
        </Link>
      </Links>
      <div>
        <TextLine bold fontSize={15}>
          {data.name}
        </TextLine>
        <TextLine fontSize={13}>
          {data.title}
        </TextLine>
        <TextLine bold topSpace fontSize={15}>
          {data.company}
        </TextLine>
        <Phones>
        {data.phone && (
            <PhoneLine>
              <PhoneIconWrapper>
                <Phone size='20' />
              </PhoneIconWrapper>
              {formatPhoneNumber(data.phone)}
            </PhoneLine>
          )}
          {data.mobile && (
            <PhoneLine>
            <PhoneIconWrapper>
              <Mobile size='20' />
            </PhoneIconWrapper>
            {formatPhoneNumber(data.mobile)}
          </PhoneLine>
          )}
        </Phones>
        <LinksBottom>
          <Link className='u-url' href={`mailto:${data.email}`}>
            <Mail width='16' />
          </Link>
          <Link className='u-url' href={wrapLinkUrl(data.websiteUrl)}>
            <GlobeAmericas size='16' />
          </Link>
        </LinksBottom>
        {
          data.bio && (
            <StyledArticle content={data.bio} />
          )
        }
        {
          data.description && (
            <StyledArticle content={data.description} />
          )
        }
      </div>
    </SidebarWrapper>
  )
}
export default Sidebar
