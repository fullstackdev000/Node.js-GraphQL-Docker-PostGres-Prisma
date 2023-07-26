/*
  This module attaches theme interface to 'styled-components' methods and re-exports them.
  Thanks for this we can use fully typed theme in styled components.
  To take advantage of this 'styled' have to be imported from this module.

  More details: https://www.styled-components.com/docs/api#typescript
*/

/* tslint:disable:import-blacklist no-submodule-imports no-duplicate-imports */
import * as styledComponents from 'styled-components'
import { AnyStyledComponent, FlattenSimpleInterpolation, ThemedStyledComponentsModule } from 'styled-components'
/* tslint:enable:import-blacklist no-submodule-imports no-duplicate-imports */
import { themeColors } from './colors'
import * as mediaBreakpoints from './mediaBreakpoints'

export interface ThemeInterface {
  colors: typeof themeColors
  breakpoints: typeof mediaBreakpoints
}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<ThemeInterface>

export { AnyStyledComponent, css, createGlobalStyle, FlattenSimpleInterpolation, keyframes, ThemeProvider }
export default styled
