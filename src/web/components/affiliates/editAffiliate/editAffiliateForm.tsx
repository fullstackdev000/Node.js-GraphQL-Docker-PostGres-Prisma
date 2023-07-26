import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import { OptionValue } from '#veewme/web/common/formikFields/selectField'
import Billing from '#veewme/web/common/formPanels/billing'
import SocialMedia from '#veewme/web/common/formPanels/socialMedia'
import * as Grid from '#veewme/web/common/grid'
import { useIsDesktopView } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Company from '../../../common/formPanels/company'
import Contact from '../../../common/formPanels/contact'
import Regions from '../../../common/formPanels/regions'
import EditAffiliateNavigation from './editAffiliateSidebar/editAffiliateNavigation'
import MetaData from './editAffiliateSidebar/metaData'
import { EditAffiliateValues } from './types'
import AffiliateValidationSchema from './validation'

export interface FormOptions {
  audioTrackOptions: OptionValue[]
  regionOptions: OptionValue[]
}

interface EditAffiliateCustomProps {
  initialValues: EditAffiliateValues
  onSubmit: (values: EditAffiliateValues) => void
  name: string
}

type EditAffiliateFormProps = FormikProps<EditAffiliateValues> & EditAffiliateCustomProps

const EditAffiliateForm: React.FunctionComponent<EditAffiliateFormProps> = props => {
  const [desktopView] = useIsDesktopView()

  return(
    <>
      <Grid.Wrapper as={Form} >
        <Grid.Heading>
          <h1>Affiliate Details{props.name && `: ${props.name}`}</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <EditAffiliateNavigation />
          <MetaData
            id={props.values.id}
            showSettingsBtn
            joinDate={props.initialValues.user.joinDate || ''}
            lastLogIn={props.initialValues.user.lastLogIn || ''}
            userName={`${props.initialValues.user.firstName} ${props.initialValues.user.lastName}`}
          />
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <Company/>
          <Contact/>
          <Billing/>
          <SocialMedia />
        </Grid.MainColumn>
        {desktopView &&
          <Grid.RightAside>
            <Regions
              regions={props.values.regions}
            />
          </Grid.RightAside>
        }
        <Grid.Footer />
      </Grid.Wrapper>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

export default withFormik<EditAffiliateCustomProps, EditAffiliateValues>({
  enableReinitialize: true,
  handleSubmit: (values, { props, setSubmitting }) => {
    log.debug('submit values', values.regions)
    props.onSubmit({ ...values })
    setSubmitting(false)
  },
  mapPropsToValues: props => (props.initialValues),
  validateOnChange: false,
  validationSchema: AffiliateValidationSchema
})(EditAffiliateForm)
