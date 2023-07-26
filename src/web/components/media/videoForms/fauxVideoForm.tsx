import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import arrayMove from 'array-move'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import AudioField from '../../../common/formikFields/audioSelectField'
import CheckboxField from '../../../common/formikFields/checkboxField'
import RadioField from '../../../common/formikFields/radioInputField'
import SelectField from '../../../common/formikFields/selectField'
import { Label } from '../../../common/formikFields/styled'
import * as Grid from '../../../common/grid'
import { NavHashLink } from '../../../common/hashLink'
import InlineHelp from '../../../common/inlineHelp'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import Gallery, { GalleryPhoto } from '../photosGallery'
import { FauxVideo } from '../types'
import Footer from './formFooter'
import VideoBasicDetails from './videoBasicDetails'

import { Move, Star } from 'styled-icons/boxicons-regular'

const AudioFilesMock = [{
  id: 'ap1',
  name: 'African Party',
  src: '/public/static/audio/african-party.mp3'
}, {
  id: 'cb2',
  name: 'Cannonballs',
  src: '/public/static/audio/cannonballs.mp3'
}, {
  id: 'so3',
  name: 'Startover',
  src: '/public/static/audio/startover.mp3'
}, {
  id: 'sb4',
  name: 'Summer beat',
  src: '/public/static/audio/summer-beat.mp3'
}, {
  id: 'md5',
  name: 'Magic dreams',
  src: '/public/static/audio/magic-dreams.mp3'
}]

const StyledPanel = styled(Panel)`
  margin-bottom: 20px;

  header {
    justify-content: flex-start;

    h2 {
      margin-right: 10px;
    }
  }
`

const TwoColSection = styled.section`
  display: flex;

  & > div {
    &:first-child {
      flex: 1 0 50%;
      max-width: 360px;
    }
  }
`

const SlideshowRightCol = styled.div`
  margin-top: -40px;
  padding-left: 25px;
  color: ${props => props.theme.colors.LABEL_TEXT};

  h4 {
    font-weight: 400;
  }

  p {
    margin: 5px 0;
    font-size: 13px;
  }

  ul {
    margin-left: 40px;
    list-style-type: disc;
    font-size: 13px;
  }
`
// TODO add 'extra small' option to Radio field
const SlideshowsFieldsWrapper = styled.div`
  padding: 0 5px 10px 0;
`

const StyledRadioLabel = styled.span`
    span {
      font-style: italic;
    }
`

const OptionsSection = styled(TwoColSection)`
  & > div {
    &:first-child {
      flex: 0 0 50%;
    }

    &:nth-child(2) {
      display: flex;
      flex: 1 1 50%;
      margin-top: 0;
      flex-wrap: wrap;

      & > div:first-child {
        margin-right: 10px;
      }
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    & > div {
      &:nth-child(2) {
        flex-wrap: nowrap;
      }
    }
  }

  ${SlideshowsFieldsWrapper} {
    & > div {
      width: 250px;
    }
  }
`

const TranistionSampleGif = styled.div<{
  text: string
}>`
  flex: 1 1 100%;
  margin-top: 0;
  max-width: 100%;
  min-width: 100px;

  div {
    background: #eee;
    max-width: 320px;
    position: relative;

    &:after {
      display: block;
      width: 100%;
      padding-bottom: 75%;
      content: '';

    }

    &:before {
      content: '${props => props.text}';
      position: absolute;
      top: 30%;
      text-align: center;
      white-space: pre-wrap;
      width: 100%;
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    flex: 1 1 100px;
    margin-top: 38;
  }
`

const Tip = styled.p`
  font-size: 12px;
  line-height: 1.3;
  margin-bottom: 2px;

  strong {
    font-weight: 500;
  }
`

const SlideshowTip: React.FunctionComponent = () => <InlineHelp text='Lorem ipsum' />

interface CustomProps {
  onSubmit: (values: FauxVideo) => void
  edit?: boolean
  initialData?: Partial<FauxVideo>
  photos?: GalleryPhoto[]
}

