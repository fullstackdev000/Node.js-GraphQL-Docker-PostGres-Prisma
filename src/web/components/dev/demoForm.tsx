import { convertFromRaw, EditorState } from 'draft-js'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Grid from '../../common/grid'
import styled from '../../common/styled-components'
import Aside from './demoFormComponents/aside'
import CardPanel from './demoFormComponents/cardPanel'
import GridPanel from './demoFormComponents/gridPanel'
import GridPanel2 from './demoFormComponents/gridPanel2'
import RadioButtons from './demoFormComponents/radioButtons'
import { DemoFormValues } from './demoFormComponents/types'
import WysiwygPanel from './demoFormComponents/wysiwygPanel'
import WysiwygPanelSide from './demoFormComponents/wysiwygPanelSide'

const GridForm = styled(Form)`width: 100%;`

// Custom Props passed from parent to formik component e.g. submit handler or initial data
interface DemoFormCustomProps {
  onSubmit: (val: DemoFormValues) => void
}

type DemoFormProps = DemoFormCustomProps & FormikProps<DemoFormValues>

class DemoForm extends React.Component<DemoFormProps, {}> {
  render () {
    const {
      dirty
    } = this.props

    return (
      <GridForm>
        <Grid.Wrapper>
          <Grid.Heading>
            <h1>
              Demo form
              <span>with content in 2 columns and left sidebar that hides on small resolution</span>
            </h1>
          </Grid.Heading>
          <Grid.LeftDesktopAside>
            <Aside />
          </Grid.LeftDesktopAside>
          <Grid.MainColumn>
            <GridPanel dirty={dirty} />
            <RadioButtons dirty={dirty} />
            <WysiwygPanel />
            <CardPanel />
          </Grid.MainColumn>
          <Grid.RightAside>
            <GridPanel2 dirty={dirty} />
            <WysiwygPanelSide />
          </Grid.RightAside>
          <Grid.Footer />
        </Grid.Wrapper>
      </GridForm>
    )
  }
}

const DemoFormEnhanced = withFormik<DemoFormCustomProps, DemoFormValues>({
  // function called when form is submitted (e.g. submit button has been clicked)
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    // tells Formik that submitting has finished (makes more sense if submit is async call)
    setSubmitting(false)
  },
  // Function returning object with initial form values
  mapPropsToValues: () => ({
    color1: {
      a: 1,
      b: 0,
      g:  0,
      r: 200
    },
    color2: {
      a: 1,
      b: 0,
      g:  0,
      r: 200
    },
    done: true,
    note: '',
    rangeSlider: [0, 20],
    role: 'basic',
    size: 'M',
    slider: 10,
    subscribe: false,
    type: 'regular',
    type2: 'circle',
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
    })),
    wysiwyg2: EditorState.createEmpty()
  })
})(DemoForm)

export default DemoFormEnhanced
