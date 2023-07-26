import Panel from '#veewme/web/common/panel'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import TextareaField from '../../../common/formikFields/textareaField'
import * as Grid from '../../../common/grid'
import { NavHashLink } from '../../../common/hashLink'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import { EmbedVideo } from '../types'
import Footer from './formFooter'
import { EmbedCodeSection } from './styled'
import VideoBasicDetails from './videoBasicDetails'

interface CustomProps {
  edit?: boolean
  onSubmit: (values: EmbedVideo) => void
  initialData?: Partial<FormValues>
}

export type FormValues = EmbedVideo

type EmbedVideoViewProps = FormikProps<FormValues> & CustomProps

const DetailsPanel = () => (
  <Panel heading='Video Embed' id='details'>
    <VideoBasicDetails />
    <EmbedCodeSection>
      <div>
        <Field
          name={nameof<FormValues>('embeddedCode')}
          component={TextareaField}
          placeholder='Paste embed code here'
          rows={8}
        />
      </div>
      <div>
        <h5>Note!</h5>
        <p>
          Embed code will display the video directly from the third party provider.
          Please make sure the code you embed is valid html markup.
          Usually, embed codes will include an iframe tag.
        </p>
      </div>
    </EmbedCodeSection>
  </Panel>
)

const AddEmbedVideoFormView: React.FunctionComponent = () => (
  <Form>
    <DetailsPanel />
    <Footer />
  </Form>
)

const EditEmbedVideoFormView: React.FunctionComponent = () => (
  <>
    <Grid.Wrapper as={Form} >
      <Grid.Heading>
       <h1>Edit Video Embed</h1>
      </Grid.Heading>
      <Grid.LeftDesktopAside>
        <SecondaryNavigation>
          <li><NavHashLink to='#details'>Video Embed</NavHashLink></li>
        </SecondaryNavigation>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn>
        <DetailsPanel />
      </Grid.MainColumn>
      <Grid.Footer />
    </Grid.Wrapper>
  </>
)

const EmbedVideoFormView: React.FunctionComponent<EmbedVideoViewProps> = ({ edit }) => edit ? <EditEmbedVideoFormView /> : <AddEmbedVideoFormView />

const defaultData: EmbedVideo = {
  appearance: 'Always',
  embeddedCode: '',
  label: '',
  theaterMode: false
}

const EmbedVideoForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: ({ initialData }) => ({
    ...defaultData,
    ...initialData
  })
})(EmbedVideoFormView)

export default EmbedVideoForm
