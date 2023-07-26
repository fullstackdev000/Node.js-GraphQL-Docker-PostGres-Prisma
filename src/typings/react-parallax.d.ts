declare module 'react-parallax' {
  import * as React from 'react'
  import { Parallax } from 'react-parallax'

  export interface ParallaxProps<T> {
    bgClassName?: string
    blur?: number | {max: number, min: number}
    bgImage?: string
    bgImageAlt?: string
    bgImageSizes?: {height?: string, width?: string}
    bgImageSrcSet?: string
    bgImageStyle?: CSSProperties
    bgStyle?: CSSProperties
    className?: string
    contentClassName?: string
    disabled?: boolean
    log?: boolean
    parent?: Node
    renderLayer?: (currentPositionPercentage: number) => React.ComponentType<T>
    strength: number
    style?: CSSProperties
  }

  export class Parallax extends React.Component<ParallaxProps<T>> {}
}
