import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { Link, Route, RouteComponentProps } from 'react-router-dom'
import { StyledMainWrapper } from '../../common/styled'
import styled from '../../common/styled-components'
import DemoAffiliateCalendar from './demoAffiliateCalendar'
import DemoApi from './demoApi'
import DemoAvatars from './demoAvatars'
import DemoButtons from './demoButtons'
import DemoCalendar from './demoCalendar'
import DemoChips from './demoChips'
import DemoDisplayArticle from './demoDisplayArticle'
import DemoForm from './demoForm'
import DemoFormAlternative from './demoFormAlternative'
import { DemoFormValues } from './demoFormComponents/types'
import DemoValidation from './demoFormValidation'
import DemoGridNoContent from './demoGridNoContent'
import DemoMedia from './demoMedia'
import DemoModal from './demoModal'
import DemoPayment from './demoPayment'
import DemoPhotosUpload from './demoPhotosUpload'
import DemoReportPDF from './demoReport'
import DemoSpinners from './demoSpinners'
import DemoToast from './demoToast'
import DemoUpload from './demoUpload'
import DemoUploadImages from './demoUploadImages'

const NavList = styled.ul`
  padding: 20px 0;

  li {
    padding: 5px 0;

      a {
        color: ${props => props.theme.colors.FIELD_TEXT};

        &:hover {
          color: ${props => props.theme.colors.GREEN};
        }
      }
  }
`
const Main: React.FunctionComponent<RouteComponentProps> = () => (
  <StyledMainWrapper>
    <NavList>
      <li>
        <Link to={privateUrls.demoForm}>Demo Form</Link>
      </li>
      <li>
        <Link to={privateUrls.demoFormAlt}>Demo Form Alternative</Link>
      </li>
      <li>
        <Link to={privateUrls.demoGridNoContent}>Demo Grid No Content</Link>
      </li>
      <li>
        <Link to={privateUrls.demoButtons}>Demo Buttons</Link>
      </li>
      <li>
        <Link to={privateUrls.demoModals}>Demo Modals</Link>
      </li>
      <li>
        <Link to={privateUrls.demoAvatars}>Demo Avatars</Link>
      </li>
      <li>
        <Link to={privateUrls.demoApi}>Demo API</Link>
      </li>
      <li>
        <Link to={privateUrls.demoSpinners}>Demo Spinners</Link>
      </li>
      <li>
        <Link to={privateUrls.demoToasts}>Demo Toasts</Link>
      </li>
      <li>
        <Link to={privateUrls.demoMedia}>Demo Media</Link>
      </li>
      <li>
        <Link to={privateUrls.demoValidation}>Demo Form Validation</Link>
      </li>
      <li>
        <Link to={privateUrls.demoChips}>Demo Chips</Link>
      </li>
      <li>
        <Link to={privateUrls.demoUpload}>Demo Upload</Link>
      </li>
      <li>
        <Link to={privateUrls.demoUploadImages}>Demo Upload Images</Link>
      </li>
      <li>
        <Link to={privateUrls.demoCalendar}>Demo Order Calendars</Link>
      </li>
      <li>
        <Link to={privateUrls.demoAffiliateCalendar}>Demo Affiliate Calendars</Link>
      </li>
      <li>
        <Link to={privateUrls.demoReport}>Demo Report PDF</Link>
      </li>
      <li>
        <Link to={privateUrls.demoDisplayArticle}>Demo display article</Link>
      </li>
      <li>
        <Link to={privateUrls.demoPhotosUpload}>Demo Photos Upload</Link>
      </li>
      <li>
        <Link to={privateUrls.demoPayment}>Demo Payment</Link>
      </li>
    </NavList>
  </StyledMainWrapper>
)

const Dev: React.FunctionComponent<RouteComponentProps> = () => (
  <>
    <Route exact path={privateUrls.dev} component={Main} />
    <Route
      path={privateUrls.demoForm}
      render={() => <DemoForm onSubmit={(values: DemoFormValues) => log.debug('submit', JSON.stringify(values))}/>}
    />
    <Route
      path={privateUrls.demoFormAlt}
      render={() => <DemoFormAlternative onSubmit={values => log.debug('submit', JSON.stringify(values))}/>}
    />
    <Route
      path={privateUrls.demoGridNoContent}
      render={() => <DemoGridNoContent />}
    />
    <Route path={privateUrls.demoButtons} component={DemoButtons} />
    <Route path={privateUrls.demoModals} component={DemoModal} />
    <Route path={privateUrls.demoAvatars} component={DemoAvatars} />
    <Route path={privateUrls.demoApi} component={DemoApi} />
    <Route path={privateUrls.demoSpinners} component={DemoSpinners} />
    <Route path={privateUrls.demoToasts} component={DemoToast} />
    <Route path={privateUrls.demoMedia} component={DemoMedia} />
    <Route path={privateUrls.demoValidation} component={DemoValidation} />
    <Route path={privateUrls.demoChips} component={DemoChips} />
    <Route path={privateUrls.demoUpload} component={DemoUpload} />
    <Route path={privateUrls.demoUploadImages} component={DemoUploadImages} />
    <Route path={privateUrls.demoCalendar} component={DemoCalendar} />
    <Route path={privateUrls.demoAffiliateCalendar} component={DemoAffiliateCalendar} />
    <Route path={privateUrls.demoReport} component={DemoReportPDF} />
    <Route path={privateUrls.demoDisplayArticle} component={DemoDisplayArticle} />
    <Route path={privateUrls.demoPhotosUpload} component={DemoPhotosUpload} />
    <Route path={privateUrls.demoPayment} component={DemoPayment} />
  </>
)

export default Dev
