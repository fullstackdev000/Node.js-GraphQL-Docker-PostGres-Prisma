import Button from '#veewme/web/common/buttons/basicButton'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import BarSpinner from '#veewme/web/common/spinners/barSpinner'
import styled from '#veewme/web/common/styled-components'
import copy from 'copy-to-clipboard'
import * as React from 'react'

import { MailOutline as Mail } from 'styled-icons/material'

const ModalContent = styled.div`
  position: relative;
  width: 700px;
  max-width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    width: 840px;
  }
`

const ModalLink = styled.div``

const LinkLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.FIELD_TEXT};
  margin: 17px 0 10px 0;
`

const Url = styled.span`
`

const UrlHolder = styled.div`
  display: flex;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};

  ${Url} {
    padding: 3px 15px;
    border-radius: 5px;
    border: 2px solid ${props => props.theme.colors.BORDER};
    flex: 1 0 auto;
    line-height: 22px;

    a {
      color: ${props => props.theme.colors.LABEL_TEXT};
    }
  }
`

const Buttons = styled.div`
  width: 130px;
  margin-left: -130px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    flex: 0 0 100px;
    margin: -1px;
    border-color: ${props => props.theme.colors.GREEN};
  }

  svg {
    fill: ${props => props.theme.colors.GREEN};
    transition: opacity .5s;

    &:hover {
      opacity: 0.8;
    }
  }
`

const ProcessingHint = styled.span`
  margin-right: 10px;
`

const ProcessingBar = styled.div`
  display: flex;
  font-size: 10px;
  align-items: center;
`

export interface ListItem {
  label: string
  url: string
  status?: 'Ready' | 'InProgress'
}

interface TourLinkProps {
  link: ListItem
}

const TourLink: React.FunctionComponent<TourLinkProps> = props => {
  const body = encodeURIComponent(`${props.link.label}: ${props.link.url}`)
  const subject = encodeURIComponent(props.link.label)
  const href = `mailto:?subject=${subject}&body=${body}`
  const timer = React.useRef<number>()
  log.debug('Decoded mailto href: ', decodeURIComponent(href))

  const handleCopy = () => {
    copy(props.link.url)
    setCopied(true)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  const [copied, setCopied] = React.useState(false)

  return (
    <ModalLink>
      <LinkLabel>
        {props.link.label}
      </LinkLabel>
      {
        (!props.link.status || props.link.status === 'Ready') && (
          <UrlHolder>
            <Url><a href={props.link.url} target='_blank'>{props.link.url}</a></Url>
            <Buttons>
              <a
                href={href}
              >
                <Mail size={22} />
              </a>
              <Button
                buttonTheme={copied ? 'primary' : 'action'}
                full={copied}
                size='medium'
                label={copied ? 'Copied' : 'Copy'}
                onClick={handleCopy}
              />
            </Buttons>
          </UrlHolder>
        )
      }
      {
        (props.link.status && props.link.status === 'InProgress') && (
          <UrlHolder>
            <Url>
              <ProcessingBar>
                <ProcessingHint>Please wait </ProcessingHint>
                <BarSpinner />
              </ProcessingBar>
            </Url>
          </UrlHolder>
        )
      }

    </ModalLink>
  )
}

interface TourLinksModalProps {
  isOpen: boolean
  close: () => void
  title: string
  items: ListItem[]
}

const TourLinksModal: React.FunctionComponent<TourLinksModalProps> = props => {
  return (
    <Modal isOpen={props.isOpen} onRequestClose={props.close} title={props.title}>
      <ModalContent>
        {props.items.map((link, i) => <TourLink key={i} link={link} />)}
      </ModalContent>
    </Modal>
  )
}

export default TourLinksModal
