import { convertFromRaw, EditorState } from 'draft-js'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { BreadcrumbNavigation } from '../../common/breadcrumbs/breadcrumbNavigation'
import * as Grid from '../../common/grid'
import GridPanel from './demoFormComponents/gridPanel'
import RadioButtons from './demoFormComponents/radioButtons'
import { DemoFormValues } from './demoFormComponents/types'
import WysiwygPanel from './demoFormComponents/wysiwygPanel'

// Custom Props passed from parent to formik component e.g. submit handler or initial data
interface DemoFormCustomProps {
  onSubmit: (val: DemoFormValues) => void
}

type DemoFormProps = DemoFormCustomProps & FormikProps<DemoFormValues>

class DemoFormAlternative extends React.Component<DemoFormProps, {}> {
  render () {
    const { dirty } = this.props
    const steps = [
      { label: 'a' },
      { label: 'b' },
      { label: 'c' }
    ]

    return (
      <BreadcrumbNavigation.Provider steps={steps}>
        <Grid.Wrapper as={Form}>
          <Grid.Heading>
          <h1>
            Demo form
            <span>with always visible left sidebar and the column with content that spans all the available columns</span>
          </h1>
          </Grid.Heading>
          <Grid.LeftAside>
            <BreadcrumbNavigation.Breadcrumbs />
          </Grid.LeftAside>
          <Grid.MainColumnFullWidth>
            <GridPanel dirty={dirty} />
            <RadioButtons dirty={dirty} />
            <WysiwygPanel />
          </Grid.MainColumnFullWidth>
          <Grid.Footer />
        </Grid.Wrapper>
      </BreadcrumbNavigation.Provider>
    )
  }
}

const DemoFormAlternativeEnhanced = withFormik<DemoFormCustomProps, DemoFormValues>({
  // function called when form is submitted (e.g. submit button has been clicked)
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    // tells Formik that submitting has finished (makes more sense if submit is async call)
    setSubmitting(false)
  },
  // Function returning object with initial form values
  mapPropsToValues: () => ({
    audio: '',
    done: true,
    note: '',
    role: 'basic',
    size: 'M',
    subscribe: false,
    type: 'regular',
    userName: '',
    wysiwyg: EditorState.createWithContent(convertFromRaw({
      blocks: [
        {
          data: {},
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
          key: 'bj0sr',
          text: 'Test WYSIWYG initial text',
          type: 'unstyled'
        }
      ],
      entityMap: {}
    }))
  })
})(DemoFormAlternative)

export default DemoFormAlternativeEnhanced