const videoIntroTime = 25
export type FormValues = FauxVideo

type FauxVideoViewProps = FormikProps<FormValues> & CustomProps

const FauxVideoPanels: React.FunctionComponent<FauxVideoViewProps> = props => {
  const [ photos, setPhotos ] = React.useState(props.photos || [])
  let slideshowRoundedMinutes = 0
  const slideshowDuration = (props.values.photos.length * props.values.slideDuration + videoIntroTime)
  if (props.values.photos.length > 0) {
    slideshowRoundedMinutes = slideshowDuration < 30 ? 0.5 : Math.round(2 * slideshowDuration / 60) / 2
  }

  const handleSort = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    setPhotos(arrayMove(photos, oldIndex, newIndex))
  }

  React.useEffect(() => {
    if (!photos.length) {
      return
    }
    const selectedPhotosInOrder = photos
      .map(p => p.id)
      .filter(pId => props.values.photos.find(spId => spId === pId))

    props.setFieldValue(nameof<FormValues>('photos'), selectedPhotosInOrder)
  }, [photos])

  return (
    <>
      <StyledPanel heading='Faux Video' id='details'>
        <VideoBasicDetails />
      </StyledPanel>
      <StyledPanel
        id='generate'
        heading='Generate new video slideshow'
        headingPlacedComponent={<SlideshowTip />}
      >
        <TwoColSection>
          <div>
            <SlideshowsFieldsWrapper>
              <Label>Select</Label>
              <Field
                name={nameof<FormValues>('generateOption')}
                value='Branded'
                component={RadioField}
                label={<StyledRadioLabel>Branded (<span>$4.00</span>)</StyledRadioLabel>}
                size='xs'
              />
              <Field
                name={nameof<FormValues>('generateOption')}
                value='Unbranded'
                component={RadioField}
                label={<StyledRadioLabel>Unbranded (<span>$4.00</span>)</StyledRadioLabel>}
                size='xs'
              />
              <Field
                name={nameof<FormValues>('generateOption')}
                value='Package'
                component={RadioField}
                label={<StyledRadioLabel>Package (Branded + Unbranded) (<span>$6.00</span>)</StyledRadioLabel>}
                size='xs'
              />
            </SlideshowsFieldsWrapper>
          </div>
          <SlideshowRightCol>
            <h4>Note</h4>
            <p>
              You can tag up to 50 photos to include in the video by selecting the camera icon on each respective photo thumbnail.
              These photos will then appear in the order shown as thumbnails.
              If you do not tag any photos and continue to proceed with generating a video, up to the first 30 photos will be used.
            </p>
            <p>
              Before generating this video please make sure your property tour contains the following (correct) information:
            </p>
            <ul>
              <li>
                Address, City, Zip/Postal Code
              </li>
              <li>
                Attention grabbing headline!
              </li>
              <li>
                Property details - Bedrooms, full & half baths, square footage
              </li>
              <li>
                Your contact information is correct and up to date.
              </li>
            </ul>
            <p>
              You can generate a branded and/or unbranded video.
            </p>
            <p>
              The cost is 4.00 for each.
              If you choose to generate both, the cost is 6.00 for the pair.
              Should you make a mistake or need to change something you can re-generate two videos at no cost.<br/>
              If you need to make additional changes you can generate a new video.
            </p>
          </SlideshowRightCol>
        </TwoColSection>
      </StyledPanel>

      {!props.edit && (
        <>
          <StyledPanel
            id='options'
            heading='Options'
          >
            <OptionsSection>
              <div>
                <SlideshowsFieldsWrapper>
                  <Field
                    name={nameof<FormValues>('audio')}
                    component={AudioField}
                    audios={AudioFilesMock}
                    label='Select'
                  />
                </SlideshowsFieldsWrapper>
                <SlideshowsFieldsWrapper>
                  <Field
                    name={nameof<FormValues>('slideDuration')}
                    component={SelectField}
                    options={[{
                      label: '2 seconds',
                      value: 2
                    },{
                      label: '3 seconds',
                      value: 3
                    }, {
                      label: '4 seconds',
                      value: 4
                    }, {
                      label: '20 seconds (test)',
                      value: 20
                    }]}
                    label='Slide duration'
                  />
                  <Tip>
                    Based on the quantity of selected photos<br />
                    your slideshow duration will be aprox.
                    <strong> {slideshowRoundedMinutes} minute(s)</strong>
                  </Tip>
                  <Tip>
                    <strong>Note</strong> slideshows between 1 and 2 minutes are most attractive to viewer.
                  </Tip>
                </SlideshowsFieldsWrapper>
                <SlideshowsFieldsWrapper>
                  <Field
                    name={nameof<FormValues>('includeCaptions')}
                    component={CheckboxField}
                    label='Include photo captions'
                    labelFirst
                  />
                </SlideshowsFieldsWrapper>
              </div>
              <SlideshowRightCol>
                <Field
                  name={nameof<FormValues>('slideTransition')}
                  component={SelectField}
                  options={[{
                    label: 'Crossfade',
                    value: 'Crossfade'
                  }, {
                    label: 'Fade',
                    value: 'Fade'
                  }, {
                    label: 'Slide',
                    value: 'Slide'
                  }]}
                  label='Select slide transition'
                />
                <TranistionSampleGif text={`Here will be \\A ${props.values.slideTransition} \\A effect gif`}>
                  <div/> {/* This div will wrap gif image*/}
                </TranistionSampleGif>
              </SlideshowRightCol>
            </OptionsSection>
          </StyledPanel>
          <div id='gallery'>
            <Gallery
              photos={photos}
              title='Select photos to include in video'
              maxCount={50}
              onChange={values => {
                const selectedPhotosInOrder = photos
                .map(p => p.id)
                .filter(pId => values.find(spId => spId === pId))

                props.setFieldValue(nameof<FormValues>('photos'), selectedPhotosInOrder)

              }}
              onUpdate={id => props.setFieldValue(nameof<FormValues>('thumbId'), id)}
              defaultThumb={props.values.thumbId}
              onSortEnd={handleSort}
              axis='xy'
              useDragHandle
              subtitle={<>
                Position thumbnails in the order you wish photos to appear in the video, using <Move size='20' /><br/>
                Click <Star size='18'/> to select poster image for video.
              </>}
            />
          </div>
        </>
      )}
    </>
  )
}

