import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import InlineHelpButton from './buttons/inlineHelpButton'

const StyledInlineHelp = styled.div `
  position: relative;
  white-space: pre;
`

const StyledBubble = styled.div `
  position: absolute;
  z-index: 10;
  right: -10px;
  top: calc(100% + 5px);
  padding: 10px 15px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.BUBBLE_BACKGROUND};
  color: white;
  font-size: 12px;
  &:before {
    position: absolute;
    top: -5px;
    right: 5px;
    content:'';
    margin-right: 10px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${props => props.theme.colors.BUBBLE_BACKGROUND};
  }
`

interface InlineHelpProps {
  className?: string
  text: string
}

interface InlineHelpState {
  show: boolean
}

class InlineHelp extends React.PureComponent<InlineHelpProps,InlineHelpState> {
  state: InlineHelpState = {
    show: false
  }

  handleHelpButtonClick = () => {
    this.setState({
      show: !this.state.show
    })
  }

  handleMouseLeave = () => {
    this.setState({
      show: false
    })
  }

  render () {
    return (
      <StyledInlineHelp className={this.props.className} onMouseLeave={this.handleMouseLeave}>
        <InlineHelpButton onClick={this.handleHelpButtonClick}/>
        { this.state.show &&
          <StyledBubble>
            <p>{this.props.text}</p>
          </StyledBubble>
        }
      </StyledInlineHelp>
    )
  }
}

export default InlineHelp
