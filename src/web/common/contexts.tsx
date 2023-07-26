import * as React from 'react'

export interface ExpandableFiltersContext {
  toggle: () => void
  visible: boolean
}

export const ExpandableFiltersContext = React.createContext<ExpandableFiltersContext>({
  toggle: () => undefined,
  visible: false
})
