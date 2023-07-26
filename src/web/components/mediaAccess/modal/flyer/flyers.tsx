import styled from '#veewme/web/common/styled-components'
import FlyerList from '#veewme/web/components/media/flyer/flyerList'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import TabContainer from '../tabContainer'
import FlyerItem from './flyerItem'

const Wrapper = styled.div`
  padding: 0 15px 0 0;
`

interface FlyersListProps {}

const FlyersList: React.FunctionComponent<FlyersListProps> = () => {
  return (
    <Scrollbars
      autoHeight={true}
      autoHeightMax={`calc(85vh - 245px)`}
      autoHide={false}
      autoHeightMin='250px'
    >
      <Wrapper>
        <FlyerList
          wrap
        >
          {
            (layoutName, _isActive, i) => (
              <FlyerItem
                key={layoutName}
                layoutName={layoutName}
                title={`Layout ${i + 1}`}
              />
            )
          }
        </FlyerList>
      </Wrapper>
    </Scrollbars>
  )
}

interface FlyerContainerProps {
  orderId?: string
}

const FlyerContainer: React.FunctionComponent<FlyerContainerProps> = () => (
  <TabContainer>
    <FlyersList />
  </TabContainer>
)

export default FlyerContainer
