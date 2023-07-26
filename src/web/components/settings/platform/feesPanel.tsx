import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from './form'

const StyledSection = styled.section `
  font-size: 12px;
  & + section {
    padding-top:20px;
    margin-top: 30px;
    border-top: 1px solid ${props => props.theme.colors.BORDER};
  }
`

const StyledSectionHeading = styled.h4 `
  font-weight: 700;
`

const StyledSectionContent = styled.div`
  width:100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  input { width: 100%; }
`

interface FieldData {
  label: string
  name: string
}

interface FeesSectionProps {
  heading: string
  fields: FieldData[]
}

const FeesSection: React.FunctionComponent<FeesSectionProps> = props => (
  <StyledSection>
    <StyledSectionHeading>
      {props.heading}
    </StyledSectionHeading>
    <StyledSectionContent>
      {props.fields.map(field => (
        <Field
          key={field.name}
          name={field.name}
          component={InputField}
          label={field.label}
          type='number'
        />
      ))}
    </StyledSectionContent>
  </StyledSection>
)

const affiliateBasicFieldsData: FieldData[] = [
  {
    label: 'Free Activation(s) # (New Affiliate):',
    name: nameof<FormValues>('affiliateBasicFreeActivation')
  },
  {
    label: 'Tour Activation ($):',
    name: nameof<FormValues>('affiliateBasicTourActivation')
  },
  {
    label: 'Media Activation ($):',
    name: nameof<FormValues>('affiliateBasicMediaActivation')
  },
  {
    label: 'Hosted Video ($):',
    name: nameof<FormValues>('affiliateBasicHostedVideo')
  },
  {
    label: 'Faux Video (Branded or Unbranded) ($):',
    name: nameof<FormValues>('affiliateBasicFauxVideoBorU')
  },
  {
    label: 'Faux Video (Branded and Unbranded) ($):',
    name: nameof<FormValues>('affiliateBasicFauxVideoBandU')
  }
]

const affiliateProFieldsData: FieldData[] = [
  {
    label: 'Free Activation(s) # (New Affiliate):',
    name: nameof<FormValues>('affiliateProFreeActivation')
  },
  {
    label: 'Tour Activation ($):',
    name: nameof<FormValues>('affiliateProTourActivation')
  },
  {
    label: 'Media Activation ($):',
    name: nameof<FormValues>('affiliateProMediaActivation')
  },
  {
    label: 'Hosted Video ($):',
    name: nameof<FormValues>('affiliateProHostedVideo')
  },
  {
    label: 'Faux Video (Branded or Unbranded) ($):',
    name: nameof<FormValues>('affiliateProFauxVideoBorU')
  },
  {
    label: 'Faux Video (Branded and Unbranded) ($):',
    name: nameof<FormValues>('affiliateProFauxVideoBandU')
  }
]

const selfServiceAgentFieldsData: FieldData[] = [
  {
    label: 'Free Activation(s):',
    name: nameof<FormValues>('selfServiceAgentFreeActivation')
  },
  {
    label: 'Tour Activation ($):',
    name: nameof<FormValues>('selfServiceAgentTourActivation')
  },
  {
    label: 'Hosted Video ($):',
    name: nameof<FormValues>('selfServiceAgentHostedVideo')
  },
  {
    label: 'Faux Video (Branded and Unbranded) ($):',
    name: nameof<FormValues>('selfServiceAgentFauxVideoBandU')
  },
  {
    label: 'Faux Video (Branded or Unbranded) ($):',
    name: nameof<FormValues>('selfServiceAgentFauxVideoBorU')
  }
]

const selfServiceBrokerFieldsData: FieldData[] = [
  {
    label: 'Free Activation(s):',
    name: nameof<FormValues>('selfServiceBrokerFreeActivation')
  },
  {
    label: 'Tour Activation ($):',
    name: nameof<FormValues>('selfServiceBrokerTourActivation')
  },
  {
    label: 'Media Activation ($):',
    name: nameof<FormValues>('selfServiceBrokerMediaActivation')
  },
  {
    label: 'Hosted Video ($):',
    name: nameof<FormValues>('selfServiceBrokerHostedVideo')
  },
  {
    label: 'Faux Video (Branded and Unbranded) ($):',
    name: nameof<FormValues>('selfServiceBrokerFauxVideoBandU')
  },
  {
    label: 'Faux Video (Branded or Unbranded) ($):',
    name: nameof<FormValues>('selfServiceBrokerFauxVideoBorU')
  }
]

interface FeesProps {
  values: FormValues
}

const Fees: React.FunctionComponent<FeesProps> = props => (
  <Panel heading='Fees' id='fees' toggleable>
    <FeesSection
      heading='Affiliate Basic'
      fields={affiliateBasicFieldsData}
    />
    <FeesSection
      heading='Affiliate Pro'
      fields={affiliateProFieldsData}
    />
    <FeesSection
      heading='Self Service Agent'
      fields={selfServiceAgentFieldsData}
    />
    <FeesSection
      heading='Self Service Broker'
      fields={selfServiceBrokerFieldsData}
    />
  </Panel>
)

export default Fees
