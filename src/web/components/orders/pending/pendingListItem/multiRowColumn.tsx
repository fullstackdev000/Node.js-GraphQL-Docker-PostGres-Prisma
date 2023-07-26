import CheckMarkSvg from '#veewme/web/assets/svg/checkmark.svg'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { PendingOrderService } from '../../types'

const StyledServicesColumn = styled.div `
  grid-area: multi;
  flex: 1;
  display: flex;
  height: 100px;
  padding: 8px 0;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    padding: 8px 0px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    border-top: 1px dashed ${props => props.theme.colors.INFO_BORDER};
    padding: 8px 0px;
  }
`

const StyledList = styled.ul `
  flex: 1;
`

const StyledListItem = styled.li `
  display: grid;
  grid-template-columns: 100px 2fr 3fr 40px;
  grid-template-rows: auto;
  grid-template-areas: "date photo service done";
  margin-bottom: 4px;
  border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    border-left: none;
  }
`

const StyledCell = styled.div<{ gridArea: string }> `
  grid-area: ${props => props.gridArea};
  display: flex;
  align-items: center;
  padding-left: 8px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  & + div {
    border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  }
`

const StyledCheckbox = styled.div `
  width: 16px;
  height: 16px;
  border: 1px solid ${props => props.theme.colors.BUTTON_BORDER};
`

const StyledCheckMark = styled(CheckMarkSvg) `
  width: 14px;
  height: 13px;
  fill: ${props => props.theme.colors.GREEN};
`

interface MultiRowColumnProps {
  services: PendingOrderService[]
}

const MultiRowColumn: React.FunctionComponent<MultiRowColumnProps> = props => {

  return (
    <StyledServicesColumn>
      <Scrollbars>
        <StyledList>
          {props.services.map((service, idx) => (
            <StyledListItem key={idx}>
              <StyledCell gridArea='date'>
                <p>{service.photographerScheduledAt}</p>
              </StyledCell>
              <StyledCell gridArea='photo'>
                <p>{service.photographer ? `${service.photographer.user.firstName} ${service.photographer.user.lastName}` : '-'}</p>
              </StyledCell>
              <StyledCell gridArea='service'>
                <p>{service.service.name}</p>
              </StyledCell>
              <StyledCell gridArea='done'>
                <StyledCheckbox>
                  {service.status === 'Completed' &&
                    <StyledCheckMark/>
                  }
                </StyledCheckbox>
              </StyledCell>
            </StyledListItem>
          ))}
        </StyledList>
      </Scrollbars>
    </StyledServicesColumn>
  )
}

export default MultiRowColumn
