import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { AccordionButton } from './buttons'

const PanelAccordionButton = styled(AccordionButton)`
  position: absolute;
  right: -22.5px;
  top: 8px;
  z-index: 10;
`

const PanelWrapper = styled.div`
  min-height: 65px;
  background-color: white;
  border: 1px solid #e2e8ef;
  border-radius: 5px;
  position: relative;
`

export const Heading = styled.header`
  color: ${props => props.theme.colors.LABEL_TEXT};
  padding: 22px 30px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  h2 {
    text-align: left;
    font-size: 16px;
    font-weight: 400;
  }
`

const Content = styled.div<{hasHeading: boolean, open: boolean}>`
  box-sizing: border-box;
  padding: 0 30px;
  overflow: ${({ open }: {open: boolean}) => open ? 'initial' : 'hidden'};
  height: ${({ open }: {open: boolean}) => open ? 'auto' : '0'};
  padding-bottom: ${({ open }: {open: boolean}) => open ? '30px' : '0'};
  padding-top: ${({ hasHeading }: {hasHeading: boolean}) => hasHeading ? '0' : '30px'};
  position: relative;
`

interface PanelProps {
  children: React.ReactNode
  className?: string
  collapsed?: boolean
  heading?: string
  headingPlacedComponent?: JSX.Element
  id?: string
  toggleable?: boolean
  onExpand?: () => void
  onCollapse?: () => void
}

interface PanelState {
  open: boolean
}

class Panel extends React.PureComponent<PanelProps, PanelState> {
  state = { open: !this.props.collapsed }

  togglePanel (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        if (this.props.onExpand) {
          this.props.onExpand()
        }
      } else {
        if (this.props.onCollapse) {
          this.props.onCollapse()
        }
      }
    })
  }

  render () {
    return (
      <PanelWrapper id={this.props.id} className={this.props.className}>
        {this.props.toggleable && <PanelAccordionButton
          open={this.state.open}
          togglePanel={(e: React.MouseEvent<HTMLButtonElement>) => this.togglePanel(e)}
        />}
        {this.props.heading && <Heading>
          <h2>{this.props.heading}</h2>
          {this.props.headingPlacedComponent}
        </Heading>}
        {this.props.children && <Content hasHeading={!!this.props.heading} open={this.state.open}>
            {this.props.children}
          </Content>}
      </PanelWrapper>
    )
  }
}

export default Panel
