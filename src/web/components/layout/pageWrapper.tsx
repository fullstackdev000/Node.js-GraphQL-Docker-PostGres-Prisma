import { MeLogoQuery, MeQuery } from '#veewme/graphql/types'
import { Me, MeLogo } from '#veewme/lib/graphql/queries'
import { privateUrls, publicUrls } from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { isAffiliateAccount } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import styled from '../../common/styled-components'
import { HEADER_HEIGHT_PX, SIDEBAR_WIDTH_PX } from './panel/constants'
import Header from './panel/header/header'
import Sidebar from './panel/sidebar/sidebar'
import PublicPageWrapper from './publicPage/publicPage'

const Main = styled.section`
  display: flex;
  min-height: calc(100vh - ${HEADER_HEIGHT_PX}px);
  margin-top: ${HEADER_HEIGHT_PX}px;
  margin-left: ${SIDEBAR_WIDTH_PX}px;
  bottom: 0;
  min-width: 470px;
  background-color: ${props => props.theme.colors.BACKGROUND};
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`

const NoBrokerWarningStyled = styled.div`
  a {
    margin-top: 20px;
  }
`

const NoBrokerWarning: React.FC<{
  onClick: () => void
}> = props => (
  <NoBrokerWarningStyled
    onClick={props.onClick}
  >
    <p>There are no Brokerages in your system.</p>
    <Button
      buttonTheme='alert'
      full
      label='Add Brokerage'
      size='medium'
      to={privateUrls.addBrokerage}
    />
  </NoBrokerWarningStyled>
)

export const PrivatePage: React.ComponentClass = withRouter(props => {
  const { addToast, removeAllToasts } = useToasts()

  const { data, loading: loadingAccount } = useQuery<MeQuery>(Me, {
    fetchPolicy: 'network-only',
    onError: () => props.history.push(publicUrls.login)
  })

  const checkedIfBrokerExistsOnLoad = React.useRef(false)

  React.useEffect(() => {
    if (data && !checkedIfBrokerExistsOnLoad.current) {
      // Warning should be shown only on first data load.
      // If below line was moved to next `if` statement warning
      // could be shown anytime when user deletes all brokerages later during app session
      checkedIfBrokerExistsOnLoad.current = true

      const { me: { account } } = data
      if (isAffiliateAccount(account) && account.brokerages && !account.brokerages.length) {
        addToast(
          <NoBrokerWarning onClick={removeAllToasts} />,
          { appearance: 'error', autoDismissTimeout: 2500 }
        )
      }
    }
  }, [data])

  /**
   * Loading logo requires separate query in this case. Main `MeQuery` results are cached
   * and other components reads this data from the cache. But there is a problem when `profilePicture` field is not available
   * in query data (because image hasn't been set) because Apollo Cache expects this field to be always present.
   * As a result app crashes.
   * TODO: investigate if there is any other way to fix it.
   */
  const { data: logoData, loading: loadingLogo } = useQuery<MeLogoQuery>(MeLogo, {
    fetchPolicy: 'network-only'
  })

  let logoUrl: string = ''
  if (logoData && logoData.me.account.__typename === 'Affiliate') {
    logoUrl = logoData.me.account.profilePicture ? logoData.me.account.profilePicture.path : ''
  } else if (logoData && logoData.me.account.__typename === 'Agent') {
    logoUrl = logoData.me.account.affiliate.profilePicture ? logoData.me.account.affiliate.profilePicture.path : ''
  }

  const loading = loadingAccount || loadingLogo

  return (
    <>
      <Header
        me={data && data.me}
        logoUrl={logoUrl}
        loading={loading}
      />
      <Sidebar role={data && data.me.role} />
      <Main>
        <DotSpinnerModal isOpen={loading} />
        {data && data.me && !loading && props.children}
      </Main>
    </>
  )
})

export const PublicPage: React.FunctionComponent = props => (
  <PublicPageWrapper>
    {props.children}
  </PublicPageWrapper>
)
