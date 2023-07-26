import styled from '#veewme/web/common/styled-components'
import { ContentBlock, convertFromRaw, EntityInstance, RawDraftContentState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import * as React from 'react'

const ArticleElement = styled.article`
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-size: 11px;
  a {
    color: ${props => props.theme.colors.GREEN};
  }
  p {
    margin: 10px 0;
  }
  li {
    padding: 3px 0 3px 5px;
  }
  ol {
    padding-left: 15px;
  }
  ul {
    padding-left: 20px;
    li {
      list-style: disc;
      padding-left: 0;
    }
  }
`

const options = {
  blockStyleFn: (block: ContentBlock) => {
    const data = block.getData()

    let style = {}
    const textAlignData = data.get('text-align')
    if (textAlignData) {
      style = {
        ...style,
        textAlign: textAlignData
      }
    }

    switch (block.getType()) {
      case 'ordered-list-item': return { element: 'ol', style }
      case 'unordered-list-item': return { element: 'ul', style }
      default: return { element: 'p', style }
    }
  },
  entityStyleFn: (entity: EntityInstance) => {
    const data = entity.getData()
    switch (entity.getType().toLowerCase()) {
      case 'link': return {
        attributes: {
          href: data.url,
          target: data.targetOption
        },
        element: 'a'
      }
      default: return {}
    }
  }
}

interface ArticleProps {
  className?: string
  content: RawDraftContentState
}

const Article: React.FunctionComponent<ArticleProps> = props => {
  return (
    <ArticleElement
      className={props.className}
      dangerouslySetInnerHTML={{
        __html: stateToHTML(
          convertFromRaw(props.content),
          options
        )
      }}
    />
  )
}

export default Article
