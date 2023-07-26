import { Role } from '#veewme/gen/graphqlTypes'
import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import DefaultColorScheme from '#veewme/web/common/formPanels/defaultColorScheme'
import Music from '#veewme/web/common/formPanels/fauxVideoMusic'
import Fees from '#veewme/web/common/formPanels/fees'
import InternalNote from '#veewme/web/common/formPanels/internalNote'
import OfficeAdmin from '#veewme/web/common/formPanels/officeAdmin'
import RealEstateFlyerLayout from '#veewme/web/common/formPanels/realEstateFlyerLayout'
import RealEstateSiteMediaShowcase from '#veewme/web/common/formPanels/realEstateSiteMediaShowcase'
import SiteTourSettings, { realEstateSiteTourSettingsInitialValues } from '#veewme/web/common/formPanels/siteTourSettings'
import TourTemplate from '#veewme/web/common/formPanels/tourTemplate'

import { useIsDesktopView } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import * as Grid from '../../../../common/grid'
import MetaData from '../agentFormSidebar/metaData'
import AgentNavigation from './agentNavigation'
import { AgentSettings } from './types'

interface AgentFormCustomProps {
  initialData?: Partial<AgentSettings>
  onSubmit: (values: AgentSettings) => void
  role: Role
  name: string
}

type AgentFormProps = FormikProps<AgentSettings> & AgentFormCustomProps

const AgentForm: React.FunctionComponent<AgentFormProps> = props => {
  const [desktopView] = useIsDesktopView()
  return(
    <>
      <Grid.Wrapper as={Form} >
        <Grid.Heading>
          <h1>Agent Settings{props.name && `: ${props.name}`}</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <AgentNavigation role='AGENT' />
          <MetaData
            showProfileButton
            id={props.values.id}
            joinDate={props.initialValues.user.joinDate || ''}
            lastLogIn={props.initialValues.user.lastLogIn || ''}
            userName={props.name}
          />
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <RealEstateSiteMediaShowcase />
          <DefaultColorScheme />
          <SiteTourSettings agentForm />
          {props.role === 'AFFILIATE' && <RealEstateFlyerLayout />}
          {!desktopView && props.role === 'AFFILIATE' && <InternalNote />}
        </Grid.MainColumn>
        {desktopView &&
          <Grid.RightAside>
            {props.role === 'AFFILIATE' && <Fees />}
            {props.role === 'AFFILIATE' && <OfficeAdmin />}
            {props.role === 'AFFILIATE' && <InternalNote />}
            <TourTemplate />
            <Music />
          </Grid.RightAside>
        }
        <Grid.Footer />
      </Grid.Wrapper>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

export default withFormik<AgentFormCustomProps, AgentSettings>({
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
    ...realEstateSiteTourSettingsInitialValues,
    brokerAdmin: false,
    collectPayment: 'ORDER',
    defaultColorScheme: { b: 62 , g: 204 , r: 159 },
    flyerLayout: 'FEATURED1',
    hideFlyerFromRealEstateSiteTour: false,
    internalNote: '',
    officeAdmin: false,
    realEstateSiteMediaShowcase: {
      coverPhoto: '',
      showRealEstateMapOnShowcasePage: false
    },
    showInternalNoteUponOrder: false,
    specialPricing: false,
    templateColor: { b: 62 , g: 204 , r: 159 },
    user: {},
    ...props.initialData
  })
})(AgentForm)
