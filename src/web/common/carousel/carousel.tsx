import * as React from 'react'
import ArrowSvg from '../../assets/svg/arrow.svg'
import { BREAKPOINT_LG } from '../mediaBreakpoints'
import styled from '../styled-components'
import CarouselIndicator from './carouselIndicator'

const StyledButton = styled.button `
  outline: none;
  background-color: transparent;
  border: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
  width: 36px;
  height: 36px;
  cursor: pointer;
  transform: rotate(90deg);
`

interface CarouselArrowButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const StyledArrowSvg = styled(ArrowSvg) `
  width: 16px;
  height: 10px;
  fill: ${props => props.theme.colors.BUTTON_ICON_HOVER};
`

const CarouselArrowButton: React.FunctionComponent<CarouselArrowButtonProps> = props => (
  <StyledButton onClick={props.onClick}>
    <StyledArrowSvg/>
  </StyledButton>
)

const StyledBand = styled.div<{ mirrored?: boolean }> `
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 36px;
  transform: ${props => props.mirrored && 'rotate(180deg)'};
`

const StyledFrame = styled.div `
  flex: 1;
  position: relative;
  margin: 0 6px;
  overflow-x: hidden;
`

export const StyledCarouselContent = styled.div<{ translateX: string }> `
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  transition: transform 400ms ease-in-out;
  transform: translate(${props => props.translateX}, 0px);
`

interface CarouselContentProps {
  className?: string
  leftChildIndex: number
}

const CarouselContent: React.FunctionComponent<CarouselContentProps> = props => (
  <StyledFrame>
    {props.children &&
      <StyledCarouselContent
        translateX={-props.leftChildIndex * 100 / React.Children.toArray(props.children).length + '%'}
        className={props.className}
      >
        {props.children}
      </StyledCarouselContent>
    }
  </StyledFrame>
)

const StyledCarousel = styled.div `
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const StyledWrapper = styled.div `
  flex: 1;
  display: flex;
  align-items: stretch;
`

interface Step1CarouselProps {
  className?: string
  showIndicator?: boolean
  activeIndicators?: number[]
  leftChildIndex: number
  children: React.ReactNode
}

interface Step1CarouselState {
  leftChildIndex: number
  visibleChildren: number
  childrenTotal: number
}

export default class Step1Carousel extends React.PureComponent<Step1CarouselProps, Step1CarouselState> {
  static defaultProps = {
    leftChildIndex: 0
  }

  state: Step1CarouselState = {
    childrenTotal: React.Children.toArray(this.props.children).length,
    leftChildIndex: this.props.leftChildIndex,
    visibleChildren: 3
  }

  updateVisibleChildren = () => {
    const visibleChildren = window.matchMedia(`screen and (max-width: ${ BREAKPOINT_LG })`).matches ? 2 : 3
    if (this.state.visibleChildren !== visibleChildren) {
      this.setState({
        visibleChildren
      })
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.updateVisibleChildren)
    this.updateVisibleChildren()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateVisibleChildren)
  }

  componentDidUpdate () {
    this.updateVisibleChildren()
    if (this.state.childrenTotal !== React.Children.toArray(this.props.children).length) {
      this.setState({
        childrenTotal: React.Children.toArray(this.props.children).length
      })
    }
  }

  handleLeftClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (this.state.leftChildIndex > 0) {
      this.setState(prevState => ({
        leftChildIndex: prevState.leftChildIndex - 1
      }))
    }
  }

  handleRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (this.state.leftChildIndex + this.state.visibleChildren < this.state.childrenTotal) {
      this.setState(prevState => ({
        leftChildIndex: prevState.leftChildIndex + 1
      }))
    }
  }

  render () {
    const showLeftButton = this.state.leftChildIndex > 0
    const showRightButton = this.state.leftChildIndex < this.state.childrenTotal - this.state.visibleChildren
    return (
      <StyledCarousel className={this.props.className}>
        <StyledWrapper>
          <StyledBand>
            {showLeftButton &&
              <CarouselArrowButton onClick={this.handleLeftClick}/>
            }
          </StyledBand>
          <CarouselContent
            leftChildIndex={this.state.leftChildIndex}
          >
            {this.props.children}
          </CarouselContent>
          <StyledBand mirrored>
            {showRightButton &&
              <CarouselArrowButton onClick={this.handleRightClick}/>
            }
          </StyledBand>
        </StyledWrapper>
        {this.props.showIndicator &&
          <CarouselIndicator
            activeItems={this.props.activeIndicators}
            itemsTotal={this.state.childrenTotal}
          />
        }
      </StyledCarousel>
    )
  }
}
