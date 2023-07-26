import {
  DemoReportPdfQuery,
  DemoReportPdfQueryVariables
} from '#veewme/gen/graphqlTypes'
import { ReportPDF } from '#veewme/lib/graphql/queries'
import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'

export const DownloadLink = styled.a`
  display: flex;
  flex: 1 0 auto;
  justify-content: space-between;
`

const DemoReportPDF: React.FunctionComponent = () => {

  const { data, loading } = useQuery<DemoReportPdfQuery, DemoReportPdfQueryVariables>(
    ReportPDF,
    { onError: error => log.debug('Query Agents error:', error.message) }
  )

  if (loading) {
    return (
      <p>Loading data...</p>
    )
  }
  if (data && data.demoReportPDF.url) {
    return (
      <>
        <DownloadLink href={data.demoReportPDF.url} title='Download' download='report.pdf' type='application/pdf' target='_blank'>
          Demo download
        </DownloadLink>
      </>
    )
  } else {
    return (
      <p>No file</p>
    )
  }
}

export default DemoReportPDF
