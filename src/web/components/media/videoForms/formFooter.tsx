import Button from '#veewme/web/common/buttons/basicButton'
import * as React from 'react'

import { StyledFooter } from './styled'

const FormFooter: React.FunctionComponent = () => (
  <StyledFooter>
    <Button to='0' buttonTheme='action' label='Prev Step'/>
    <Button type='submit' full buttonTheme='action' label='Submit'/>
  </StyledFooter>
)

export default FormFooter
