import Article from '#veewme/web/common/article'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import * as Grid from '#veewme/web/common/grid'
import Panel from '#veewme/web/common/panel'
import { convertFromRaw, convertToRaw, EditorState, RawDraftContentState } from 'draft-js'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

interface DemoDisplayArticleValues {
  article: EditorState
}

type DemoDisplayArticleProps = FormikProps<DemoDisplayArticleValues>

const DemoDisplayArticle: React.FunctionComponent<DemoDisplayArticleProps> = props => {
  return (
    <Grid.Wrapper as={Form}>
      <Grid.Heading>
        <h1>Demo display article</h1>
      </Grid.Heading>
      <Grid.MainColumn centerColumn>
        <Panel>
          <Article content={convertToRaw(props.values.article.getCurrentContent())} />
        </Panel>
        <Panel>
          <Field
            name='article'
            label='Demo article'
            component={Editor}
          />
        </Panel>
      </Grid.MainColumn>
    </Grid.Wrapper>
  )
}

export default withFormik<DemoDisplayArticleProps, DemoDisplayArticleValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    article: EditorState.createWithContent(convertFromRaw(content))
  })
})(DemoDisplayArticle)

// tslint:disable:object-literal-sort-keys
// tslint:disable:object-literal-key-quotes
export const content: RawDraftContentState = {
  blocks: [
    {
      key: 'bqui7',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi suscipit fermentum facilisis. Etiam nec facilisis mauris. Pellentesque quis elit ipsum. Ut sodales at erat id molestie. Sed vel libero et quam  rutrum ornare a ut tellus. Duis luctus purus in mi aliquet pulvinar. In vehicula est ac placerat mattis. Quisque eu accumsan nulla.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 151, length: 18, style: 'UNDERLINE' },
        { offset: 151, length: 18, style: 'ITALIC' },
        { offset: 151, length: 18, style: 'BOLD' }
      ],
      entityRanges: [ { offset: 183, length: 22, key: 0 } ],
      data: {}
    },
    {
      key: 'agd3c',
      text: 'Aenean feugiat fringilla tortor ultricies fermentum.',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    },
    {
      key: '28gia',
      text: 'Nulla id tincidunt nulla. Suspendisse a nibh non orci vestibulum ornare. Ut ac dolor malesuada, ullamcorper libero ut, pulvinar augue. Nam tempor mauris est, et fringilla tortor consequat ut. Sed risus odio,  finibus id interdum vel, tempor sit amet lorem.',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [ { offset: 54, length: 17, style: 'ITALIC' } ],
      entityRanges: [],
      data: {}
    },
    {
      key: '1m0j1',
      text: 'Proin ullamcorper nunc imperdiet magna auctor , quis sodales massa dapibus. Mauris in mi augue. Donec ut mollis magna.',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [ { offset: 23, length: 22, style: 'BOLD' } ],
      entityRanges: [],
      data: {}
    },
    {
      key: 'eijg',
      text: 'Maecenas at augue eu mi accumsan dignissim.',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    },
    {
      key: '7a7ka',
      text: ' Integer est enim, tempor at nisl a, lobortis eleifend nisl. Ut efficitur lectus et est tempus, vel pellentesque felis imperdiet.',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    },
    {
      key: '6d156',
      text: 'Quisque rutrum sed nibh eu viverra.',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [ { offset: 15, length: 19, style: 'UNDERLINE' } ],
      entityRanges: [],
      data: {}
    },
    {
      key: '1nj8a',
      text: 'Curabitur ac lorem vitae justo facilisis suscipit. Donec ut dictum lectus. Cras feugiat, enim congue faucibus maximus, turpis nibh laoreet lorem, ac euismod velit mi sed nibh . Pellentesque interdum quam vel magna imperdiet auctor. Phasellus volutpat tortor eu elit sagittis mattis. Nam sit amet sem facilisis, euismod odio non, scelerisque sapien. Ut nec pretium tortor',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [ { offset: 146, length: 28, key: 1 } ],
      data: {}
    }
  ],
  entityMap: {
    '0': {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: { url: 'http://google.com', targetOption: '_self' }
    },
    '1': {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: { url: 'http://facebook.com', targetOption: '_blank' }
    }
  }
}
// tslint:enable:object-literal-sort-keys
// tslint:enable:object-literal-key-quotes
