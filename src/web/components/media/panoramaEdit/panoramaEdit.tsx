// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router-dom'
import * as Grid from '../../../common/grid'
import { NavHashLink } from '../../../common/hashLink'
import SecondaryNavigation from '../../../common/secondaryNavigation'
import styled from '../../../common/styled-components'
import PanoramaEditor, { PanoramaData } from './panoramaEditor'

const Heading = styled(Grid.Heading)`
`

interface RouteParams {
  panoramaId: string // route params must be string
}

type RouteProps = RouteComponentProps<RouteParams>
interface PanoramaEditProps extends RouteProps {
  panorama: PanoramaData
  onSubmit: (values: PanoramaData) => void
}

class PanoramaEdit extends React.PureComponent<PanoramaEditProps> {
  handleSubmit = (values: PanoramaData) => {
    this.props.onSubmit(values)
  }
  render () {
    const { panoramaId } = this.props.match.params
    return (
      <Grid.Wrapper>
        <Heading>
          <h1>Edit Panorama</h1>
        </Heading>
        <Grid.LeftDesktopAside>
          <SecondaryNavigation>
            <li><NavHashLink to='#starting'>Starting point</NavHashLink></li>
          </SecondaryNavigation>
        </Grid.LeftDesktopAside>
        <PanoramaEditor
          panorama={{
            ...this.props.panorama,
            id: Number(panoramaId)
          }}
          onSubmit={this.handleSubmit}
        />
      </Grid.Wrapper>
    )
  }
}

export default withRouter(PanoramaEdit)
