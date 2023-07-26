import { ServiceCategory } from '#veewme/gen/graphqlTypes'
import { Chip } from '#veewme/web/common/chips'
import * as Grid from '#veewme/web/common/grid'
import { NavHashLink } from '#veewme/web/common/hashLink'
import * as log from '#veewme/web/common/log'
import SecondaryNavigation from '#veewme/web/common/secondaryNavigation'
import styled from '#veewme/web/common/styled-components'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Fees from './feesPanel'
import RealEstateTypes from './realEstateTypesPanel'
import ServiceCategoryPanel from './serviceCategoryPanel'
import SupportPages from './supportPagesPanel'
import TourId from './tourIdPanel'

export const StyledFormWrapper = styled.div`
  input {
    max-width: 100%;

    &[type='number'] {
      -moz-appearance:textfield;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
  }
`

export const StyledGridWrapper = styled(Grid.Wrapper) `
  padding: 0 0 60px;
  &:before {
    width: 100%;
    left: 0;
  }
`

export interface FormValues {
  affiliateBasicFauxVideoBandU: number
  affiliateBasicFauxVideoBorU: number
  affiliateBasicFreeActivation: number
  affiliateBasicHostedVideo: number
  affiliateBasicMediaActivation: number
  affiliateBasicTourActivation: number
  affiliateProFauxVideoBandU: number
  affiliateProFauxVideoBorU: number
  affiliateProFreeActivation: number
  affiliateProHostedVideo: number
  affiliateProMediaActivation: number
  affiliateProTourActivation: number
  bottomSamples: Chip[] // TODO check type
  bottomSampleToAdd: string
  otherRealEstateTypes: Chip[] // TODO check type
  otherRealEstateTypeToAdd: string
  primaryRealEstateTypes: Chip[] // TODO check type
  primaryRealEstateTypeToAdd: string
  selfServiceAgentFauxVideoBandU: number
  selfServiceAgentFauxVideoBorU: number
  selfServiceAgentFreeActivation: number
  selfServiceAgentHostedVideo: number
  selfServiceAgentTourActivation: number
  selfServiceBrokerFauxVideoBandU: number
  selfServiceBrokerFauxVideoBorU: number
  selfServiceBrokerFreeActivation: number
  selfServiceBrokerHostedVideo: number
  selfServiceBrokerMediaActivation: number
  selfServiceBrokerTourActivation: number
  serviceCategories: ServiceCategory[]
  serviceCategoryToAdd: ServiceCategory
  supportPagesSystem: string
  supportPagesSelfServiceClient: string
  supportPagesDefaultAffiliate: string
  tourIdTopSample: string
}

type PlatformFormProps = FormikProps<FormValues>

class PlatformForm extends React.Component<PlatformFormProps, {}> {
  handleSupportPageEdit = (id: string) => {
    log.debug('Edit', id)
  }

  render () {
    return (
      <StyledFormWrapper as={Form}>
        <StyledGridWrapper noHeader>
          <Grid.LeftDesktopAside>
            <SecondaryNavigation>
              <li><NavHashLink to='#fees'>Fees</NavHashLink></li>
              <li><NavHashLink to='#support'>Support Pages</NavHashLink></li>
            </SecondaryNavigation>
          </Grid.LeftDesktopAside>
          <Grid.MainColumn>
            <Fees values={this.props.values}/>
            <SupportPages values={this.props.values}/>
          </Grid.MainColumn>
          <Grid.RightAside>
            <TourId values={this.props.values}/>
            <ServiceCategoryPanel values={this.props.values}/>
            <RealEstateTypes values={this.props.values}/>
          </Grid.RightAside>
          <Grid.Footer />
        </StyledGridWrapper>
      </StyledFormWrapper>
    )
  }
}

export default withFormik<{}, FormValues>({
  handleSubmit:  (values, { setSubmitting }) => {
    log.debug('submitting: ', values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    affiliateBasicFauxVideoBandU: 0,
    affiliateBasicFauxVideoBorU: 0,
    affiliateBasicFreeActivation: 0,
    affiliateBasicHostedVideo: 0,
    affiliateBasicMediaActivation: 0,
    affiliateBasicTourActivation: 0,
    affiliateProFauxVideoBandU: 0,
    affiliateProFauxVideoBorU: 0,
    affiliateProFreeActivation: 0,
    affiliateProHostedVideo: 0,
    affiliateProMediaActivation: 0,
    affiliateProTourActivation: 0,
    bottomSamples: [],
    bottomSampleToAdd: '',
    otherRealEstateTypes: [],
    otherRealEstateTypeToAdd: '',
    primaryRealEstateTypes: [],
    primaryRealEstateTypeToAdd: '',
    selfServiceAgentFauxVideoBandU: 0,
    selfServiceAgentFauxVideoBorU: 0,
    selfServiceAgentFreeActivation: 0,
    selfServiceAgentHostedVideo: 0,
    selfServiceAgentTourActivation: 0,
    selfServiceBrokerFauxVideoBandU: 0,
    selfServiceBrokerFauxVideoBorU: 0,
    selfServiceBrokerFreeActivation: 0,
    selfServiceBrokerHostedVideo: 0,
    selfServiceBrokerMediaActivation: 0,
    selfServiceBrokerTourActivation: 0,
    serviceCategories: [],
    serviceCategoryToAdd: {
      color: {
        a: 1,
        b: 255,
        g: 166,
        id: 0, // TODO make optional for initial data
        r: 61
      },
      icon: 'Aerial',
      id: 0, // TODO make optional for initial data
      label: ''
    },
    supportPagesDefaultAffiliate: '',
    supportPagesSelfServiceClient: '',
    supportPagesSystem: '',
    tourIdTopSample: ''
  })
})(PlatformForm)
