import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'

import { UnreachableCaseError } from '#veewme/lib/error'
import Article from '#veewme/web/common/article'
import * as Grid from '#veewme/web/common/grid'
import HideForRole from '#veewme/web/common/hideForRole'
import styled from '#veewme/web/common/styled-components'
import { RawDraftContentState } from 'draft-js'
import * as React from 'react'

import { MeSupportQuery } from '#veewme/graphql/types'
import { MeSupport } from '#veewme/lib/graphql/queries'
import { useQuery } from '@apollo/react-hooks'

const Heading = styled(Grid.Heading)`
  button  {
    display: none;
  }
`

const Content = styled(Grid.MainColumnFullWidth)`
  &&& {
    grid-column-start: 1;
  }
`

const ArticleStyled = styled(Article)`
  font-size: 15px;
`

const NonAffiliateSupportPage = () => {
  const { data, loading } = useQuery<MeSupportQuery>(MeSupport)

  if (loading) {
    return (
      <DotSpinnerModal
        isOpen
      />
    )
  }
  if (data) {
    const { account } = data.me
    let contentToShow: RawDraftContentState | undefined

    if (account.__typename) {
      switch (account.__typename) {
        case 'Affiliate':
          contentToShow = undefined
          break
        case 'Agent':
          contentToShow = account.affiliate.supportAgent
          break
        case 'Photographer':
          contentToShow = account.affiliate.supportPhotographer
          break
        case 'Processor':
          contentToShow = account.affiliate.supportProcessor
          break
        default:
          throw new UnreachableCaseError(account.__typename)
      }
    }

    return contentToShow ? (
      <ArticleStyled content={contentToShow} />
    ) : null
  } else {
    return null
  }
}

const AffiliateSupportPage = () => {
  return (
    <div>Affiliate support page</div>
  )
}
interface SupportPageProps {

}

const SupportPage: React.FC<SupportPageProps> = props => {
  return (
    <>
      <Grid.Wrapper>
        <Heading>
          <h1>Support page</h1>
        </Heading>
        <Content>
          <HideForRole
            action='show'
            roles={['AFFILIATE']}
          >
            <AffiliateSupportPage />
          </HideForRole>
          <HideForRole
            action='hide'
            roles={['AFFILIATE']}
          >
            <NonAffiliateSupportPage />
          </HideForRole>
        </Content>
      </Grid.Wrapper>
    </>
  )
}

export default SupportPage
