import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledStatusSquare = styled.div<{ status: LegendStatus }> `
  width: 10px;
  height: 10px;
  margin-right: 12px;
  background-color: ${props => props.status.color};
`

const StyledStatus = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 25px;
  font-size: 10px;
  color: ${props => props.theme.colors.FIELD_TEXT};
`

const StyledStatusesContainer = styled.div `
  display: flex;
`

export interface LegendStatus {
  color: string,
  label: string
}

export interface LegendBarProps {
  statuses?: LegendStatus[]
}

const LegendBar: React.FunctionComponent<LegendBarProps> = props => (
  <>
    {props.statuses && props.statuses.length > 0 &&
      <StyledStatusesContainer>
        {props.statuses.map((status, idx) => (
          <StyledStatus key={idx}>
            <StyledStatusSquare status={status}/>
            <p>{status.label}</p>
          </StyledStatus>
        ))}
      </StyledStatusesContainer>
    }
  </>
)

export default LegendBar
