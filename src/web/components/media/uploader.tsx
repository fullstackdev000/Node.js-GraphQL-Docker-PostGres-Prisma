import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { FilePond, FilepondFile, FilepondFileProps, FilePondProps, FileStatus, registerPlugin } from 'react-filepond'
import styled from '../../common/styled-components'

import 'filepond/dist/filepond.min.css'

import { CloudUpload } from 'styled-icons/boxicons-solid'

registerPlugin(FilePondPluginFileValidateType)

const UploaderWrapper = styled.div<{ multicolumn?: boolean }>`
  margin-bottom: 35px;
  margin-right: 1px;

  .filepond {
    &--drop-label {
      min-height: 30px !important;
      position: absolute;
      top: 35px;

      svg {
        opacity: 0.6;
      }
    }

    &--label-action {
      position: absolute;
      width: 100%;
      height: 100px;
      left: 0;
      top: -40px;
      outline: 0 none;
    }

    &--root {
        min-height: 100px;
        background:  ${props => props.theme.colors.DROPZONE};
        border: 1px dashed ${props => props.theme.colors.BORDER};
        border-radius: 10px;
        transition: height .3s;
        margin-bottom: 0;
    }

    &--panel-root {
      background:  ${props => props.theme.colors.DROPZONE};
    }

    &--drop-label label {
      font-weight: 500;
      cursor: pointer;
    }

    &--file-status-sub,
    &--file-info-sub {
      opacity: 0.8 !important;
    }

    &--action-abort-item-processing {
      pointer-events: none;
    }
  }

  ${props => props.multicolumn && `
    @media (min-width: ${props.theme.breakpoints.BREAKPOINT_LG}) {
      .filepond--item {
          width: calc(50% - .5em);
      }
    }

    @media (min-width: ${props.theme.breakpoints.BREAKPOINT_XL}) {
      .filepond--item {
          width: calc(33.33% - .5em);
      }
    }

    @media (min-width: ${props.theme.breakpoints.BREAKPOINT_XXL}) {
      .filepond--item {
          width: calc(25% - .5em);
      }
    }

    @media (min-width: ${props.theme.breakpoints.BREAKPOINT_FHD}) {
      .filepond--item {
          width: calc(20% - .5em);
      }
    }
  `}

  [data-filepond-item-state=processing-complete] .filepond--item-panel {
    background: ${props => props.theme.colors.GREEN};
  }

  [data-filepond-item-state*='error'] .filepond--item-panel,
  [data-filepond-item-state*='invalid'] .filepond--item-panel {
    background-color: ${props => props.theme.colors.ALERT};
  }
`

class Uploader extends React.Component<FilePondProps> {
  filepondRef = React.createRef<FilePond>()

  removeFile = (id: FilepondFile['id']) => {
    this.filepondRef.current && this.filepondRef.current.removeFile(id)
  }

  addFile = (file: File, metadata: FilepondFileProps['metadata']) => {
    this.filepondRef.current && this.filepondRef.current.addFile(file, { metadata })
  }

  startUploadingFile = (id: FilepondFile['id']) => {
    this.filepondRef.current && this.filepondRef.current.processFile(id)
  }

  render () {

    return (
      <UploaderWrapper>
        <FilePond
          ref={this.filepondRef}
          allowMultiple={true}
          labelIdle={`${renderToString(<CloudUpload size='70' />)} <span class="filepond--label-action"> </span>`}
          labelButtonRemoveItem='Close'
          labelTapToUndo='Click to close'
          labelTapToCancel=''
          labelFileProcessingError={error => error.body}
          onprocessfile={(_error, file) => {
            if (file.status === FileStatus.PROCESSING_COMPLETE) {
              this.removeFile(file.id)
            }
          }}
          {...this.props}
        />
      </UploaderWrapper>
    )
  }
}

export default Uploader
