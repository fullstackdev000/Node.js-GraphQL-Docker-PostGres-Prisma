import Arrow from '#veewme/web/assets/svg/arrow.svg'
import Button, { ButtonSize } from '#veewme/web/common/buttons/basicButton'
import DropDownList, { DropDownListGroups } from '#veewme/web/common/dropDownList'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledDropDownButton = styled.div`
  position: relative;
`

interface DropDownButtonProps {
  className?: string
  label?: string
  size?: ButtonSize
  list: DropDownListGroups
  autoHeight?: boolean
}

interface DropDownButtonState {
  listOpen: boolean
}

export default class DropDownButton extends React.PureComponent<DropDownButtonProps, DropDownButtonState> {
  state: DropDownButtonState = {
    listOpen: false
  }

  toggleList = () => {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  mouseLeave = () => {
    this.setState(() => ({
      listOpen: false
    }))
  }

  render () {
    return (
      <StyledDropDownButton
        className={this.props.className}
        onMouseLeave={this.mouseLeave}
      >
        <Button
          buttonTheme='primary'
          label={this.props.label}
          type='button'
          size={this.props.size}
          icon={Arrow}
          iconLast={true}
          onClick={this.toggleList}
        />
        {this.state.listOpen &&
          <DropDownList
            onListClick={this.toggleList}
            list={this.props.list}
            autoHeight={this.props.autoHeight}
          />
        }
      </StyledDropDownButton>
    )
  }
}
