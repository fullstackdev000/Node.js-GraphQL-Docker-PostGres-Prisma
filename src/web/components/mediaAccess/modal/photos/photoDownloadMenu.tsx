import Button from '#veewme/web/common/buttons/basicButton'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'

import * as React from 'react'

import { Download as DownloadIcon } from 'styled-icons/boxicons-regular'

const DownloadMenuWrapper = styled.div`
  display: block;
  position: absolute;
  padding: 0 20px 20px 0;
  top: 15px;
  left: 15px;
`

const arrowSize = '10px'

const DownloadDropdown = styled.div`
  position: absolute;
  padding: 10px 0 8px 0;
  top: 40px;
  left: 0;
  width: 185px;
  border: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
  background: #fff;
  z-index: 10;
  border-radius: 5px;

  &:after,
  &:before {
    position:absolute;
    top: -9px;
    left 5px;
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: ${arrowSize} solid transparent;
    border-right: ${arrowSize} solid transparent;
    border-bottom: ${arrowSize} solid #fff;
    z-index: 1;
  }

  &:before {
    top: -12px;
    left: 3px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid ${props => props.theme.colors.BUTTON_BORDER};
    z-index: 0;
  }
`

const iconSize = '22px'

const StyledButton = styled(props => <Button {...props} />)<{ menuActive: boolean }>`
  display: block;

  &&& {
    background: #fff;
  }

  &&&:hover,
  &&&:active {
    background: #fff;
  }

  svg {
    width: ${iconSize};
    max-width: ${iconSize};
    height: ${iconSize};
    max-height: ${iconSize};
    fill: ${props => props.theme.colors.GREEN};
  }

  ${props => props.menuActive && `

    &&&& {
      background: ${props.theme.colors.GREEN};
      border-color: #fff;

      svg {
        fill: #fff;
      }
    }
  `}
`

const DownloadItem = styled.a`
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  height: 30px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.GREEN};
    color: #fff;

    svg {
      fill: #fff;
    }
  }

  svg {
    position: relative;
    top: -2px;
    fill: ${props => props.theme.colors.GREEN};
  }
`

interface DownloadMenuProps {
  webUrl: string
  printUrl?: string
}

const DownloadMenu: React.FunctionComponent<DownloadMenuProps> = props => {
  const [menuOpen, setMenu] = React.useState(false)

  const toggleMenu = () => setMenu(prev => !prev)

  const handleClick = () => {
    // send request preparing photo for downloading
    log.debug('download click')
    setMenu(false)
  }

  return (
    <DownloadMenuWrapper onMouseLeave={() => setMenu(false)}>
      <StyledButton
        size='medium'
        label=''
        buttonTheme='primary'
        icon={DownloadIcon}
        onClick={() => toggleMenu()}
        menuActive={menuOpen}
      />

      {menuOpen && (
        <DownloadDropdown>
          <DownloadItem onClick={handleClick} href={props.webUrl} target='_blank' download>Download for web <DownloadIcon size='20'/></DownloadItem>
          {
            props.printUrl &&
            <DownloadItem
              onClick={handleClick}
              href={props.printUrl}
              target='_blank'
              download
            >
              Download for print <DownloadIcon size='20'/>
            </DownloadItem>
          }
        </DownloadDropdown>
      )}

    </DownloadMenuWrapper>
  )
}

export default DownloadMenu
