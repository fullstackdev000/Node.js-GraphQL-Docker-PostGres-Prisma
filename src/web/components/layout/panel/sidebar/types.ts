import * as React from 'react'

export interface SidebarItemProps {
  label: string,
  icon?: React.ReactNode,
  to: string,
  toPlus?: string
}
