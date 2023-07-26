import { nameof } from '#veewme/lib/util'
import Input from '#veewme/web/common/formikFields/inputField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { Facebook, Instagram, Linkedin, Twitter } from 'styled-icons/boxicons-logos'
import { SocialPinterest } from 'styled-icons/typicons'
import { SocialMedia, SocialMediaValues } from './valuesInterfaces'

const StyledPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const IconWrapper = styled.div`
  height: 20px;
  width: 32px;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${props => props.theme.colors.BORDER};
`

const MediaFacebook = styled(Facebook)`
  width: 17px;
  fill: ${props => props.theme.colors.FACEBOOK};
`
const MediaInstagram = styled(Instagram)`
  width: 15px;
  fill: ${props => props.theme.colors.INSTAGRAM};
`
const MediaLinkedin = styled(Linkedin)`
  width: 13px;
  fill: ${props => props.theme.colors.LINKEDIN};
`
const MediaTwitter = styled(Twitter)`
  width: 13px;
  fill: ${props => props.theme.colors.TWITTER};
`
const MediaPinterest = styled(SocialPinterest)`
  width: 17px;
  fill: ${props => props.theme.colors.PINTEREST};
`

const MediaInput = styled(Input)`
  width: 100%;
`

const SocialMedia: React.FunctionComponent<{}> = () => {
  return (
    <StyledPanel
      heading='Social Media'
      id='socialMedia'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text='Social media links to appear on agent property sites / tours and gallery.'
        />
      }
    >
      <Field
        label='Facebook:'
        name={`${nameof<SocialMediaValues>('socialMedia')}.${nameof<SocialMedia>('facebookLink')}`}
        component={MediaInput}
        placeholder='Link...'
        leftComponent={<IconWrapper><MediaFacebook /></IconWrapper>}
      />
      <Field
        label='Twitter:'
        name={`${nameof<SocialMediaValues>('socialMedia')}.${nameof<SocialMedia>('twitterLink')}`}
        component={MediaInput}
        placeholder='Link...'
        leftComponent={<IconWrapper><MediaTwitter /></IconWrapper>}
      />
      <Field
        label='LinkedIn:'
        name={`${nameof<SocialMediaValues>('socialMedia')}.${nameof<SocialMedia>('linkedinLink')}`}
        component={MediaInput}
        placeholder='Link...'
        leftComponent={<IconWrapper><MediaLinkedin /></IconWrapper>}
      />
      <Field
        label='Instagram:'
        name={`${nameof<SocialMediaValues>('socialMedia')}.${nameof<SocialMedia>('instagramLink')}`}
        component={MediaInput}
        placeholder='Link...'
        leftComponent={<IconWrapper><MediaInstagram /></IconWrapper>}
      />
      <Field
        label='Pinterest:'
        name={`${nameof<SocialMediaValues>('socialMedia')}.${nameof<SocialMedia>('pinterestLink')}`}
        component={MediaInput}
        placeholder='Link...'
        leftComponent={<IconWrapper><MediaPinterest /></IconWrapper>}
      />
    </StyledPanel>
  )
}

export default SocialMedia
