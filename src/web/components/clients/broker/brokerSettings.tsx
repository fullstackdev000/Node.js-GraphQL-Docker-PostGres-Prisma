import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import { OptionValue } from '#veewme/web/common/formikFields/selectField'
import FauxVideoMusic from '#veewme/web/common/formPanels/fauxVideoMusic'
import Fees from '#veewme/web/common/formPanels/fees'
import PhotoDownloadPresets from '#veewme/web/common/formPanels/photoDownloadPresets'
import RealEstateFlyerLayout from '#veewme/web/common/formPanels/realEstateFlyerLayout'
import RealEstateSiteMediaShowcase from '#veewme/web/common/formPanels/realEstateSiteMediaShowcase'
import RealEstateSiteMediaStyle from '#veewme/web/common/formPanels/realEstateSiteMediaStyle'
import SiteTourSettings from '#veewme/web/common/formPanels/siteTourSettings'
import Syndication from '#veewme/web/common/formPanels/syndication'
import TourTemplate from '#veewme/web/common/formPanels/tourTemplate'
import { BrokerSettingsFormValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as Grid from '#veewme/web/common/grid'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { BrokerSettingsNavigation } from './brokerNavigation'

export interface FormOptions {
  regionOptions: OptionValue[]
}

interface BrokerCustomProps {
  formOptions: FormOptions
  values: BrokerSettingsFormValues
  onSubmit: (values: BrokerSettingsFormValues) => void
  name?: string
}

type BrokerFormProps = FormikProps<BrokerSettingsFormValues> & BrokerCustomProps

const BrokerForm: React.FunctionComponent<BrokerFormProps> = props => {
  return (
    <>
      <Grid.Wrapper as={Form}>
        <Grid.Heading>
          <h1>Broker settings{props.name && `: ${props.name}`}</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <BrokerSettingsNavigation />
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <RealEstateSiteMediaShowcase />
          <SiteTourSettings />
          <PhotoDownloadPresets
            values={props.values.photoDownloadPresets}
          />
          <RealEstateFlyerLayout showDisclaimer />
          <Syndication />
        </Grid.MainColumn>
        <Grid.RightAside>
          <Fees showMoreOptions />
          <TourTemplate />
          <RealEstateSiteMediaStyle />
          <FauxVideoMusic />
        </Grid.RightAside>
        <Grid.Footer />
      </Grid.Wrapper>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

export default withFormik<BrokerCustomProps, BrokerSettingsFormValues>({
  enableReinitialize: true,
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...props.values
  })
})(BrokerForm)
