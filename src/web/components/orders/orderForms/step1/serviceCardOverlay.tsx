import Overlay from '#veewme/web/common/overlay'
import * as React from 'react'
import styled from '../../../../common/styled-components'

const StyledOverlayContent = styled.div `
  height: 100%;
  padding: 4px;
`

const StyledOverlayContentHeader = styled.div `
  margin-top: -50px;
  margin-bottom: 30px;
  border-bottom: 2px solid ${p => p.theme.colors.GREY};
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 25px;
  color: ${props => props.theme.colors.ORANGE};
`

const StyledOverlayContentText = styled.div `
  font-weight: 500;
  font-size: 13px;
  color: #000;
`

const StyledOverlay = styled(Overlay) `
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid ${props => props.theme.colors.ORANGE};
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
`

interface ServiceCardOverlayProps {
  onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  onCancelClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  note: string
}

const ServiceCardOverlay: React.FunctionComponent<ServiceCardOverlayProps> = props => (
  <StyledOverlay
    onConfirmClick={props.onConfirmClick}
    onCancelClick={props.onCancelClick}
  >
    <StyledOverlayContent>
      <StyledOverlayContentHeader>
        <p>Note!</p>
      </StyledOverlayContentHeader>
      <StyledOverlayContentText>
        <p>{props.note}</p>
      </StyledOverlayContentText>
    </StyledOverlayContent>
  </StyledOverlay>
)

export default ServiceCardOverlay
