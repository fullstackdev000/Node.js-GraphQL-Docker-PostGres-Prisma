import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'

import { Th } from 'styled-icons/fa-solid'

const StyledShareBtn = styled.div`
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 5px;

  a {
    color: #fff;
  }

  svg {
    margin-right: 5px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    transform: scale(0.9);
  }
`

// TODO consider adding .d.ts file with globals
declare global {
  interface Window { addthis: object }
}

export const ShareBtn: React.FunctionComponent<{
  className?: string
}> = ({
  children,
  className
}) => {
  React.useEffect(() => {
    delete window.addthis
    // TODO add to utils if needed in other components
    const tag = document.createElement('script')
    tag.async = false
    // TODO read pubuid from env constant
    tag.src = 'https://s7.addthis.com/js/300/addthis_widget.js#pubid=mixedmedia'
    document.body.appendChild(tag)

    return () => {
      document.body.removeChild(tag)
    }
  }, [])

  return (
    <StyledShareBtn className={className}>
      <a className='addthis_button_compact'>
        {children}
      </a>
    </StyledShareBtn>
  )
}

const StyledGalleryBtnHolder = styled.div`
  position: absolute;
  bottom: 90px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`

const StyledGalleryBtn = styled(NavLink)`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 5px 10px;
  color: #fff;
  background: rgba(50, 50, 50, 0.55);
  border: 2px solid #fff;
  font-size: 12px;

  &:hover {
    background: rgba(134, 134, 134, 0.67);
  }

  svg {
    margin-right: 5px;
  }
`

interface GalleryBtnRawProps extends RouteComponentProps {
  className?: string
}

const GalleryBtnRaw: React.FunctionComponent<GalleryBtnRawProps> = props => {
  return (
    <StyledGalleryBtnHolder className={props.className}>
      <StyledGalleryBtn to={`${props.match.url}/photos`}>
        <Th size='14' />
        <span>View Full Gallery</span>
      </StyledGalleryBtn>
    </StyledGalleryBtnHolder>
  )
}

export const GalleryBtn = withRouter(GalleryBtnRaw)
