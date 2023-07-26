import * as Grid from '#veewme/web/common/grid'
import { NavHashLink } from '#veewme/web/common/hashLink'
import SecondaryNavigation from '#veewme/web/common/secondaryNavigation'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { useToasts } from 'react-toast-notifications'
import AddDomain from './addDomain'
import DomainsContainer from './domainsContainer'

const Wrapper = styled.div`
  width: 100%;
`

const Heading = styled(Grid.Heading)`
  [type='submit'] {
    display: none;
  }
`

const Domains: React.FunctionComponent = () => {
  const { removeAllToasts } = useToasts()
  React.useEffect(() => removeAllToasts, [])

  return (
    <Wrapper>
      <Grid.Wrapper >
        <Heading>
         <h1>Custom Domain Management</h1>
        </Heading>
        <Grid.LeftDesktopAside>
          <SecondaryNavigation>
            <li><NavHashLink to='#details'>Domain details</NavHashLink></li>
          </SecondaryNavigation>
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <AddDomain />
          <DomainsContainer />
        </Grid.MainColumn>
      </Grid.Wrapper>
    </Wrapper>
  )
}
export default Domains
