import { privateUrls, publicUrls } from '#veewme/lib/urls'
import FinalizeSplitPayment from '#veewme/web/common/payment/finalizeSplitPayment'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Account from '../account/account'
import AccountSettings from '../account/settings'
import Affiliates from '../affiliates/affiliates'
import LogOut from '../auth/logOut'
import AffiliateCalendar from '../calendar/affiliateCalendarContainer'
import OrderCalendar from '../calendar/orderCalendarContainer'
import ChangePassword from '../changePassword/changePassword'
import Clients from '../clients/client'
import Dashboard from '../dashboard/dashboard'
import Dev from '../dev/dev'
import Domains from '../domains'
import Employees from '../employees/employees'
import Jobs from '../jobs/jobs'
import Home from '../landingPage/home/home'
import LogIn from '../landingPage/logIn/logIn'
import ResetPassword from '../landingPage/resetPassword'
import SetPassword from '../landingPage/setPassword'
import SignUp from '../landingPage/signup/signup'
import Media from '../media/media'
import MediaAccess from '../mediaAccess'
import OrderDetails from '../orders/details'
import Orders from '../orders/orders'
import Compensation from '../photographers/compensation/compensationTable'
import Photographers from '../photographers/photographers'
import Services from '../services/services'
import Settings from '../settings/settings'
import Subscription from '../subscription'
import MySupport, { SupportPage } from '../support'
import Tour from '../tour'
import ToursGallery from '../toursGallery/container'
import { PrivatePage, PublicPage } from './pageWrapper'

const PrivateRoutes: React.FunctionComponent = () => (
  <PrivatePage>
    <Switch>
      <Route exact path={privateUrls.account} component={Account} />
      <Route exact path={privateUrls.changePassword} component={ChangePassword} />
      <Route path={privateUrls.accountSettingsPath} component={AccountSettings} />
      <Route path={privateUrls.affiliates} component={Affiliates} />
      <Route path={privateUrls.clients} component={Clients} />
      <Route path={privateUrls.employees} component={Employees} />
      <Route path={privateUrls.media} component={Media} />
      <Route path={privateUrls.orderCalendar} component={OrderCalendar} />
      <Route path={privateUrls.orderDetails} component={OrderDetails} />
      <Route path={privateUrls.orders} component={Orders} />
      <Route path={privateUrls.mediaAccess} component={MediaAccess} />
      <Route path={privateUrls.photographers} component={Photographers} />
      <Route path={privateUrls.compensation} component={Compensation} />
      <Route path={privateUrls.services} component={Services} />
      <Route path={privateUrls.domains} component={Domains} />
      <Route path={privateUrls.settings} component={Settings} />
      <Route path={privateUrls.dev} component={Dev} />
      <Route path={privateUrls.jobs} component={Jobs} />
      <Route path={privateUrls.calendar} component={AffiliateCalendar} />
      <Route path={privateUrls.mySupport} component={MySupport} />
      <Route path={privateUrls.subscription} component={Subscription} />
      <Route path={privateUrls.support} component={SupportPage} />
      <Route path={privateUrls.finalizeSplitPayment} component={FinalizeSplitPayment} />
      <Route exact path={privateUrls.dashboard} component={Dashboard} />
    </Switch>
  </PrivatePage>
)

const PublicRoutes: React.FunctionComponent = () => (
  <PublicPage>
    <Switch>
      <Route path={publicUrls.login} component={LogIn} />
      <Route path={publicUrls.logout} component={LogOut} />
      <Route path={publicUrls.reset} component={ResetPassword} />
      <Route path={publicUrls.setPassword} component={SetPassword} />
      <Route path={publicUrls.pricing} render={() => 'pricing'} />
      <Route path={publicUrls.privacyPolicy} render={() => 'privacy policy'} />
      <Route path={publicUrls.signup} component={SignUp} />
      <Route path={publicUrls.termsAndConditions} render={() => 'terms and conditions'} />
      <Route path={publicUrls.tours} render={() => 'tours'} />
      <Route path={publicUrls.landingPage} component={Home} />
    </Switch>
  </PublicPage>
)

const Main: React.FunctionComponent = () => (
  <Switch>
    <Route path={privateUrls.panel} component={PrivateRoutes} />
    <Route path={publicUrls.tour} component={Tour} />
    <Route path={publicUrls.toursGallery} component={ToursGallery} />
    <Route path={publicUrls.publicPage} component={PublicRoutes} />
  </Switch>
)

export default Main