const AddFauxVideoFormView: React.FunctionComponent<FauxVideoViewProps> = props => (
  <Form>
    <FauxVideoPanels {...props} />
    <Footer />
  </Form>
)

const EditFauxVideoFormView: React.FunctionComponent<FauxVideoViewProps> = props => (
  <>
    <Grid.Wrapper as={Form} >
      <Grid.Heading>
       <h1>Edit Faux Video</h1>
      </Grid.Heading>
      <Grid.LeftDesktopAside>
        <SecondaryNavigation>
          <li><NavHashLink to='#details'>Faux video</NavHashLink></li>
          <li><NavHashLink to='#generate'>Generate new slideshow</NavHashLink></li>
        </SecondaryNavigation>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn>
        <FauxVideoPanels {...props} />
      </Grid.MainColumn>
      <Grid.Footer />
    </Grid.Wrapper>
  </>
)

const FauxVideoFormView: React.FunctionComponent<FauxVideoViewProps> = props => props.edit ? <EditFauxVideoFormView {...props} /> : <AddFauxVideoFormView {...props} />

const defaultData: FauxVideo = {
  appearance: 'Always',
  audio: '',
  generateOption: 'Branded',
  includeCaptions: true,
  label: '',
  photos: [],
  slideDuration: 3,
  slideTransition: 'Crossfade',
  theaterMode: false
}

const FauxVideoForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: ({ initialData, photos }) => ({
    ...defaultData,
    ...initialData,
    thumbId: (photos && photos.length) && photos[0].id
  })
})(FauxVideoFormView)

export default FauxVideoForm
