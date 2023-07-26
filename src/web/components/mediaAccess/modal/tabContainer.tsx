import * as React from 'react'

interface TabContainerProps {
  children: JSX.Element
}

const TabContainer: React.FunctionComponent<TabContainerProps> = ({ children }) => {
  // TODO: temp fix for https://github.com/malte-wessel/react-custom-scrollbars/issues/240
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 350)
  return (
    <div>
      {children}
    </div>
  )
}
export default TabContainer
