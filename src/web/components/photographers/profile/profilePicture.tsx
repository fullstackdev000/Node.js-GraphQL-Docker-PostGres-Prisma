import { nameof } from '#veewme/lib/util'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import { Field } from 'formik'
import * as React from 'react'
import Panel from '../../../common/panel'
import { Photographer } from '../common/types'

const ProfilePicture: React.FunctionComponent<{}> = () => {
  return (
    <Panel id='profilePicturePanel' heading='Profile Picture' toggleable>
      <Field
        component={UploadImageField}
        name={nameof<Photographer>('profilePicture')}
        fieldOrientation='landscape'
        imageFullDimensions={{ height: 200, width: 200 }}
        cropShape='round'
        label={<>
          Uploaded picture will be cropped/resized to a square.
          To achieve best results, upload a square or almost square picture.
        </>}
      />
    </Panel>
  )
}

export default ProfilePicture
