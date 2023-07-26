import Button from '#veewme/web/common/buttons/basicButton'
import * as React from 'react'
import styled from '../../../../common/styled-components'

const StyledWrapper = styled.div `
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin: 40px 0;
`

const StyledTextWrapper = styled.div `
  flex: 1;
  margin-left: 40px;
  font-size: 15px;
  & span {
    font-weight: 700;
  }
`
const Skip: React.FunctionComponent<{}> = () => {
  return (
    <StyledWrapper>
      <Button
        buttonTheme='info'
        full
        label='Skip'
        to='2'
      />
      <StyledTextWrapper>
        <p><span>You can Skip the below sections for now and continue with the check-out process.</span></p>
        <p>These can be filled out at a later time.</p>
      </StyledTextWrapper>
    </StyledWrapper>
  )
}

export default Skip
