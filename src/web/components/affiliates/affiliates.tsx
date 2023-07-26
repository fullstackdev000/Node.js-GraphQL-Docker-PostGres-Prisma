import {
  AffiliatesQuery,
  AffiliatesQueryVariables
} from '#veewme/gen/graphqlTypes'
import { Affiliates } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as Grid from '#veewme/web/common/grid'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import styled from '#veewme/web/common/styled-components'
import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import Affiliate from './affiliate'
import AffiliateItem from './affiliateItem'
import TableHeader from './tableHeader'
import { ColGroup, Table } from './tableItems'

const Legend = styled.div`
  display: flex;
  justify-content: flex-end;
`
const LegendItem = styled.div`
  margin-left:20px;
  font-size: 12px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  &:before {
    display: inline-block;
    width: 10px;
    height: 10px;
    content: '';
    margin-right: 5px;
  }
`
const Unconfirmed = styled(LegendItem)`
  &:before {
    background-color: ${props => props.theme.colors.ORANGE};
  }
`
const Confirmed = styled(LegendItem)`
  &:before {
    background-color: ${props => props.theme.colors.GREEN};
  }
`

const AffiliatesList: React.FunctionComponent = () => {
  const { addToast } = useToasts()
  const { data, loading } = useQuery<AffiliatesQuery, AffiliatesQueryVariables>(
    Affiliates,
    { onError: error => {
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }}
  )

  return (
    <Grid.PageContainer>
      <Grid.Header>Affiliates</Grid.Header>
      <DotSpinnerModal isOpen={loading} />
      {data && data.affiliates && (
        <Table>
          <ColGroup />
          <TableHeader />
          <tbody>
            {data.affiliates && data.affiliates.map(affiliate => {
              return (
                affiliate && <AffiliateItem
                  {...affiliate}
                  key={affiliate.id}
                />
              )
            })}
          </tbody>
        </Table>
      )}
      <Legend>
        <Unconfirmed>Unconfirmed</Unconfirmed>
        <Confirmed>Confirmed</Confirmed>
      </Legend>
    </Grid.PageContainer>
  )
}

const AffiliateRoutes: React.FunctionComponent<RouteComponentProps> = () => (
  <Switch>
    <Route path={privateUrls.editAffiliate} component={Affiliate} />
    <Route exact path={privateUrls.affiliates} component={AffiliatesList}/>
  </Switch>
)

export default AffiliateRoutes
