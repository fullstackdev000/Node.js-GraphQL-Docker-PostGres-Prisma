import { FieldProps } from 'formik'
import * as React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { Label } from './styled'
import WysiwygContainer from './wysiwygEditorStyled'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

interface WysiwygEditorState {
  focus: boolean
}

interface CustomEditorProps {
  name: string
  label: string
  className?: string
  toolbarCustomButtons: JSX.Element[]
}

type WysiwygEditorProps = CustomEditorProps & FieldProps

class WysiwygEditor extends React.PureComponent<WysiwygEditorProps, WysiwygEditorState> {
  static defaultProps = {
    toolbarCustomButtons: []
  }

  constructor (props: WysiwygEditorProps) {
    super(props)
    this.state = {
      focus: false
    }
  }

  render () {
    return (
      <WysiwygContainer id={this.props.field.name} focus={this.state.focus} className={this.props.className}>
        <Label>{this.props.label}</Label>
        <Editor
          editorState={this.props.field.value}
          onEditorStateChange={editorState => {
            this.props.form.setFieldValue(this.props.field.name, editorState)
            this.props.form.setFieldTouched(this.props.field.name)
          }}
          toolbar={{
            embedded: {
              className: 'editor-wrapper',
              popupClassName: 'editor-popup'
            },
            fontSize: {
              className: 'font-size-wrapper',
              dropdownClassName: 'font-size-dropdown',
              options: [11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 68, 72]
            },
            history: { inDropdown: false },
            image: {
              popupClassName: 'editor-popup'
            },
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline']
            },
            link: {
              inDropdown: false,
              popupClassName: 'editor-popup'
            },
            list: {
              inDropdown: false,
              options: ['unordered', 'ordered']
            },
            options: [
              'fontSize',
              'history',
              'inline',
              'textAlign',
              'list',
              'link',
              'embedded',
              'image',
              'emoji'
            ],
            textAlign: {
              options: ['left', 'center', 'right', 'justify']
            }
          }}
          onFocus={() => { this.setState({ focus: true }) }}
          onBlur={() => { this.setState({ focus: false }) }}
          toolbarCustomButtons={this.props.toolbarCustomButtons}
          stripPastedStyles
        />
      </WysiwygContainer>
    )
  }
}

export default WysiwygEditor
