import * as React from 'react'
import { NavHashLink as NavLink, NavHashLinkProps } from 'react-router-hash-link'

export const NavHashLink: React.FunctionComponent<NavHashLinkProps> = props => (
  <NavLink
    {...props}
    isActive={(_match, location) => {
      if (typeof props.to === 'string') {
        return location.hash === props.to
      } else if (typeof props.to !== 'function') {
        return location.hash === `#${props.to.hash}`
      } else {
        return false
      }
    }}
    scroll={el => window.scrollTo({ top: el.offsetTop, left: 0, behavior: 'smooth' })}
  />
)
