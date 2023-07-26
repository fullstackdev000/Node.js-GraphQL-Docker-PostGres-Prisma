import * as React from 'react'
import styled from '../../common/styled-components'
import Calendar from '../calendar/affiliateCalendarContainer'

const Section = styled.div`
  margin: 5px 20px;
`

const CalendarDemo: React.FunctionComponent<{}> = () => (
  <Section>
    <Calendar />
  </Section>
)

export default CalendarDemo
