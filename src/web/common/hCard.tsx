import * as GraphQLTypes from '#veewme/graphql/types'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

// Other h-card components can be added in this file if needed

const StyledSpan = styled.span`
  margin-left: 4px;

  &:first-child {
    margin-left: 0;
  }
`

const StyledAddress = styled.address`
  font-style: normal;
`

interface Address {
  street?: string
  city?: string
  zip?: string
  country?: GraphQLTypes.Country
  state?: string
}

interface HCardAddressProps {
  address: Address
  className?: string
}

export const HCardAddress: React.FunctionComponent<HCardAddressProps> = ({ address, className }) => (
  <StyledAddress className={`h-card ${className}`}>
    <StyledSpan className='p-street-address'>{address.street}</StyledSpan>,
    <StyledSpan className='p-locality'>{address.city}</StyledSpan>,
    <StyledSpan className='p-region'>{address.state}</StyledSpan>,
    <StyledSpan className='p-postal-code'>{address.zip}</StyledSpan>
  </StyledAddress>
)
