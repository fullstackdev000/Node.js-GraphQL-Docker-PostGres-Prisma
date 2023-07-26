import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import TabContainer from '../tabContainer'
import Item, { DocumentItemData } from './docItem'

const DocumentsWrapperStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 25px;
  grid-row-gap: 25px;
  padding: 0 15px 0 0;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface DocumentsListProps {
  documents: DocumentItemData[]
}

export const DocumentsList: React.FunctionComponent<DocumentsListProps> = props => (
  <Scrollbars
    autoHeight={true}
    autoHeightMax={`calc(85vh - 245px)`}
    autoHide={false}
    autoHeightMin='250px'
  >
    <DocumentsWrapperStyled>
      {props.documents.map(doc => <Item key={doc.id} document={doc} />)}
    </DocumentsWrapperStyled>
  </Scrollbars>
)

interface DocumentsWrapperProps {
  documents: DocumentItemData[]
}

const DocumentsWrapper: React.FunctionComponent<DocumentsWrapperProps> = props => (
  <TabContainer>
    <DocumentsList documents={props.documents} />
  </TabContainer>
)

export default DocumentsWrapper
