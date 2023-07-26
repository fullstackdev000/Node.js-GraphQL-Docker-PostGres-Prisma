import * as React from 'react'
import styled from '../../common/styled-components'
import Calendar from '../calendar'

const Section = styled.div`
  margin: 5px 20px;
`

const Hint = styled.div`
  margin: 15px 0;
`

const CalendarDemo: React.FunctionComponent<{}> = () => (
  <Section>
    <Hint>
      <strong>Events that already exist are not editable. You can edit (drag/reisze or remove) only the newly added event.</strong>
      <br/>This component will be used to assign single event to service order so existing events have to be read-only.
    </Hint>
    <Calendar />
  </Section>
)

export default CalendarDemo
