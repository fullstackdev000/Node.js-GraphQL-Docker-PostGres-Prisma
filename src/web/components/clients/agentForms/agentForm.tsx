import { Role } from '#veewme/gen/graphqlTypes'
import { unsetNumberId } from '#veewme/web/common/consts'
import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import AccountInformation from '#veewme/web/common/formPanels/accountInformation'
import Brokerage from '#veewme/web/common/formPanels/brokerage'
import ContactInformation from '#veewme/web/common/formPanels/contactInformation'
import Notifications from '#veewme/web/common/formPanels/notifications'
import PluginTracking from '#veewme/web/common/formPanels/pluginTracking'
import Region from '#veewme/web/common/formPanels/region'
import SocialMedia from '#veewme/web/common/formPanels/socialMedia'
import Syndication from '#veewme/web/common/formPanels/syndication'
import { AgentValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import { useIsDesktopView } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { EditorState } from 'draft-js'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Grid from '../../../common/grid'
import AgentNavigation from './agentFormSidebar/agentNavigation'
import MetaData from './agentFormSidebar/metaData'
import { AffiliateFormOptions } from './types'
import AgentValidationSchema from './validation'

interface AgentFormCustomProps {
  affiliate?: AffiliateFormOptions
  role: Role
  initialData?: Partial<AgentValues>
  onSubmit: (values: AgentValues) => void
  name?: string
}

type AgentFormProps = FormikProps<AgentValues> & AgentFormCustomProps

const AgentForm: React.FunctionComponent<AgentFormProps> = props => {
  const [desktopView] = useIsDesktopView()
  return(
    <>
      <Grid.Wrapper as={Form} >
        <Grid.Heading>
          <h1>Agent profile{props.name && `: ${props.name}`}</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <AgentNavigation role={props.role} />
          <MetaData
            id={props.values.id}
            showSettingsBtn
            joinDate={props.initialValues.user.joinDate || ''}
            lastLogIn={props.initialValues.user.lastLogIn || ''}
            userName={`${props.initialValues.user.firstName} ${props.initialValues.user.lastName}`}
          />
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <AccountInformation role={props.role} />
          {!desktopView && <ContactInformation showAgentOptions />}
          <Brokerage
            brokers={props.affiliate
              ? props.affiliate.brokerages.map(brokerage => ({
                ...brokerage,
                logoUrl: 'https://placeimg.com/400/175/arch' // TODO replace when uploading files is implemented to brokerage
              }))
              : []
            }
          />
          {props.role === 'AFFILIATE' && <Notifications />}
          <Syndication />
          {props.role === 'AFFILIATE' && <PluginTracking />}
          <SocialMedia />
          {!desktopView && props.role === 'AFFILIATE' && <Region
            options={props.affiliate
              ? props.affiliate.regions.map(region => ({
                label: region.label,
                value: region.id
              }))
              : []
            }
          />}
        </Grid.MainColumn>
        {desktopView &&
          <Grid.RightAside>
            <ContactInformation showAgentOptions />
            {props.role === 'AFFILIATE' && <Region
              options={props.affiliate
                ? props.affiliate.regions.map(region => ({
                  label: region.label,
                  value: region.id
                }))
                : []
              }
            />}
          </Grid.RightAside>
        }
        <Grid.Footer />
      </Grid.Wrapper>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

export default withFormik<AgentFormCustomProps, AgentValues>({
  handleSubmit: (values, { props, setSubmitting }) => {
    log.debug(values)
    const userCopy = {
      ...values.user
    }
    delete userCopy.joinDate
    delete userCopy.lastLogIn

    props.onSubmit({
      ...values,
      user: {
        ...userCopy
      }
    })
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    agentAvatar: '',
    agentMLSid: '',
    bio: EditorState.createEmpty(),
    brokerageId: props.affiliate && props.affiliate.brokerages && props.affiliate.brokerages[0].id || unsetNumberId,
    city: '',
    country: 'US',
    defaultColorScheme: { b: 62 , g: 204 , r: 159 },
    designations: '',
    emailCC: '',
    emailCCorderCompleted: false,
    emailCCorderPlaced: false,
    emailOffice: '',
    flyerLayout: 'FEATURED1',
    hideFlyerFromRealEstateSiteTour: false,
    notifications: {
      newTourOrder: false,
      tourActivated: false
    },
    officeAdmin: false,
    others: '',
    phone: '',
    phoneMobile: '',
    phoneOffice: '',
    profileUrl: '',
    regionId: props.affiliate && props.affiliate.regions && props.affiliate.regions[0].id || unsetNumberId,
    specialPricing: false,
    state: 'AL',
    street: '',
    templateId:  props.affiliate && props.affiliate.brokerages && props.affiliate.brokerages[0].templateId || unsetNumberId,
    title: '',
    user: {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    },
    website: '',
    zip: '',
    ...props.initialData
  }),
  validateOnChange: false,
  validationSchema: AgentValidationSchema
})(AgentForm)
