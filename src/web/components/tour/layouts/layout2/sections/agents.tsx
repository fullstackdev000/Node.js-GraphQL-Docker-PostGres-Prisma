// import { publicUrls } from '#veewme/lib/urls'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import { PhoneLink } from '#veewme/web/common/ui-helpers'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { ContactPerson, Tour } from '../../../types'
import ContactModal from '../../common/contactForm'
import { Container, SectionTitle } from '../styled'

import { Mobile } from 'styled-icons/boxicons-regular'
import { Phone } from 'styled-icons/boxicons-solid'
import { Play } from 'styled-icons/fa-solid'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding-bottom: 50px;
`

const Holder = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const AgentBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 300px;
  height: 180px;
  padding: 15px 38px 15px 0;
  margin-left: 100px;
  margin-bottom: 30px;
  background: #fff;
  box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.6);

`

const MiddleRightHolder = styled.div`
  flex-grow: 1;
  align-self: flex-start;
  margin-left: 25px;
`

const Name = styled.div`
  font-size: 17px;
  font-weight: 600;
  padding-bottom: 1px;
`

const DetailsRow = styled.div<{
  biggerFont?: boolean
}>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 190px;
  font-size: ${p => p.biggerFont ? 15 : 12}px;
  padding-bottom: 1px;
  color: ${props => props.theme.colors.LAYOUT_2_FONT};

  a {
    color: ${props => props.theme.colors.LAYOUT_2_FONT};
  }
`

const DetailsRowPhone = styled(DetailsRow)`
  display: flex;
  align-items: center;
  margin: 5px 0;
  font-size: 15px;

  svg {
    margin-right: 5px;
  }
`

const ImageHolder = styled.div`
  flex: 0 0 110px;
  height: 110px;
  padding: 3px;
  position: relative;
  margin-left: -65px;
  background: #fff;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.6);

  img {
    width: 100%;
  }
`

const ButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 35px;

`

const VideoStyled = styled.video`
  width: 900px;
  max-width: 100%;
`

const PlayButton = styled.div<{ mainColor: string }>`
  align-self: flex-start;
  padding: 5px;
  border: 2px solid ${props => props.mainColor};
  border-radius: 100%;
  cursor: pointer;
  transition: transform .5s;

  &:hover {
    transform: scale(1.2);
  }

  svg {
    position: relative;
    left: 2px;
    top: 1px;
    color: ${props => props.mainColor};
  }
`

const Bre = styled(DetailsRow)`
  position: absolute;
  bottom: 7px;
  left: 120px;
  margin-left: -20px;
  text-align: center;
`

const ContactBtn = styled.div<{ mainColor: string }>`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 30px;
  background: ${props => props.mainColor};
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    bottom: -10px;
    left: 2px;
    font-size: 20px;
    transform: rotate(-90deg);
    transform-origin: 0 0;
    color: #fff;
    transition: bottom .5s;
  }

  &:hover {
    span {
      bottom: 15px;
    }
  }
`

const TooltipContent = styled.div`
  padding: 5px;
  text-align: center;
  font-size: 14px;

  span {
    display: block;
    margin-top: 2px;
    font-size: 16px;
    font-weight: 600;

  }

`

const ContactDataBox = styled.div`
  margin-top: 15px;
`

interface ContactBoxProps {
  contactPerson: ContactPerson
}

const ContactBox: FunctionComponent<ContactBoxProps> = ({ contactPerson }) => {
  const mainColor = React.useContext(TourContext).mainColor
  const [videoModalVisible, setVideoModal] = React.useState(false)
  const [ contactFormVisible, toggleContactForm ] = React.useState<boolean>(false)

  return (
    <>
      <AgentBox className='h-card'>
        <ImageHolder className='u-photo'>
            {contactPerson.profilePictureUrl && <img src={contactPerson.profilePictureUrl} alt='profile picture' />}
        </ImageHolder>
        <MiddleRightHolder>
          <Name className='p-name'>{contactPerson.name}</Name>
          <DetailsRow
            className='p-org'
            biggerFont
          >
              {contactPerson.company}
          </DetailsRow>
          <ContactDataBox>
            {
              contactPerson.officeNumber && (
                <DetailsRowPhone className='p-tel'>
                  <Phone size='20' /> <PhoneLink value={contactPerson.officeNumber} />
                </DetailsRowPhone>
              )
            }
            {
              contactPerson.mobile && (
                <DetailsRowPhone className='p-tel'>
                  <Mobile size='20' /> <PhoneLink value={contactPerson.mobile} />
                </DetailsRowPhone>
              )
            }
            <DetailsRow className='u-email'>
              <a href={`mailto:${contactPerson.email}`}>{contactPerson.email}</a>
            </DetailsRow>
          </ContactDataBox>
          <ButtonHolder>
            {contactPerson.profileUrl && (
              <Tooltipped
                tooltip={<TooltipContent>Let's get to know each other.<span>View my Video bio!</span></TooltipContent>}
                position='bottom'
                delayShow={500}
              >
                <PlayButton
                  mainColor={mainColor}
                  onClick={() => setVideoModal(true)}
                >
                  <Play size='20' />
                </PlayButton>
              </Tooltipped>
            )}
          </ButtonHolder>
          <Bre>BRE# 123456789</Bre>
        </MiddleRightHolder>
        <ContactBtn
          mainColor={mainColor}
          onClick={() => toggleContactForm(true)}
        >
          <span>Contact</span>
        </ContactBtn>
      </AgentBox>
      <ContactModal modalVisible={contactFormVisible} toggleModal={() => toggleContactForm(false)}/>
      <Modal
        centerVertically
        isOpen={videoModalVisible}
        onRequestClose={() => setVideoModal(false)}
        title={contactPerson.name}
      >
        <VideoStyled
          controls
          preload='auto'
          src={contactPerson.profileUrl}
        />
      </Modal>
    </>
  )
}

interface AgentsProps {
  contactPerson: Tour['contactPerson']
  contactPerson2: Tour['contactPerson2']
}

const Agents: FunctionComponent<AgentsProps> = ({ contactPerson, contactPerson2 }) => {
  const mainColor = React.useContext(TourContext).mainColor

  return (
    <Wrapper mainColor={mainColor} id='contact'>
      <SectionTitle mainColor={mainColor}>Presented by</SectionTitle>
      <Holder>
        <ContactBox contactPerson={contactPerson} />
        {contactPerson2 && <ContactBox contactPerson={contactPerson2} />}
      </Holder>
    </Wrapper>
  )
}
export default Agents
