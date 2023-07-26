import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import dimensions from './dimensionsConstants'
import Footer from './footer'
import Header from './header'

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding-top: ${dimensions.headerHeight};
`

const Main = styled.main`
  flex: 1;
`

const PublicPage: React.FunctionComponent = props => {
  return (
    <PageWrapper>
      <Header />
      <Main>{props.children}</Main>
      <Footer />
    </PageWrapper>
  )
}

export default PublicPage
