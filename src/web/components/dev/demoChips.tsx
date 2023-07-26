import Chips, { Chip } from '#veewme/web/common/chips'
import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { World } from 'styled-icons/boxicons-regular/World'
import { StyledIcon } from 'styled-icons/types/types'
import styled from '../../common/styled-components'

const Wrapper = styled.div`
  width: 340px;
  padding: 30px;
  & > ul {
    min-height: 48px;
    background-color: white;
    margin-bottom: 30px;
  }
`

const chipsList = [
  {
    id: 1,
    label: 'orange'
  },
  {
    id: 2,
    label: 'red'
  },
  {
    id: 3,
    label: 'blue'
  },
  {
    id: 4,
    label: 'orange'
  },
  {
    id: 5,
    label: 'green'
  }
]

const customChipsList = [
  {
    icon: World,
    id: 1,
    label: 'orange'
  },
  {
    icon: World,
    id: 2,
    label: 'red'
  },
  {
    icon: World,
    id: 3,
    label: 'blue'
  },
  {
    icon: World,
    id: 4,
    label: 'pink'
  },
  {
    icon: World,
    id: 5,
    label: 'green'
  }
]

const StyledIcon = styled(props => <props.icon className={props.className}/>) `
  width: 24px;
  height: 24px;
  fill: ${props => props.color ? props.color : props.theme.colors.LABEL_TEXT};
`

const StyledCustomChipLabel = styled.div `
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > :first-child {
    margin-right: 16px;
  }
`

interface CustomChip extends Chip {
  icon: StyledIcon
}

const getCustomChipLabel = (customChip: CustomChip) => (
  <StyledCustomChipLabel>
    <StyledIcon
      icon={customChip.icon}
      color={customChip.label}
    />
    <p>{customChip.label}</p>
  </StyledCustomChipLabel>
)

interface DemoChipsState {
  chips1: Chip[]
  chips2: Chip[]
}

class DemoChips extends React.PureComponent<{}, DemoChipsState> {
  state: DemoChipsState = {
    chips1: [...chipsList],
    chips2: [...chipsList]
  }

  handleChipDelete = (id: Chip['id']) => {
    log.debug('Delete chip', id)
    this.setState({
      chips2: this.state.chips2.filter(chip => chip.id !== id)
    })
  }

  render () {
    return (
      <Wrapper>
        <Chips
          chips={this.state.chips1}
        />
        <Chips
          chips={this.state.chips2}
          onChipDelete={this.handleChipDelete}
        />
        <Chips
          chips={customChipsList.map(cc => ({ id: cc.id, label: getCustomChipLabel(cc) }))}
        />
      </Wrapper>
    )
  }
}

export default DemoChips
