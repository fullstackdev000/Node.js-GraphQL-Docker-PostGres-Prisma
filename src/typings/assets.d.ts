declare module '*.svg' {
  import * as React from 'react'
  const content: React.SVGFactory
  export default content
}

declare module '*.png' {
  const content: any
  export default content
}
