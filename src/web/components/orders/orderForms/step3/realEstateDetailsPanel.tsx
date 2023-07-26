import { Countries, States } from '#veewme/lib/constants'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { CreateOrderFormValues } from '../types'
import { ConvertedAgent } from '../types'
import { PropertyDetailsSection, SectionHeading, StyledDetail, StyledDetailContent, StyledDetailLabel, StyledInlineWrapper, StyledPanel, StyledPanelContentWrapper } from './styled'

const StyledAgentSection = styled(StyledDetail)`
  margin-bottom: 25px;
`

const displayNamesDictionary: {
  [name: string]: string
} = {
  SquareFeet: 'Sq. Ft.',
  SquareMeters: 'Sq. Meters'
}
interface CustomProps {
  agents: ConvertedAgent[]
  values: CreateOrderFormValues
}

type RealEstateDetailsPanelProps = CustomProps

const RealEstateDetailsPanel: React.FunctionComponent<RealEstateDetailsPanelProps> = props => {
  const { realEstate: {
    agentPrimaryId,
    agentCoListingId,
    bedrooms,
    city,
    country: countryValue,
    fullBathrooms,
    halfBathrooms,
    lotSizeUnit = '',
    lotSize,
    state: stateValue,
    street,
    zip
  } } = props.values
  const agent = props.agents.find(a => a.id === agentPrimaryId)
  const coListingAgent = props.agents.find(a => a.id === agentCoListingId)
  const country = Countries.find(c => c.value === countryValue)
  const state = States.find(s => s.value === stateValue)

  const lotSizeUnitDisplayName = displayNamesDictionary[lotSizeUnit] || lotSizeUnit

  return (
    <>
    <StyledPanel>
      <StyledAgentSection>
        <SectionHeading>Listing Agent:</SectionHeading>
        {agent &&
          <StyledDetailLabel>{agent.firstName} {agent.lastName}</StyledDetailLabel>
        }
        {/* TODO decide what should be displayed here*/}
        {agent &&
          <StyledDetailContent>Lorem ipsum dolores amus</StyledDetailContent>
        }
      </StyledAgentSection>
      <StyledDetail>
        <SectionHeading>Co-Listing Agent:</SectionHeading>
        {coListingAgent &&
          <StyledDetailLabel>{coListingAgent.firstName} {coListingAgent.lastName}</StyledDetailLabel>
        }
        {/* TODO decide what should be displayed here*/}
        {coListingAgent &&
          <StyledDetailContent>Lorem ipsum dolores amus</StyledDetailContent>
        }
      </StyledDetail>
    </StyledPanel>
    <StyledPanel heading='Property'>
      <StyledPanelContentWrapper>
        <StyledInlineWrapper>
            <StyledDetailContent>{street}</StyledDetailContent>
            <StyledDetailContent>{city}</StyledDetailContent>
             <StyledDetailContent>{state && state.value} {zip}</StyledDetailContent>
            <StyledDetailContent>{country && country.value}</StyledDetailContent>
            <PropertyDetailsSection>
              {
                lotSizeUnit && <StyledDetail inline>
                  <StyledDetailLabel>{lotSizeUnitDisplayName}:</StyledDetailLabel>
                  <StyledDetailContent>{lotSize}</StyledDetailContent>
                </StyledDetail>
              }
              <StyledDetail inline>
                <StyledDetailLabel>Beds:</StyledDetailLabel>
                <StyledDetailContent>{bedrooms}</StyledDetailContent>
              </StyledDetail>
              <StyledDetail inline>
                <StyledDetailLabel>Bathrooms:</StyledDetailLabel>
                <StyledDetailContent>{fullBathrooms} / {halfBathrooms}</StyledDetailContent>
              </StyledDetail>
            </PropertyDetailsSection>
        </StyledInlineWrapper>
      </StyledPanelContentWrapper>
    </StyledPanel>
    </>
  )
}

export default RealEstateDetailsPanel
