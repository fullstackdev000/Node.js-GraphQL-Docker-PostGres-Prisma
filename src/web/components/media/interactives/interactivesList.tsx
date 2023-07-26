import * as React from 'react'
import { OrderInteractiveBase } from '../types'
import InteractiveItem from './interactiveItem'

interface InteractivesListProps {
  interactives: OrderInteractiveBase[]
  onDelete: (id: OrderInteractiveBase['id']) => void
}

class InteractivesList extends React.PureComponent<InteractivesListProps> {
  render () {
    return (
      <div>
        {this.props.interactives.map(interactive => <InteractiveItem key={interactive.id} interactive={interactive} onDelete={this.props.onDelete}/>)}
      </div>
    )
  }
}

export default InteractivesList
