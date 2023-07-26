// import * as log from '#veewme/web/common/log'
import Slideshow from '#veewme/web/common/slideshow'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import * as Yup from 'yup'
import { nameof } from '../../../../lib/util'
import CheckboxField from '../../../common/formikFields/checkboxField'
import InputField from '../../../common/formikFields/inputField'
import RadioField from '../../../common/formikFields/radioInputField'
import { Label } from '../../../common/formikFields/styled'
import TextareaField from '../../../common/formikFields/textareaField'
import * as Grid from '../../../common/grid'
import { NavHashLink } from '../../../common/hashLink'
import InlineHelp from '../../../common/inlineHelp'
import Panel from '../../../common/panel'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import styled from '../../../common/styled-components'
import { AppearanceHolder } from '../styled'
import { InteractivePhoto, OrderInteractiveDetails } from '../types'
import Uploader from '../uploader'

import { ZoomIn } from 'styled-icons/icomoon'

const Hint = styled.div`
  padding: 10px 0 20px 0;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT}
`

const InputInlineHelp = styled(InlineHelp)`
  padding: 4px 6px;
`

const InfoWrapper = styled.span`
  color: ${props => props.theme.colors.GREEN}
`

const PhotosListStyled = styled.div`
  display: grid;
  grid-template-columns:repeat(3, minmax(0, 1fr));
  grid-gap: 15px;

`

const PhotoInput = styled(InputField)`
  display: block;
  height: 32px;
  margin: 7px -7px 0;
  padding: 0;
  border-top: 1px solid ${props => props.theme.colors.INFO_BORDER};
  font-size: 13px;
  color: ${props => props.theme.colors.HEADER};
  text-align: center;

  > div {
    border: 0 none;
    background: transparent;
    margin: 0;
  }

  input {
    background: transparent;
  }
`

const PhotoItemInner = styled.div`
  position: relative;
  padding: 5px 5px 0 5px;
  padding-bottom: 55%;

  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ZoomBtn = styled.span`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 15px 15px 0 0;
  cursor: pointer;

  svg {
    fill: ${props => props.theme.colors.DARK_GREY};
    opacity: 0.8;
    transform: scale(-1, 1);
  }
`

const DeletePhotoBtn = styled.span`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 25px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0 0 0 5px;
  line-height: 15px;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  color: ${props => props.theme.colors.ALERT};
`

const StyledPhotoItem = styled.div`
  position: relative;
  padding: 7px 7px 0 7px;
  border: 1px solid ${props => props.theme.colors.INFO_BORDER};
  border-radius: 5px;

  &:hover {
    ${DeletePhotoBtn} {
      display: block;
    }
  }

  img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

interface CustomProps {
  onSubmit: (values: OrderInteractiveDetails) => void
  data?: InitialData
}

export type FormValues = OrderInteractiveDetails

interface PhotoItemProps {
  name: string
  onClick: () => void
  photo: InteractivePhoto
  onDelete: () => void
}

const PhotoItem: React.FC<PhotoItemProps> = ({
  name,
  photo,
  onClick,
  onDelete
}) => {
  return (
    <StyledPhotoItem>
      <PhotoItemInner>
        <img src={photo.fullUrl} />
        <ZoomBtn onClick={onClick}>
          <ZoomIn size='26'/>
        </ZoomBtn>
        <DeletePhotoBtn onClick={onDelete}>
          &#10005;
        </DeletePhotoBtn>
      </PhotoItemInner>
      <Field
        name={name}
        component={PhotoInput}
        placeholder='Label'
      />
    </StyledPhotoItem>
  )
}

const PhotosList: React.FC<InteractiveFormViewProps> = ({
  setFieldValue,
  values
}) => {
  const [ slideshowVisible, toggleSlideshow ] = React.useState<boolean>(false)
  const [ currentPhotoIndex, setCurrentPhotoIndex ] = React.useState<number>(0)
  const photos = values.photos || []

  const showCurrentPhoto = (index: number) => {
    setCurrentPhotoIndex(index)
    toggleSlideshow(true)
  }

  return (
    <PhotosListStyled>
      {
        photos.length > 0 && photos.map((p, i) => {
          const photosFieldName = `${nameof<FormValues>('photos')}`
          const labelFieldName = `${photosFieldName}.${i}.${nameof<InteractivePhoto>('label')}`
          return (
            <PhotoItem
              key={i}
              onClick={() => showCurrentPhoto(i)}
              photo={p}
              name={labelFieldName}
              onDelete={() => {
                const newPhotos = photos.filter((_, j) => j !== i)
                setFieldValue(photosFieldName, newPhotos)
              }}
            />
          )
        })
      }
      {slideshowVisible && <Slideshow
        autoPlay={false}
        visible={slideshowVisible}
        photos={photos}
        currentPhotoIndex={currentPhotoIndex}
        handleClose={() => toggleSlideshow(false)}
      />
      }
    </PhotosListStyled>
  )
}

