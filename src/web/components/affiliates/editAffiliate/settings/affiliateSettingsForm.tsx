// import { templateOptions } from '#veewme/web/common/consts'
import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import { OptionValue } from '#veewme/web/common/formikFields/selectField'
import Syndication from '#veewme/web/common/formPanels/syndication'
import Terms from '#veewme/web/common/formPanels/termsOfService'
import TourTemplate from '#veewme/web/common/formPanels/tourTemplate'
import * as Grid from '#veewme/web/common/grid'
import { useIsDesktopView } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import CalendarSettings from '../../../../common/formPanels/calendarSettings'
import ExternalUploadLink from '../../../../common/formPanels/externalUploadLink'
import FauxVideoMusic from '../../../../common/formPanels/fauxVideoMusic'
import PhotoExports from '../../../../common/formPanels/photoExports'
import RealEstateSiteMediaGallery from '../../../../common/formPanels/realEstateSiteMediaGallery'
import Settings from '../../../../common/formPanels/settings'
import UsefulLinks from '../../../../common/formPanels/usefulLinks'
import WhiteLabel from '../../../../common/formPanels/whiteLabel'
import { EditAffiliateSettingsNavigation } from '../editAffiliateSidebar/editAffiliateNavigation'
import MetaData from '../editAffiliateSidebar/metaData'
import { AffiliateSettings, EditAffiliateValues } from '../types'
import { AffiliateSettingsValidationSchema } from '../validation'

export interface FormOptions {
  audioTrackOptions: OptionValue[]
  regionOptions: OptionValue[]
}

interface EditAffiliateCustomProps {
  initialValues: AffiliateSettings
  onSubmit: (values: AffiliateSettings) => void
  name: string
}

type AffiliateSettingsProps = FormikProps<AffiliateSettings> & EditAffiliateCustomProps

const AffiliateSettings: React.FunctionComponent<AffiliateSettingsProps> = props => {
  const [desktopView] = useIsDesktopView()

  return(
    <>
      <Grid.Wrapper as={Form} >
        <Grid.Heading>
          <h1>Affiliate Settings{props.name && `: ${props.name}`}</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <EditAffiliateSettingsNavigation />
          <MetaData
            id={props.values.id}
            showProfileButton
            joinDate={props.initialValues.user.joinDate || ''}
            lastLogIn={props.initialValues.user.lastLogIn || ''}
            userName={`${props.initialValues.user.firstName} ${props.initialValues.user.lastName}`}
          />
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <RealEstateSiteMediaGallery
            values={props.values as EditAffiliateValues} // TODO: refactor component to use correct types
          />
          <ExternalUploadLink
            link={props.values.externalUploadLink}
          />
          <UsefulLinks
            values={{
              loginLink: props.values.loginLink,
              realEstateSiteLink: props.values.realEstateSiteLink,
              signupLink: props.values.signupLink
            }}
          />
          <Settings/>
          <Terms />
          <PhotoExports
            presets={props.values.mediaExports}
          />
          <Syndication />
          <WhiteLabel/>
        </Grid.MainColumn>
        {desktopView &&
          <Grid.RightAside>
            <TourTemplate />
            <FauxVideoMusic/>
            <CalendarSettings />
          </Grid.RightAside>
        }
        <Grid.Footer />
      </Grid.Wrapper>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

export default withFormik<EditAffiliateCustomProps, AffiliateSettings>({
  enableReinitialize: true,
  handleSubmit: (values, { props, setSubmitting }) => {
    log.debug('submit values', values)
    props.onSubmit({ ...values })
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...props.initialValues
  }),
  validateOnChange: false,
  validationSchema: AffiliateSettingsValidationSchema
})(AffiliateSettings)
