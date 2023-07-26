import Panel from '#veewme/web/common/panel'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
// import InputField from '../../../common/formikFields/inputField'
import SelectField, { OptionValue } from '../../../common/formikFields/selectField'
import SwitchField from '../../../common/formikFields/switchField'
import * as Grid from '../../../common/grid'
import { NavHashLink } from '../../../common/hashLink'
import InlineHelp from '../../../common/inlineHelp'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import styled from '../../../common/styled-components'

import ThumbsCarousel from '../thumbsCarousel'
import { HostedVideo, OrderPhoto, VideoCategory } from '../types'
import VideoBasicDetails from './videoBasicDetails'
import VideoUpload from './videoUpload'

const OverviewSwitcherHolder = styled.div`
  display: flex;
  align-items: center;

  label {
      margin-right: 10px;
  }
`

const CategoryWrapper = styled.div`
  margin: 5px 0;
  align-self: flex-start;
  width: 100%;
  max-width: 280px;
  z-index: 100;

  & > div {
    width: 100%;
  }
`

const VideoSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const thumbsWidth = '240px'

const ThumbsWrapper = styled.div`
  width: ${thumbsWidth};
  height: 180px;
  margin-bottom: 10px;
  padding-left: 0
  flex: 0 0 auto;
  background: #eee;
`

const StyledPanel = styled(Panel)`
  margin-top: 20px;
`

const VideoRightColumn = styled.div`
  display: flex;
  padding-left: 15px;
  flex-direction: column;
  max-width: calc(100% - ${thumbsWidth});

  h4,
  h5 {
    margin-bottom: 5px;
    font-weight: 400;
    font-size: 15px;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }

  p {
    flex: 1 0 auto;
    font-size: 13px;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }

  & > div {
    display: flex;
    justify-content: flex-end;
  }
`

const CategoryOptions: Array<OptionValue<VideoCategory>> = [{
  label: 'Properties',
  value: 'Properties'
}, {
  label: 'Agents',
  value: 'Agents'
}, {
  label: 'Flyover',
  value: 'Flyover'
}, {
  label: 'Developments',
  value: 'Developments'
}, {
  label: 'Neighborhoods',
  value: 'Neighborhoods'
}, {
  label: 'Market Reports',
  value: 'MarketReports'
}]

export const OverviewSwitcher: React.FunctionComponent = () => {
  return (
    <OverviewSwitcherHolder>
      <Field
        component={SwitchField}
        label='Overview Video'
        name={nameof<HostedVideo>('overview')}
        labelFirst
      />
      <InlineHelp
        text='Overview video lorem ipsum'
      />
    </OverviewSwitcherHolder>
  )
}

export type GalleryPhoto = Pick<OrderPhoto, 'id' | 'thumbUrl'>

interface EditCustomProps {
  onSubmit: (values: HostedVideo) => Promise<{}>
  initialData?: Partial<HostedVideo>
  photos: GalleryPhoto[]
}

interface AddCustomProps {
  onSubmit: (values: AddFormValues) => Promise<{}>
  initialData?: Partial<HostedVideo>
  photos: GalleryPhoto[]
}

export type FormValues = HostedVideo
export type AddFormValues = FormValues & {
  photoIdentification: string
}

export type EditHostedVideoViewProps = FormikProps<FormValues> & EditCustomProps

export type AddHostedVideoViewProps = FormikProps<AddFormValues> & AddCustomProps

type HostedVideoDetailsPanelProps = Omit<EditHostedVideoViewProps, 'onSubmit'>
const HostedVideoDetailsPanel: React.FunctionComponent<HostedVideoDetailsPanelProps> = props => (
  <StyledPanel
    heading='Video Details'
  >
    <VideoSection>
      <ThumbsWrapper>
        <ThumbsCarousel
          onSlideChange={id => props.setFieldValue('thumbId', id)}
          photos={props.photos}
          initSlideId={props.values.thumbId}
        />
      </ThumbsWrapper>
      <VideoRightColumn>
        <h5>Note!</h5>
        <p>
          When file upload has completed you can exit. Transcoding will begin in the background.
          An email notification will be sent to you when completed. (Upload size limit 600 MB, file type: .mp4, .mov)
        </p>
        <CategoryWrapper>
          <Field
            name={nameof<FormValues>('category')}
            component={SelectField}
            options={CategoryOptions}
          />
        </CategoryWrapper>
      </VideoRightColumn>
    </VideoSection>
  </StyledPanel>
)

const DetailsPanel: React.FunctionComponent = () => (
  <Panel
    heading='Video Hosted'
  >
    <VideoBasicDetails />
  </Panel>
)

const AddHostedVideoFormView: React.FunctionComponent<AddHostedVideoViewProps> = props => (
  <Form>
    <DetailsPanel/>
    <HostedVideoDetailsPanel {...props} />
    <VideoUpload {...props}/>
  </Form>
)

const EditHostedVideoFormView: React.FunctionComponent<EditHostedVideoViewProps> = props => (
  <>
    <Grid.Wrapper as={Form} >
      <Grid.Heading>
       <h1>Edit Hosted Video</h1>
      </Grid.Heading>
      <Grid.LeftDesktopAside>
        <SecondaryNavigation>
          <li><NavHashLink to='#details'>Video Hosted</NavHashLink></li>
        </SecondaryNavigation>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn>
        <DetailsPanel {...props} />
        <HostedVideoDetailsPanel {...props} />
      </Grid.MainColumn>
      <Grid.Footer />
    </Grid.Wrapper>
  </>
)

const defaultData: HostedVideo = {
  appearance: 'Always',
  category: 'Properties',
  label: '',
  overview: false,
  theaterMode: false
}

export const AddHostedVideoForm = withFormik<AddCustomProps, AddFormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    return null
  },
  mapPropsToValues: () => ({
    ...defaultData,
    photoIdentification: '',
    photos: []
  })
})(AddHostedVideoFormView)

export const EditHostedVideoForm = withFormik<EditCustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values).catch(e => null)
    setSubmitting(false)
  },
  mapPropsToValues: ({ initialData }) => ({
    ...defaultData,
    ...initialData
  })
})(EditHostedVideoFormView)
