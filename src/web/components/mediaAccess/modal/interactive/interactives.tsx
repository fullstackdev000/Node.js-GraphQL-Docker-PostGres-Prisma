import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import TabContainer from '../tabContainer'
import Item, { InteractiveItemData } from './interactiveItem'

const InteractiveWrapper = styled.div`
  margin: -10px 15px 0 0;
`

interface InteractiveListProps {
  interactives: InteractiveItemData[]
}

const InteractiveList: React.FunctionComponent<InteractiveListProps> = props => (
  <Scrollbars
    autoHeight={true}
    autoHeightMax={`calc(85vh - 245px)`}
    autoHide={false}
    autoHeightMin='250px'
  >
    <InteractiveWrapper>
      {props.interactives.map(interactive => <Item key={interactive.id} interactive={interactive} />)}
    </InteractiveWrapper>
  </Scrollbars>
)

interface InteractiveContainerProps {
  interactives: InteractiveItemData[]
}

const InteractiveContainer: React.FunctionComponent<InteractiveContainerProps> = props => (
  <TabContainer>
    <InteractiveList interactives={props.interactives} />
  </TabContainer>
)

export default InteractiveContainer
