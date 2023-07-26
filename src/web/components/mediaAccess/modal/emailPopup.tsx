import { itemShadow } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import { contentType, FormValues as EmailFormValues, MediaEmailForm } from '#veewme/web/components/media/mediaEmailModal'
import * as React from 'react'

const EmailPopupStyled = styled.div`
  padding: 50px 35px 0 35px;

  h3 {
    padding-bottom: 20px;
    padding-right: 15px;
    margin-bottom: 30px;
    font-weight: 400;
    font-size: 19px;
    color: ${props => props.theme.colors.FIELD_TEXT};
    border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  }
`
const popupWidth = 490
const modalPadding = 44
const shadowWidth = 20

const EmailPopupWrapper = styled.div<{
  visible: boolean
}>`
  position: absolute;
  top: -90px;
  right: ${props => props.visible ? `-${modalPadding}px` : `-${modalPadding + popupWidth + shadowWidth}px`};
  bottom: -30px;
  overflow: hidden;
  width: ${popupWidth}px;
  border-radius: 8px;
  z-index: 10;
  transition: right .5s;
  background: #fff;
  ${itemShadow};
`

const CloseBtn = styled.span`
  position: absolute;
  top: 11px;
  left: 12px;
  width: 24px;
  height: 24px;
  background: transparent;
  font-size: 42px;
  font-weight: 300;
  line-height: 25px;
  text-align: center;
  border: 0 none;
  color: ${props => props.theme.colors.LABEL_TEXT};
  cursor: pointer;

  &:focus,
  &:active {
    outline: 0 none;
  }

  &:hover {
    opacity: 0.8;
  }
`

interface EmailPopupProps {
  setVisibility: (visible: boolean) => void
  onSubmit: (values: EmailFormValues) => void
  visible: boolean
  contentType?: contentType
}

const EmailPopup: React.FunctionComponent<EmailPopupProps> = props => {
  return (
    <EmailPopupWrapper visible={props.visible}>
      <EmailPopupStyled>
        <CloseBtn
          onClick={() => props.setVisibility(false)}
        >
          &times;
        </CloseBtn>
        <h3>Include in email</h3>
        <MediaEmailForm
          hideTypeSection
          contentType={props.contentType}
          onSubmit={vals => {
            props.onSubmit(vals)
            props.setVisibility(false)
          }}
        />
      </EmailPopupStyled>
    </EmailPopupWrapper>
  )
}

export default EmailPopup
