import Panel from '#veewme/web/common/panel'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import InputField from '../../../common/formikFields/inputField'
import * as Grid from '../../../common/grid'
import { NavHashLink } from '../../../common/hashLink'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import { UrlVideo } from '../types'
import Footer from './formFooter'
import { EmbedCodeSection } from './styled'
import VideoBasicDetails from './videoBasicDetails'

interface CustomProps {
  onSubmit: (values: UrlVideo) => void
  edit?: boolean
  initialData?: Partial<UrlVideo>
}

export type FormValues = UrlVideo

type UrlVideoViewProps = FormikProps<FormValues> & CustomProps

const DetailsPanel: React.FunctionComponent = () => (
  <>
    <Panel heading='Video URL'>
      <VideoBasicDetails />
      <EmbedCodeSection>
        <div>
          <Field
            name={nameof<FormValues>('url')}
            component={InputField}
          />
          <span>
            Please provide URL to the mp4 video file here.
          </span>
        </div>
        <div>
          <h5>Note!</h5>
          <p>
            This must be a direct URL linking to a video file, not a page containing a video (like YouTube, Vimeo, etc.).
          </p>
        </div>
      </EmbedCodeSection>
    </Panel>
  </>
)

const AddUrlVideoFormView: React.FunctionComponent<UrlVideoViewProps> = () => (
  <Form>
    <DetailsPanel />
    <Footer />
  </Form>
)

const EditUrlVideoFormView: React.FunctionComponent<UrlVideoViewProps> = () => (
  <>
    <Grid.Wrapper as={Form} >
      <Grid.Heading>
       <h1>Edit URL Video</h1>
      </Grid.Heading>
      <Grid.LeftDesktopAside>
        <SecondaryNavigation>
          <li><NavHashLink to='#details'>Video URL</NavHashLink></li>
        </SecondaryNavigation>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn>
        <DetailsPanel />
      </Grid.MainColumn>
      <Grid.Footer />
    </Grid.Wrapper>
  </>
)

const UrlVideoFormView: React.FunctionComponent<UrlVideoViewProps> = props => props.edit ? <EditUrlVideoFormView {...props} /> : <AddUrlVideoFormView {...props} />

const defaultData: UrlVideo = {
  appearance: 'Always',
  label: '',
  theaterMode: false,
  url: ''
}

const UrlVideoForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: ({ initialData }) => ({
    ...defaultData,
    ...initialData
  })
})(UrlVideoFormView)

export default UrlVideoForm
