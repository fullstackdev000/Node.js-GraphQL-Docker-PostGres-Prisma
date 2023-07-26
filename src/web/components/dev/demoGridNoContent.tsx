import * as React from 'react'
import { BreadcrumbNavigation } from '../../common/breadcrumbs/breadcrumbNavigation'
import * as Grid from '../../common/grid'

class DemoGridNoContent extends React.Component<{}> {
  render () {
    const steps = [
      { label: 'a' },
      { label: 'b' },
      { label: 'c' }
    ]
    return (
      <BreadcrumbNavigation.Provider steps={steps}>
        <Grid.Wrapper>
          <Grid.Heading>
            <h1>
              Demo form
              <span>with always visible left sidebar and the column with content that spans all the available columns</span>
            </h1>
          </Grid.Heading>
          <Grid.LeftAside>
            <BreadcrumbNavigation.Breadcrumbs />
          </Grid.LeftAside>
          <Grid.MainColumn centerColumn>No Content</Grid.MainColumn>
          <Grid.Footer />
        </Grid.Wrapper>
      </BreadcrumbNavigation.Provider>
    )
  }
}

export default DemoGridNoContent