type InteractiveFormViewProps = FormikProps<FormValues> & CustomProps

// TODO: convert to function component
const InteractiveFormView: React.FC<InteractiveFormViewProps> = props => {
  const uploaderRef = React.useRef<Uploader>(null)
  const { addToast } = useToasts()

  const commonFields = (
    <>
      <Field
        name={nameof<FormValues>('theaterMode')}
        component={CheckboxField}
        label='Display in theater mode (large viewer)'
      />
      <Field name={nameof<FormValues>('embeddedCode')} component={TextareaField} label='Embed code (For Display On Tour)' />
      <Field
        name={nameof<FormValues>('url')}
        component={InputField}
        label='Direct Link (URL)'
        rightComponent={<InputInlineHelp text='Lorem ipsum'/>}
      />
    </>
  )

  const uploader = (
    <>
      <Uploader
        ref={uploaderRef}
        allowMultiple
        instantUpload={false}
        onaddfile={(err, file) => {
          if (err) {
            return
          }
          const photos = props.values.photos || []

          // delay removing file from filepond to avoid items 'flickering'
          setTimeout(() => {
            uploaderRef.current && uploaderRef.current.removeFile(file.id)
          }, 500)

          if (photos.length >= 6) {
            addToast('Photos limit has been reached.', {
              appearance: 'error',
              autoDismiss: true ,
              autoDismissTimeout: 10000
            })
            return
          }
          props.setFieldValue('photos', [
            ...photos,
            {
              file: file.file,
              fullUrl: URL.createObjectURL(file.file),
              label: props.values.label
            }
          ])
        }}
        server={{
          process: (_fieldName, file, _metadata, load, error, progress, abort) => {
            return {
              abort: () => {
                abort()
              }
            }
          },
          revert: null
        }}
        acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
      />
      <PhotosList {...props}/>
    </>
  )

  const fieldsToDisplay = props.values.type !== 'FLOORPLAN_PHOTOS' ? commonFields : uploader
  return (
    <Grid.Wrapper as={Form} >
      <Grid.Heading>
        <h1>{props.data ? 'Edit Interactive' : 'Add New Interactive'}</h1>
      </Grid.Heading>
      <Grid.LeftDesktopAside>
        <SecondaryNavigation>
          <li><NavHashLink to='#details'>Interactive Details</NavHashLink></li>
        </SecondaryNavigation>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn>
        <Panel id='details' heading='Interactive Details'>
        <AppearanceHolder>
            <Label>Interactive type</Label>
            <Field
              name={nameof<FormValues>('type')}
              value='EMBEDDED'
              component={RadioField}
              label='Embed Code'
              size='s'
            />
            <Field
              name={nameof<FormValues>('type')}
              value='FLOORPLAN_PHOTOS'
              component={RadioField}
              label='Upload (floor plan images)'
              size='s'
            />
          </AppearanceHolder>
          <Field name={nameof<FormValues>('label')} autoFocus component={InputField} label='Label' />
          <Hint><InfoWrapper>Note!</InfoWrapper> If you add multiple interactives then Navigation will reset to Interactive and a sub-menu will show with set labels.</Hint>
          <AppearanceHolder>
            <Label>Appearance on tours</Label>
            <Field
              name={nameof<FormValues>('appearance')}
              value='Always'
              component={RadioField}
              label='Show Always'
              size='s'
            />
            <Field
              name={nameof<FormValues>('appearance')}
              value='Branded'
              component={RadioField}
              label='Only Branded'
              size='s'
            />
            <Field
              name={nameof<FormValues>('appearance')}
              value='Unbranded'
              component={RadioField}
              label='Only Unbranded'
              size='s'
            />
            <Field
              name={nameof<FormValues>('appearance')}
              value='Hide'
              component={RadioField}
              label='Hide'
              size='s'
            />
          </AppearanceHolder>
          {fieldsToDisplay}
        </Panel>
      </Grid.MainColumn>
      <Grid.Footer />
    </Grid.Wrapper>
  )
}

const FormSchema = Yup.object().shape<Partial<FormValues>>({
  label: Yup.string().required()
})

type PhotsUpdate = Omit<InteractivePhoto, 'file'>
type InitialData = Omit<OrderInteractiveDetails, 'photos'> & {
  photos?: PhotsUpdate[]
}
const initialData: InitialData = {
  appearance: 'Always',
  embeddedCode: '',
  label: '',
  theaterMode: false,
  type: 'EMBEDDED',
  url: ''
}

const InteractiveForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    const isFloorPlanWithPhotos = values.type === 'FLOORPLAN_PHOTOS'
    const valuesCopy = {
      ...values
    }

    if (isFloorPlanWithPhotos) {
      delete valuesCopy.embeddedCode
      delete valuesCopy.url
    } else {
      delete valuesCopy.photos
    }

    props.onSubmit({
      ...valuesCopy
    })
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...initialData,
    ...props.data
  }),
  validationSchema: FormSchema
})(InteractiveFormView)

export default InteractiveForm
