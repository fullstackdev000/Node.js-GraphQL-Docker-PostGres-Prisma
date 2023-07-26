import { nameof } from '#veewme/lib/util'
import Switch from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { RealEstateSiteTourSettingsValues } from './valuesInterfaces'

export const realEstateSiteTourSettingsInitialValues: RealEstateSiteTourSettingsValues = {
  adminChargeEmailNotification: true,
  allowAdminAccessToCompanyListings: false,
  allowAdminToPlaceOrdersOnBehalfAgent: false,
  appointmentEmailConfirmation: true,
  newOrderEmailNotification: true,
  photographerAssignedServiceEmail: true,
  propertySiteActivatedEmail: true,
  removeExternalLinksFromUnbrandedTour: false,
  removeOpenHouseBannerFromUnbrandedTour: false,
  removePhotographerBrandingFromBrandedTour: false,
  removePhotographerBrandingFromUnbrandedTour: false,
  removeRealEstateAddressFromUnbrandedTours: false,
  removeSocialMediaSharingFromUnbrandedTour: false,
  showOfficesListing: true,
  showSearchBarOnGalleryHeader: false,
  showViewAdditionalPropertiesButtonOnTour: true
}

const SwitchDescription = styled.div`
  padding-right: 30px;
  font-size: 13px;
  line-height: 1.5;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const SiteTourSettings: React.FunctionComponent<{
  agentForm?: boolean
}> = props => {
  return (
    <Panel heading='Property Site / Tour Settings' id='siteTourSettings' toggleable>
      {
        !props.agentForm && (
          <>
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('removeExternalLinksFromUnbrandedTour')}
              label={
                <>
                  Remove external link from Unbranded property site
                </>
              }
            />
            <Field
              component={Switch}
              disabled
              name={nameof<RealEstateSiteTourSettingsValues>('removeRealEstateAddressFromUnbrandedTours')}
              label={
                <>
                  Remove property address from unbranded property sites
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('removePhotographerBrandingFromUnbrandedTour')}
              label={
                <>
                  Remove photographer branding from Unbranded property site
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('removePhotographerBrandingFromBrandedTour')}
              label={
                <>
                Remove photographer branding from Branded property sites
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('removeOpenHouseBannerFromUnbrandedTour')}
              label={
                <>
                  Remove Open House banner from Unbranded property site
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('removeSocialMediaSharingFromUnbrandedTour')}
              label={
                <>
                  Remove Social Media sharing from Unbranded property site
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('showOfficesListing')}
              label={
                <>
                  Show listing of all Broker offices
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('showSearchBarOnGalleryHeader')}
              label={
                <>
                  Show search bar on Gallery header
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('allowAdminAccessToCompanyListings')}
              label={
                <>
                  Allow Admin access to all company listings
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('allowAdminToPlaceOrdersOnBehalfAgent')}
              label={
                <>
                  Allow Admin to place (Company Pay) orders on behalf of agent
                </>
              }
            />
          </>
        )
      }
      {
        props.agentForm && (
          <>
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('showViewAdditionalPropertiesButtonOnTour')}
              label={
                <>
                  Show “View Additional Properties” button on Property Site
                  <SwitchDescription>
                    Takes user to agent Gallery page to display all agent listings.
                  </SwitchDescription>
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('newOrderEmailNotification')}
              label={
                <>
                  New Order email notification
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('propertySiteActivatedEmail')}
              label={
                <>
                  Property Site activated email
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('adminChargeEmailNotification')}
              label={
                <>
                  Admin charge email notification
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('photographerAssignedServiceEmail')}
              label={
                <>
                  Photographer assigned service ordered email
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('appointmentEmailConfirmation')}
              label={
                <>
                  Appointment scheduled email confirmation
                </>
              }
            />
            <Field
              component={Switch}
              name={nameof<RealEstateSiteTourSettingsValues>('showSearchOnGalleryPage')}
              label={
                <>
                  Show search bar on gallery page
                </>
              }
            />
          </>
        )
      }
    </Panel>
  )
}

export default SiteTourSettings
