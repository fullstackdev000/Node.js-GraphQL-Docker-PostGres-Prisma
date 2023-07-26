import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { StyledIcon } from 'styled-icons/types/types'
import { InnerPanelHeader } from './innerPanelHeader'

const StyledPanelWrapper = styled.div `
`

const StyledPanelContent = styled.div `
  margin-top: 32px;
  display: flex;
  overflow: hidden;
`

export interface InnerPanelProps {
  collapsed?: boolean
  toggleable?: boolean
  className?: string
  label?: string
  icon?: StyledIcon | React.SVGFactory
  itemsTotal?: number
  noHeader?: boolean
  onToggle?: (collapsed: boolean) => void
}

interface InnerPanelState {
  open: boolean
}

class InnerPanel extends React.PureComponent<InnerPanelProps, InnerPanelState> {
  state: InnerPanelState = {
    open: this.props.noHeader || !this.props.collapsed
  }

  togglePanel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    this.props.onToggle && this.props.onToggle(this.state.open)
    this.setState({ open: !this.state.open })
  }

  render () {
    return (
      <StyledPanelWrapper className={this.props.className}>
        {!this.props.noHeader &&
          <InnerPanelHeader
            label={this.props.label}
            icon={this.props.icon}
            itemsTotal={this.props.itemsTotal}
            onClick={this.props.toggleable ? this.togglePanel : undefined}
            open={this.state.open}
            toggleable={this.props.toggleable}
          />
        }
        {this.state.open &&
          <StyledPanelContent>
            {this.props.children}
          </StyledPanelContent>
        }
      </StyledPanelWrapper>
    )
  }
}

export default InnerPanel
