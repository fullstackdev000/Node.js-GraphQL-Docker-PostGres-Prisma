import { FieldProps } from 'formik'
import * as React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import styled from '../styled-components'
import WysiwygContainer from './wysiwygEditorStyled'

const StyledOneLineWysiwygContainer = styled(WysiwygContainer) `
  .rdw-editor-wrapper {
    display: flex;
    .rdw-editor-toolbar {
      width: unset;
      border-left: 1px solid ${props => props.focus ? props.theme.colors.GREEN : props.theme.colors.BORDER};
    }
    .rdw-editor-main {
      flex: 1;
      order: -1;
      border: none;
      .public-DraftEditor-content {
        padding: 5px 15px;
        min-height: 30px;
        & div {
          & div {
            margin: 0;
          }
        }
      }
    }
  }
  .rdw-colorpicker-modal {
    position: absolute;
    right: 0;
    top: 30px;
    background-color: white;
    padding: 16px;
    border: 1px solid ${props => props.theme.colors.BORDER};
    z-index: 1;
    .rdw-colorpicker-modal-options {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    .rdw-colorpicker-cube {
      width: 100%;
      height: 100%;
    }
  }
`

interface CustomEditorProps {
  name: string
  label: string
  className?: string
  toolbarCustomButtons: JSX.Element[]
}

type OneLineWysiwygEditorProps = CustomEditorProps & FieldProps

interface OneLineWysiwygEditorState {
  focus: boolean
}

class OneLineWysiwygEditor extends React.PureComponent<OneLineWysiwygEditorProps, OneLineWysiwygEditorState> {
  static defaultProps = {
    toolbarCustomButtons: []
  }

  state: OneLineWysiwygEditorState = {
    focus: false
  }

  render () {
    return (
      <StyledOneLineWysiwygContainer id={this.props.field.name} focus={this.state.focus} className={this.props.className}>
        <label>{this.props.label}</label>
        <Editor
          editorState={this.props.field.value}
          onEditorStateChange={editorState => {
            this.props.form.setFieldValue(this.props.field.name, editorState)
          }}
          toolbar={{
            colorPicker: {
              colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
              inDropdown: true
            },
            history: { inDropdown: false },
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline']
            },
            link: { inDropdown: true },
            list: {
              inDropdown: false,
              options: ['unordered', 'ordered']
            },
            options: [
              'inline',
              'colorPicker'
            ]
          }}
          onFocus={() => { this.setState({ focus: true }) }}
          onBlur={() => { this.setState({ focus: false }) }}
          toolbarCustomButtons={this.props.toolbarCustomButtons}
          stripPastedStyles
        />
      </StyledOneLineWysiwygContainer>
    )
  }
}

export default OneLineWysiwygEditor
