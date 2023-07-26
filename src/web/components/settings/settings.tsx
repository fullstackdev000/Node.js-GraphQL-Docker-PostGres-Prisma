import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import { StyledMainWrapper } from '../../common/styled'
import TabsBar from '../../common/tabsBar'
import EditTourBanner from './newTourBanner/editTourBanner'
import NewTourBanner from './newTourBanner/newTourBanner'
import Platform from './platform/platform'
import TourBanners from './tourBanner/tourBanners'

class Settings extends React.PureComponent<RouteComponentProps, {}> {
  render () {
    const tabs = [
      {
        label: 'Profile',
        to: privateUrls.settings
      },
      {
        label: 'Platform',
        to: privateUrls.platform
      },
      {
        label: 'Tour Banners',
        plusTo: privateUrls.addTourBanner,
        to: privateUrls.tourBanners
      }
    ]

    return (
      <StyledMainWrapper>
        <TabsBar tabs={tabs}/>
        <Switch>
          <Route exact path={privateUrls.settings} render={() => 'Profile'} />
          <Route exact path={privateUrls.platform} component={Platform} />
          <Route exact path={privateUrls.tourBanners} component={TourBanners} />
          <Route exact path={privateUrls.addTourBanner} component={NewTourBanner} />
          <Route path={privateUrls.editTourBanner} component={EditTourBanner} />
        </Switch>
      </StyledMainWrapper>
    )
  }
}

export default Settings
