import * as React from 'react'

interface WithImageState {
  showImage: boolean
  windowHeight: number
}

export interface WrappedComponentProps {
  showImage: boolean
}

export interface WrappedComponentPropsWithRef extends WrappedComponentProps {
  ref: React.Ref<HTMLDivElement>
}

const withImage = (WrappedComponent: React.ComponentType<WrappedComponentPropsWithRef>) => {
  return class WithImage extends React.PureComponent<{}, WithImageState> {

    imageRef: React.RefObject<HTMLDivElement> = React.createRef()

    state = {
      showImage: false,
      windowHeight: window.innerHeight
    }

    removeShowImageOnEvent = () => {
      window.removeEventListener('scroll', this.showImageOnScroll)
      window.removeEventListener('resize', this.showImageOnResize)
    }

    showImageOnScroll = () => {
      const DOMelement = this.imageRef.current
      const offsetFromTopOfWindow = Math.round(this.state.windowHeight / 2)
      const position = DOMelement ? DOMelement.getBoundingClientRect().top - offsetFromTopOfWindow : null
      const showImage = position !== null && position <= 0
      if (showImage && !this.state.showImage) {
        this.setState({ showImage }, this.removeShowImageOnEvent)
      }
    }

    showImageOnResize = () => {
      if (this.state.windowHeight !== window.innerHeight) {
        this.setState({ windowHeight: window.innerHeight }, this.showImageOnScroll)
      }
    }

    componentDidMount () {
      this.showImageOnScroll()
      window.addEventListener('scroll', this.showImageOnScroll)
      window.addEventListener('resize', this.showImageOnResize)
    }

    componentWillUnmount () {
      this.removeShowImageOnEvent()
    }

    render () {
      return (
        <WrappedComponent ref={this.imageRef} showImage={this.state.showImage} />
      )
    }
  }
}

export default withImage
