import TextareaField from '#veewme/web/common/formikFields/textareaField'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const Wrapper = styled.div<{
  showHint?: boolean
}>`
  position: relative;

  textarea {
    transition: background .5s;

    ${props => props.showHint && `
      background: ${props.theme.colors.ALERT};
      border-color: ${props.theme.colors.ALERT};

      &::placeholder {
        color: #fff;
        opacity: 1;
      }
  `}
  }
`

const Hint = styled.div<{
  showHint?: boolean
}>`
  width: 315px;
  position: absolute;
  top: 38px;
  bottom: 25px;
  display: flex;
  align-items: center;
  right: 15px;
  color: #fff;
  transition: opacity .5s, visibility .5s;
  visibility: ${props => props.showHint ? 'visible' : 'hidden'};
  opacity: ${props => props.showHint ? 1 : 0};
  font-style: italic;
`

type TextareaProps = React.ComponentProps<typeof TextareaField>

export const TextareaWithHint: React.FC<TextareaProps> = props => {
  const showHint = !props.field.value
  return (
    <Wrapper showHint={showHint}>
      <TextareaField {...props} />
      <Hint showHint={showHint}>
        Notes for photographer are helpful in <br/>
        making sure nothing is missed and <br/>
        the job is done to your satisfaction
      </Hint>
    </Wrapper>
  )
}
export default TextareaWithHint
