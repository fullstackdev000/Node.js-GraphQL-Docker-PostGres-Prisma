import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { DomainsListProps } from './'
import DomainItem from './domainItem'

export const Wrapper = styled.div`
`

export const Heading = styled.div`
  margin: 50px 0 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  font-size: 17px;
`

export const StyledDomainsList = styled.ul``

const DomainsList: React.FunctionComponent<DomainsListProps> = props => {
  return (
    <Wrapper>
      <Heading>Domains</Heading>
      <StyledDomainsList>
        {props.domains.map(domain =>
          <DomainItem
            key={domain.id}
            domain={domain}
            orders={props.orders}
            onDelete={props.onDelete}
            onOrderChange={props.onOrderChange}
          />
        )}
      </StyledDomainsList>
    </Wrapper>
  )
}

export default DomainsList
