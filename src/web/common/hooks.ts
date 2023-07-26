import * as mediaBreakpoints from '#veewme/web/common/mediaBreakpoints'
import { getPixels, guidGenerator } from '#veewme/web/common/util'
import * as React from 'react'

import { MeQuery } from '#veewme/graphql/types'
import { Me } from '#veewme/lib/graphql/queries'
import { useQuery } from '@apollo/react-hooks'

const breakpoint = getPixels(mediaBreakpoints.BREAKPOINT_XL)

export const useIsDesktopView = () => {
  const [desktopView, setDesktopView] = React.useState(window.innerWidth >= breakpoint)
  const eventListener = () => setDesktopView(window.innerWidth >= breakpoint)

  React.useEffect(() => {
    window.addEventListener('resize', eventListener)
    return () => {
      window.removeEventListener('resize', eventListener)
    }
  }, [])

  return [desktopView]
}

export const useComponentDynamicKey = () => {
  const [id, setId] = React.useState(guidGenerator())

  const setNewId = () => setId(guidGenerator())

  // TODO: use 'as const' when Typescript version updated
  const returnTuple: [string, () => void] = [
    id,
    setNewId
  ]

  return returnTuple
}

// 'Me' query is used very often so this custom hooks simplifies using it (less imports etc.)
// TODO: add more options if needed
export const useMe = () => {
  const { data, loading } = useQuery<MeQuery>(Me)

  return {
    data,
    loading
  }
}

export const useRole = () => {
  const { data } = useQuery<MeQuery>(Me, {
    fetchPolicy: 'cache-only'
  })
  return data && data.me.role
}
