import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { StyledMainWrapper } from '../../common/styled'
import TabsBar from '../../common/tabsBar'
import PhotographerAdd from './photographerForm/addForm'
import PhotographerEdit from './photographerForm/editForm'
import PhotographersList from './photographersList/photographersContainer'
import ProcessorAdd from './processorForm/addForm'
import ProcessorEdit from './processorForm/editForm'
import ProcessorsList from './processorsList/processorsContainer'

class Photographers extends React.PureComponent<RouteComponentProps, {}> {
  render () {
    const tabs = [
      {
        label: 'Photographers',
        plusTo: privateUrls.addPhotographer,
        to: privateUrls.photographersList
      },
      {
        label: 'Processors',
        plusTo: privateUrls.addProcessor,
        to: privateUrls.processors
      }
    ]

    return (
      <StyledMainWrapper>
        <TabsBar tabs={tabs}/>
        <Switch>
          <Route exact path={privateUrls.photographers} render={() => <Redirect to={privateUrls.photographersList} />} />
          <Route exact path={privateUrls.photographersList} component={PhotographersList} />
          <Route exact path={privateUrls.addPhotographer} component={PhotographerAdd} />
          <Route exact path={privateUrls.processors} component={ProcessorsList} />
          <Route exact path={privateUrls.addProcessor} component={ProcessorAdd} />
          <Route path={privateUrls.editPhotographer} component={PhotographerEdit} />
         <Route path={privateUrls.editProcessor} component={ProcessorEdit} />
        </Switch>
      </StyledMainWrapper>
    )
  }
}

export default Photographers
