import {
  RealEstateAddressQuery,
  RealEstateAddressQueryVariables
} from '#veewme/gen/graphqlTypes'
import { RealEstateAddressQuery as AddressQuery } from '#veewme/lib/graphql/queries/orders'
import { NoNullableFields } from '#veewme/web/common/util'

import { useQuery } from '@apollo/react-hooks'

import { privateUrls } from '#veewme/lib/urls'
import { HCardAddress } from '#veewme/web/common/hCard'
import HideForRole from '#veewme/web/common/hideForRole'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, useParams, useRouteMatch } from 'react-router-dom'
import styled from '../../common/styled-components'
import TabsBar, { PureTabProps } from '../../common/tabsBar'
import AddVideo from './addVideo/addVideo'
import DocumentEdit from './documentEdit/documentEdit'
import Documents from './documents/documentsContainer'
import Flyer from './flyer/flyerContainer'
import AddInteractive from './interactiveForm/addInteractive'
import EditInteractive from './interactiveForm/editInteractive'
import Interactives from './interactives/interactives'
import PanoramaEdit from './panoramaEdit/editPanoramaContainer'
import Panoramas from './panoramas/panoramasContainer'
import Photos from './photos/photosContainer'
import Toolbar from './toolbar'
import EditVideo from './videos/edit/editVideo'
import Videos from './videos/videosContainer'

const pageHorizontalPadding = '35px'
const MediaContainer = styled.section`
  padding: 0 ${pageHorizontalPadding} 70px ${pageHorizontalPadding};
  width: 100%;
`

const MediaTabsBar = styled(TabsBar)``

const MediaHeader = styled.header`
  background-color: white;
  display: flex;
  margin: 0 -${pageHorizontalPadding};
  padding: 35px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid ${props => props.theme.colors.BUTTON_BORDER};
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-size: 14px;
  h2 {
    margin-right: 7px;
    font-size: 14px;
  }
`

const TabsHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 15px 0 45px 0;

  header {
    flex: 1 0 auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin-bottom: 25px;

    header {
      width: 100%;
    }
  }
`

type AddressData = NoNullableFields<RealEstateAddressQuery>

const MediaWrappedInTabs: React.FunctionComponent<RouteComponentProps> = props => {
  const { url: orderMediaUrl } = useRouteMatch()
  const { realEstateId } = useParams<{ realEstateId: string }>() // route params always are strings
  const { data } = useQuery<AddressData, RealEstateAddressQueryVariables>(AddressQuery, {
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const tabs = React.useMemo(() => {
    const allTabs: PureTabProps[] = [
      { label: 'Photos', to: `${orderMediaUrl}/photos` },
      { label: 'Video', to: `${orderMediaUrl}/video`, hideForRoles: ['AGENT'] },
      { label: 'Interactive', to: `${orderMediaUrl}/interactive`, hideForRoles: ['AGENT', 'PROCESSOR', 'PHOTOGRAPHER'] },
      { label: 'Panoramas', to: `${orderMediaUrl}/panoramas`, hideForRoles: ['AGENT', 'PROCESSOR', 'PHOTOGRAPHER'] },
      { label: 'Documents', to: `${orderMediaUrl}/documents`, hideForRoles: ['PROCESSOR', 'PHOTOGRAPHER'] },
      { label: 'Flyer', to: `${orderMediaUrl}/flyer`, hideForRoles: [ 'PROCESSOR', 'PHOTOGRAPHER'] }
    ]

    return allTabs
  }, [])

  return (
    <MediaContainer>
      <MediaHeader>
        <h2>Media Management</h2>
        {
          data ?
          <HCardAddress
            address={{
              city: data.realEstate.city,
              state: data.realEstate.state,
              street: data.realEstate.street,
              zip: data.realEstate.zip
            }}
          />
          : 'Loading address ...'
        }
      </MediaHeader>
      <TabsHolder>
        <MediaTabsBar
          tabs={tabs}
        />
        <HideForRole roles={['PROCESSOR']}>
          <Toolbar
            address={data ? data.realEstate.address : ''}
          />
        </HideForRole>
      </TabsHolder>
      <Switch>
        <Route exact path={privateUrls.media} render={({ match }) => <Redirect to={`${match.url}/photos`} />}/>
        <Route exact path={privateUrls.photos} render={() => <Photos address={data && data.realEstate.address} />}/>
        <Route path={privateUrls.documents} component={Documents}/>
        <Route path={privateUrls.flyer} component={Flyer}/>
        <Route path={privateUrls.panoramas} component={Panoramas}/>
        <Route path={privateUrls.interactive} component={Interactives}/>
        <Route path={privateUrls.video} component={Videos}/>
      </Switch>
    </MediaContainer>
  )
}

const Media: React.FunctionComponent<RouteComponentProps> = () => (
  <Switch>
    <Route path={privateUrls.addVideo} component={AddVideo} />
    <Route path={privateUrls.editVideoType} component={EditVideo}/>
    <Route path={privateUrls.editDocument} component={DocumentEdit} />
    <Route path={privateUrls.addInteractive} component={AddInteractive} />
    <Route path={privateUrls.editInteractive} component={EditInteractive} />
    <Route path={privateUrls.editPanorama} component={PanoramaEdit} />
    <Route path={privateUrls.media} component={MediaWrappedInTabs}/>
  </Switch>
)

export default Media
