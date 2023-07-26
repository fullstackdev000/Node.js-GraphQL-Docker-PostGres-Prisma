import { FlyerLayoutName } from '#veewme/gen/graphqlTypes'
import * as React from 'react'
import Button from '../../../common/buttons/basicButton'
import flyerLayoutIcons from '../../../common/flyerIcons'
import Panel from '../../../common/panel'
import styled from '../../../common/styled-components'
import FlyerLayoutIcon from './flyerLayoutIcon'
import FlyerLayoutModal from './flyerModal'

const StyledContent = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledName = styled.div `
  margin: 10px 0;
  h4 {
    font-weight: 500;
    font-size: 20px;
  }
`

const StyledPhotosText = styled.div `
  p {
    font-weight: 500;
    font-size: 13px;
  }
`

const StyledSpan = styled.span `
  color: ${props => props.theme.colors.GREEN};
`

const StyledButtonsWrapper = styled.div `
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  margin-top: 20px;

  button,
  a {
    margin: 5px 0;
    height: auto;
    min-height: 30px;
    text-align: center;
  }
`

interface SelectedFlyerPanelProps {
  availablePhotosToSelectCount: number
  onLayoutSelect: (value: FlyerLayoutName) => void
  currentLayoutName: FlyerLayoutName
  flyerUrl?: string
}

const SelectedFlyerPanel: React.FunctionComponent<SelectedFlyerPanelProps> = props => {
  const [ modalVisible, setModalVisibility ] = React.useState(false)
  const toggleModal = React.useCallback(() => setModalVisibility(prev => !prev), [])
  const flyerLayoutLabel = Object.keys(flyerLayoutIcons).indexOf(props.currentLayoutName) + 1

  return (
    <Panel heading='Selected Flyer'>
      <StyledContent>
        <FlyerLayoutIcon layoutName={props.currentLayoutName} isActive />
        <StyledName>
          <h4>{flyerLayoutLabel}</h4>
        </StyledName>
        <StyledPhotosText>
          <p>Available photos to select: <StyledSpan>{props.availablePhotosToSelectCount}</StyledSpan></p>
        </StyledPhotosText>
        <StyledButtonsWrapper>
          <Button label='Preview Flyer' href={props.flyerUrl || ''} target='_blank' disabled={!props.flyerUrl}/>
          <Button label='Flyer Layout' onClick={toggleModal}/>
        </StyledButtonsWrapper>
      </StyledContent>
      {
        // remount component to reset its internal state when it's open
        // https://github.com/reactjs/react-modal/issues/434
        modalVisible && <FlyerLayoutModal
          toggleModal={toggleModal}
          currentLayoutName={props.currentLayoutName}
          modalVisible={modalVisible}
          onLayoutSave={props.onLayoutSelect}
        />
      }
    </Panel>
  )
}

export default React.memo(SelectedFlyerPanel)
