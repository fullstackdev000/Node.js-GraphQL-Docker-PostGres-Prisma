import styled from '#veewme/web/common/styled-components'
import { OrderDocument, OrderDocumentBase } from '#veewme/web/components/media/types'
import * as React from 'react'
import { BottomHolder, DownloadLink, Meta } from '../styled'

import { Download, File } from 'styled-icons/boxicons-regular'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 180px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  max-width: 215px;
`

const TopHolder = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.colors.BACKGROUND};
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};

  svg {
    fill: ${props => props.theme.colors.INFO_BORDER}};
  }
`

const IconHolder = styled.div`
  display: flex;
  align-items: center;
`

const Extension = styled.span`
  line-height: 1;
  margin-left: 5px;
  min-width: 45px;
  font-weight: 600;
  font-size: 22px;
  color: ${props => props.theme.colors.INFO_BORDER};
  text-transform: uppercase;
`

const Title = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 15px;
`

export type DocumentItemData = OrderDocumentBase & Pick<OrderDocument, 'downloadUrl'>

interface DocumentItemProps {
  document: DocumentItemData
}

const DocumentItem: React.FunctionComponent<DocumentItemProps> = ({ document }) => (
  <Wrapper>
    <TopHolder>
      <IconHolder>
        <File size='40' />
        <Extension>{document.extension}</Extension>
      </IconHolder>
    </TopHolder>
    <BottomHolder>
      <Title>{document.label}</Title>
      <Meta>
        <span>{`${(document.size / 1024).toFixed(1)} MB, ${document.extension}`}</span>
        <span>
          <DownloadLink href={document.downloadUrl} title='Download' download>
            <Download size='24' />
          </DownloadLink>
        </span>
      </Meta>
    </BottomHolder>
  </Wrapper>
)

export default DocumentItem
