import { DiscountExpireDate, DiscountType, PromoCode } from '#veewme/lib/types'
import DropDownButton from '#veewme/web/common/buttons/dropDownButton'
import styled from '#veewme/web/common/styled-components'
import { format } from 'date-fns'
import * as React from 'react'
import { StyledGrid } from './styled'

const StyledItem = styled.div `
  border-radius: 7px;
  background-color: white;
  margin: 10px 0;
  font-weight: 600;
  font-size: 12px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 10px;
  }
  &:hover, &:active {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
`

const StyledGridCell = styled.div<{area: string}> `
  grid-area: ${props => props.area};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 8px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  & + div {
    border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
  }
`

const StyledDropDownButton = styled(DropDownButton)`
  width: 100%;

  button {
    width: 100%;
    background-color: transparent;
    border: none;
  }
`

const StyledSecondRowCell = styled(StyledGridCell) `
@media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
  border-top: 1px dashed ${props => props.theme.colors.INFO_BORDER};
}
`

const StyledCenteredCell = styled(StyledGridCell) `
  justify-content: center;
`

const StyledSecondRowCenteredCell = styled(StyledSecondRowCell) `
  justify-content: center;
`

const StyledDescriptionCell = styled(StyledSecondRowCell) `
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    border-left: none !important;
  }
`

const StyledEllipsisText = styled.p `
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const formatDiscount = (discount: number, type: DiscountType, currency: string = '$') => {
  if (type === 'amount') {
    return `-${currency}${discount}`
  } else {
    return `-${discount}%`
  }
}

const formatExpirationDate = (date: DiscountExpireDate, dateFormat: string = 'MM/DD/YYYY') => {
  if (date === 'unlimited') {
    return 'Unlimited'
  } else {
    return format(date, dateFormat)
  }
}

interface PromoCodesListItemProps {
  code: PromoCode
  currency?: string
  dateFormat?: string
  onEditClick: (code: PromoCode) => void
  onDeleteClick: (code: PromoCode) => void
}

// TODO connect to services and display service label
const PromoCodesListItem: React.FunctionComponent<PromoCodesListItemProps> = props => (
  <StyledItem>
    <StyledGrid>
      <StyledGridCell area='code'>
        <StyledEllipsisText>
          {props.code.code}
        </StyledEllipsisText>
      </StyledGridCell>
      <StyledGridCell area='service'>
        <StyledEllipsisText>
          {`Service with id ${props.code.serviceId}`}
        </StyledEllipsisText>
      </StyledGridCell>
      <StyledCenteredCell area='validity'>
        {props.code.validity}
      </StyledCenteredCell>
      <StyledDescriptionCell area='description'>
        <StyledEllipsisText>
          {props.code.description}
        </StyledEllipsisText>
      </StyledDescriptionCell>
      <StyledCenteredCell area='discount'>
        {formatDiscount(props.code.discount, props.code.discountType, props.currency)}
      </StyledCenteredCell>
      <StyledSecondRowCenteredCell area='expiration'>
        {formatExpirationDate(props.code.expireDate, props.dateFormat)}
      </StyledSecondRowCenteredCell>
      <StyledSecondRowCenteredCell area='used'>
        {props.code.usageCount}
      </StyledSecondRowCenteredCell>
      <StyledGridCell area='action'>
        <StyledDropDownButton
          list={[{
            items: [{
              label: 'Edit',
              onClick: () => props.onEditClick(props.code)
            }, {
              label: 'Delete',
              onClick: () => props.onDeleteClick(props.code)
            }]
          }]}
        />
      </StyledGridCell>
    </StyledGrid>
  </StyledItem>
)

export default PromoCodesListItem
