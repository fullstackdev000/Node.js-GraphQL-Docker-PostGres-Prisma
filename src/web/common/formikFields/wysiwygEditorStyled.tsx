import { buttonStyle } from '../buttons/basicButton'
import styled, { css } from '../styled-components'

const linkTextInput = css`
  border: 2px solid${props => props.theme.colors.BORDER};
  border-radius: 5px;
  box-sizing: border-box;
  padding: 5px 10px;
  margin-bottom: 5px;
  height: 32px;
  font-size: 13px;
  &:focus {
    border-color: ${props => props.theme.colors.GREEN};
    outline: none;
  }
`

const buttonSection = css`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 5px;
`

const editorMain = css`
  color: ${props => props.theme.colors.FIELD_TEXT};
  cursor: text;
  font-size: 13px;
`

const editorContent = css`
  min-height: 130px;
  padding: 10px 15px;
`

const embeddedPopup = css`
  &.rdw-embedded-modal {
    height: 200px;

    .rdw-embedded-modal-link-input {
      width: 90%;
    }

    .rdw-embedded-modal-size-input {
      width: 80%;
    }
  }
`

const imagePopup = css`
  &.rdw-image-modal {
    height: 210px;

    .rdw-image-modal-url-input {
      width: 94%;
    }
  }
`

const linkPopup = css`
  &.rdw-link-modal {
    width: 255px;
    height: 225px;

    input[type='checkbox'] {
      width: auto;
    }
  }
`

const EditorWrapper = styled.div<{ focus: boolean }>`
  .rdw-editor-wrapper {
    border: 2px solid;
    border-color: ${props => props.focus ? props.theme.colors.GREEN : props.theme.colors.BORDER};
    border-radius: 5px;
    background-color: white;

    input:not([type='checkbox']) { ${linkTextInput} }
  }

  .rdw-editor-main {
    ${editorMain}

    a, a span[data-text='true'] {
      color: ${props => props.theme.colors.GREEN};
      cursor: pointer;
      &:hover {text-decoration: underline}
    }
    .rdw-link-decorator-wrapper > img {display: none}
  }

  .public-DraftEditor-content {
    ${editorContent}
  }

  .editor-popup {
    [class$="header-option"] {
      width: 100%;
      align-items: flex-start;
    }

    [class$="btn-section"],
    [class$="buttonsection"]  {
      ${buttonSection}
      button:first-child {
        ${props => buttonStyle({ buttonTheme: 'action', full: true, size: 'small', theme: props.theme })}
      }
      button:last-child {
        ${props => buttonStyle({ buttonTheme: 'alert', size: 'small', theme: props.theme })}
      }
    }

    ${embeddedPopup}
    ${linkPopup}
    ${imagePopup}
  }

  .rdw-editor-toolbar {
    div, ul {
      ::-webkit-scrollbar {
        width: 8px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        background: ${props => props.theme.colors.BACKGROUND};
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.colors.GREY};
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: ${props => props.theme.colors.DARKER_GREY};
      }
    }
  }
`

export default EditorWrapper
