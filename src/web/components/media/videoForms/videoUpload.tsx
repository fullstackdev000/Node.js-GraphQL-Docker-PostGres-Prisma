import Button from '#veewme/web/common/buttons/basicButton'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { guidGenerator } from '#veewme/web/common/util'
import PubSub from 'pubsub-js'
import * as React from 'react'
import { FilePondErrorDescription, FilepondFile } from 'react-filepond'

import Uploader from '../uploader'
import { AddHostedVideoViewProps } from './hostedVideoForm'

import {
  UploadRealEstatePhotoProgressSubscription
} from '#veewme/gen/graphqlTypes'
import { NoNullableFields } from '#veewme/web/common/util'

const StyledPanel = styled(Panel)`
  margin-top: 20px;
`

const RemoveVideoBtn = styled.span`
  height: 20px;
  font-size: 40px;
  line-height: 20px;
  color: ${props => props.theme.colors.ALERT};
  cursor: pointer;
  align-self: flex-end;
`

const VideoTitle = styled.div`
  display: flex;
  border: 2px solid ${props => props.theme.colors.BORDER};
  border-radius: 5px;
  padding: 8px 12px;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 15px;

  h4 {
    font-weight: 500;
    font-size: 16px;
  }

  div {
    width: 100%;
    margin-top: 3px;
    display: inline-block;
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-weight: 500;
    font-size: 14px;
  }
`

const SubmitBtnHolder = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const subscriptionTopicName = 'videoUploadProgress'

export interface UploadProgressData {
  uploadRealEstatePhotoProgress: NoNullableFields<UploadRealEstatePhotoProgressSubscription['uploadRealEstatePhotoProgress']>
}

interface UploadVideoProps extends AddHostedVideoViewProps {}

class UploadVideo extends React.Component<UploadVideoProps, {}> {
  uploaderRef = React.createRef<Uploader>()

  moveDroppedFileToForm = (file: FilepondFile) => {
    this.uploaderRef.current && this.uploaderRef.current.removeFile(file.id)
    this.props.setFieldValue('file', file.file)
  }

  startFileUploadAndFormSubmission = () => {
    const fileItem = this.props.values.file
    fileItem && this.uploaderRef.current && this.uploaderRef.current.addFile(fileItem, { edited: true })
    log.debug('Form submission and video upload started')
  }

  handleAddFile = (error: FilePondErrorDescription, file: FilepondFile) => {
    if (error) {
      return
    }
    // if 'edited' metadata prop exists it means that item has been already edited and should be uploaded to server
    // Otherwise, file has been just dropped and should be just shown on items list where can be edited
    const fileMetadata = file.getMetadata('edited')
    if (fileMetadata) {
      this.uploaderRef.current && this.uploaderRef.current.startUploadingFile(file.id)
      return
    }

    // delay removing file from filepond to avoid items 'flickering'
    setTimeout(() => {
      this.moveDroppedFileToForm(file)
    }, 500)
  }

  render () {
    return (
      <StyledPanel>
        <Uploader
          allowMultiple={false}
          ref={this.uploaderRef}
          instantUpload={false}
          acceptedFileTypes={['video/mp4', 'video/quicktime']}
          onaddfile={this.handleAddFile}
          server={{
            process: (_fieldName, _file, _metadata, load, error, progress, abort) => {
              // For more 'extended' example of process method see '../photos/photos'

              const id = guidGenerator()

              this.props.onSubmit({
                ...this.props.values,
                photoIdentification: id
              })
              .then(() => {
                load()
              })
              .catch(e => error(e))

              PubSub.subscribe(subscriptionTopicName, (msg: string, progressData: UploadProgressData) => {
                const data = progressData.uploadRealEstatePhotoProgress
                if (data && data.photoIdentification === id) {
                  progress(true, data.progress, 100)
                }
              })

              return {
                abort: () => {
                  abort()
                }
              }
            },
            revert: null
          }}
        />
        <div>
          {this.props.values.file && (
            <>
              <VideoTitle>
                <h4>
                  {this.props.values.file && this.props.values.file.name}
                </h4>
                <RemoveVideoBtn onClick={() => this.props.setFieldValue('file', undefined)}>&times;</RemoveVideoBtn>
                <div>{this.props.values.file && (this.props.values.file.size / (1024 ** 2)).toFixed(2)} MB</div>
              </VideoTitle>
              <SubmitBtnHolder>
                <Button buttonTheme='action' full label='Start upload' size='small' onClick={() => this.startFileUploadAndFormSubmission()}/>
              </SubmitBtnHolder>
            </>
          )}
        </div>
      </StyledPanel>
    )
  }
}

export default UploadVideo
