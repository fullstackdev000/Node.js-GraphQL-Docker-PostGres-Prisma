import XSvg from '#veewme/web/assets/svg/x.svg'
import BasicButton from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledOverlay = styled.div `
  position: absolute;
  z-index: 200;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const StyledHeader = styled.header `
  display: flex;
  justify-content: flex-end;
  padding: 12px;

  button {
    border: 0 none;
  }
`

const StyledFooter = styled.footer `
  padding: 12px;
  display: flex;
  justify-content: flex-end;
`

const StyledContent = styled.div `
  flex: 1;
  padding: 12px;
`

const StyledOkButton = styled(props => <BasicButton {...props} />)`
  color: white;
`

interface OverlayProps {
  className?: string
  onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Overlay: React.FunctionComponent<OverlayProps> = props => (
  <StyledOverlay className={props.className}>
    <StyledHeader>
      <BasicButton buttonTheme='alert' icon={XSvg} onClick={props.onCancelClick}/>
    </StyledHeader>
    <StyledContent>
      {props.children}
    </StyledContent>
    <StyledFooter>
      <StyledOkButton label='Got It' buttonTheme='action' full onClick={props.onConfirmClick}/>
    </StyledFooter>
  </StyledOverlay>
)

export default Overlay
