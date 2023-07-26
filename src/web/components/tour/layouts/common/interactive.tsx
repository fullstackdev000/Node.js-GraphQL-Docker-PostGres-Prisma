import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { Tour } from '../../types'
import EmbeddedViewer from './embeddedViewer'
import Gallery from './interactiveWithPhotos'

const EmbedWrapper = styled.div<{
  theaterMode?: boolean
}>`
  ${props => props.theaterMode ?
    `
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    `
    : `
      width: 80%;
      margin: auto;
    `
  }
`
interface InteractivesProps {
  interactive: Tour['interactives'][0]
}

const Interactive: FunctionComponent<InteractivesProps> = ({ interactive }) => {
  return (
    <>
      {
        interactive.type !== 'FLOORPLAN_PHOTOS' ?
          <EmbedWrapper theaterMode={interactive.theaterMode}>
            <EmbeddedViewer
              code={interactive.embeddedCode}
            />
          </EmbedWrapper>
        : (
          <Gallery
            key={interactive.id}
            photos={
              interactive.files.map(f => (
              {
                fullUrl: f.file.path,
                id: f.file.id,
                title: f.label
              }
            ))}
          />
        )
      }
    </>
  )
}
export default Interactive
