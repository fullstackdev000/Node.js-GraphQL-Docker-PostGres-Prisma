import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import CheckMarkStamp from '#veewme/web/common/checkMarkStamp'
import InputField from '#veewme/web/common/formikFields/inputField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from '../orderForm'
import { CreateOrderFormValues } from '../types'
import { StyledPanelContentWrapper, StyledPrice } from './styled'

const StyledTotalWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledTotalLabel = styled.h4`
  font-size: 26px;
  font-weight: 400;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const StyledButtonWrapper = styled.div `
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding-bottom: 6px;
`

const StyledCheckMarkWrapper = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-right: 5px;
`

const StyledCheckMarkStamp = styled(CheckMarkStamp)`
  width: 20px;
  height: 20px;
  background-color: ${props => props.theme.colors.GREEN};
`

const StyledInlineWrapper = styled.div`
  width: 100%;
  padding-bottom: 15px;
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-column-gap: 30px;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};

  &:first-child {
    padding-bottom: 15px;
  }
`

const DisconuntValue = styled(StyledPrice)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 6px;
  font-size: 23px;
`

interface CostSummaryPanelProps {
  values: CreateOrderFormValues
  currency?: string
  discount: number
  validPromoCode: boolean
  onApplyPromoCode: () => void
  onCancelPromoCode: () => void
}

// TODO Show that a code is invalid?
const CostSummaryPanel: React.FunctionComponent<CostSummaryPanelProps> = ({ currency = '$', ...props }) => {
  let newPrice = props.values.orderTotal

  if (props.discount) {
    newPrice -= props.discount
  }

  return (
    <Panel
      heading='Cost Summary'
      headingPlacedComponent={
        <Button
          type='button'
          buttonTheme='primary'
          label='Cancel'
          size='small'
          onClick={props.onCancelPromoCode}
          disabled={!props.discount}
        />
      }
    >
      <StyledPanelContentWrapper>
        <StyledInlineWrapper>
          <Field
            name={nameof<FormValues>('promoCodeToCheck')}
            component={InputField}
            label='Enter Promo Code:'
            compactMode
            rightComponent={ props.validPromoCode &&
              <StyledCheckMarkWrapper>
                <StyledCheckMarkStamp/>
              </StyledCheckMarkWrapper>
            }
          />
          <StyledButtonWrapper>
            <Button
              type='button'
              buttonTheme='action'
              full
              label='Apply'
              onClick={props.onApplyPromoCode}
            />
          </StyledButtonWrapper>
          {
            props.discount > 0 &&
            <DisconuntValue>
              -{currency}{props.discount.toFixed(2)}
            </DisconuntValue>
          }
        </StyledInlineWrapper>
        <StyledTotalWrapper>
          <StyledTotalLabel>
            Total:
          </StyledTotalLabel>
          <StyledPrice>
            {currency}{newPrice.toFixed(2)}
          </StyledPrice>
        </StyledTotalWrapper>
      </StyledPanelContentWrapper>
    </Panel>
  )
}

export default CostSummaryPanel
