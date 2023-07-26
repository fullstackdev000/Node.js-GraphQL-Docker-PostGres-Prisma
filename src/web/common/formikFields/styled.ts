import styled from '../styled-components'

export const Label = styled.label<{ error?: boolean}>`
  width: 100%;
  flex: 1 0 auto;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  margin: 13px 0 8px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

export const fieldBottomMargin = `14px`

export const ValidationError = styled.span<{ show?: boolean }>`
  position: absolute;
  left: 0;
  bottom: -3px;
  color: ${props => props.theme.colors.ALERT};
  font-size: 11px;
  height: 13px;
  text-indent: ${props => props.show ? 0 : '-100%'}
  transition: text-indent .2s;
  overflow: hidden;
  font-weight: 500;
`
