import { ImageDimensions } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as R from 'ramda'
import * as React from 'react'
import { CropShape } from 'react-easy-crop'
import { randomBoolean } from '../../../lib/faker'
import SwitchField from '../../common/formikFields/switchField'
import { FieldOrientation } from '../../common/formikFields/uploadImage/preview'
import UploadImageField from '../../common/formikFields/uploadImageField'
import * as Grid from '../../common/grid'
import Panel from '../../common/panel'
import SecondaryNavigation from '../../common/secondaryNavigation'

interface ImageProps {
  file?: File
  path?: string
}

interface DemoImage {
  dimensions: ImageDimensions
  image?: ImageProps
  name: string
}

interface DemoAvatar {
  cropShape: CropShape
  demoImage: DemoImage
  fieldOrientation: FieldOrientation
  heading: string
  label: boolean
  switch: boolean
}

const OriginalImage = styled.div`
  margin-bottom: 15px;
  width: 100%;
  text-align: center;
  img {
    border: 1px solid black;
    max-width: 100%;
  }
`

type DemoAvatarsFormProps = FormikProps<DemoAvatarsFormValues>

const DemoAvatarsForm: React.FunctionComponent<DemoAvatarsFormProps> = props => {
  return (
    <Grid.Wrapper as={Form}>
      <Grid.Header>
        <h1>Demo Avatars</h1>
      </Grid.Header>
      <Grid.LeftDesktopAside>
        <SecondaryNavigation>
          {props.values.demoAvatars.map((demoAvatar, index) => (
            <li key={index}><a href={`#demo-avatar-${index}`}>{demoAvatar.heading}</a></li>
          ))}
        </SecondaryNavigation>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn centerColumn>
        {props.values.demoAvatars.map((demoAvatar, index) => (
          <Panel key={index} heading={demoAvatar.heading} id={`demo-avatar-${index}`} toggleable>
            <OriginalImage>
              <img
                src={demoAvatar.demoImage.image && demoAvatar.demoImage.image.file
                  ? URL.createObjectURL(demoAvatar.demoImage.image.file)
                  : demoAvatar.demoImage.image && demoAvatar.demoImage.image.path
                }
              />
            </OriginalImage>
            <Field
              component={UploadImageField}
              cropShape={demoAvatar.cropShape}
              fieldOrientation={demoAvatar.fieldOrientation}
              imageFullDimensions={demoAvatar.demoImage.dimensions}
              label={demoAvatar.label ?
                <>
                  Avatar Label
                  <div>Uploaded picture will be cropped/resized to a square. To achieve best results, upload a square or almost square picture.</div>
                </> : undefined
              }
              name={`${nameof<DemoAvatarsFormValues>('demoAvatars')}[${index}].${nameof<DemoAvatar>('demoImage')}.${nameof<DemoImage>('image')}`}
              switchField={demoAvatar.switch ?
                <Field
                  component={SwitchField}
                  label='Example switch'
                  name='exampleSwitch'
                /> : undefined
              }
            />
          </Panel>
        ))}

        <Panel heading='Detach Crop' toggleable>
          <OriginalImage>
            <img
              src={props.values.detachCrop && props.values.detachCrop.file
                ? URL.createObjectURL(props.values.detachCrop.file)
                : props.values.detachCrop && props.values.detachCrop.path
              }
            />
          </OriginalImage>
          <Field
            component={UploadImageField}
            modificationStyle='scaledown'
            name='detachCrop'
            imageFullDimensions={{
              height: 100,
              width: 200
            }}
            imageMinDimensions={{
              height: 50,
              width: 100
            }}
          />
        </Panel>

      </Grid.MainColumn>
    </Grid.Wrapper>
  )
}

interface DemoAvatarsFormValues {
  demoAvatars: DemoAvatar[]
  detachCrop?: {
    path?: string
    file?: File
  }
}

const generateDemoAvatars = (demoImages: DemoImage[]): DemoAvatar[] => {
  const flavors: Array<Partial<DemoAvatar>> = [
    { fieldOrientation: 'landscape' },
    { fieldOrientation: 'portrait' }
  ]
  return R.xprod(demoImages, flavors).map(([demoImage, options], index) => {
    const fieldOrientation = options.fieldOrientation || 'landscape'
    const cropShape: CropShape = options.fieldOrientation === 'landscape' ? 'round' : 'rect'
    return {
      cropShape,
      demoImage,
      fieldOrientation,
      heading: `${demoImage.name} (${demoImage.dimensions.width}x${demoImage.dimensions.height}) ${fieldOrientation}`,
      label: randomBoolean(),
      switch: randomBoolean()
    }
  })
}

export default withFormik<DemoAvatarsFormProps, DemoAvatarsFormValues>({
  handleSubmit:  (values, { setSubmitting }) => {
    log.debug('submit', JSON.stringify(values))
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    demoAvatars: generateDemoAvatars([
      {
        dimensions: { height: 480, width: 640 },
        image: { path: 'http://placeimg.com/640/480/animals' },
        name: 'Animal'
      },
      {
        dimensions: { height: 480, width: 480 },
        image: { path: 'https://placeimg.com/480/480/arch' },
        name: 'Square'
      },
      {
        dimensions: { height: 1000, width: 6000 },
        image: { path: '/public/static/test/6000x1000.jpg' },
        name: 'Narrow horizontal'
      },
      {
        dimensions: { height: 6000, width: 1000 },
        image: { path: '/public/static/test/1000x6000.jpg' },
        name: 'Narrow vertical'
      },
      {
        dimensions: { height: 3, width: 20 },
        image: { path: '/public/static/test/very-small-landscape.png' },
        name: 'Small horizontal'
      },
      {
        dimensions: { height: 20, width: 3 },
        image: { path: '/public/static/test/very-small-portrait.png' },
        name: 'Small vertical'
      },
      {
        dimensions: { height: 20, width: 20 },
        image: { path: '/public/static/test/very-small-square.png' },
        name: 'Small square'
      }
    ]),
    detachCrop: {
      path: ''
    }
  })
})(DemoAvatarsForm)
