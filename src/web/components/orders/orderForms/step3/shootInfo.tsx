import { nameof } from '#veewme/lib/util'
import { defaultDateFormat } from '#veewme/web/common/consts'
import styled from '#veewme/web/common/styled-components'
import { format } from 'date-fns'
import * as React from 'react'
import { CreateOrderFormValues } from '../types'
import { StyledDetail, StyledDetailContent, StyledDetailLabel, StyledPanel, StyledPanelContentWrapper } from './styled'

import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import { Field } from 'formik'
import { FormValues } from '../orderForm'
import { RealEstateFormData } from '../types'

const StyledOccupancy = styled(StyledDetailContent)`
  text-transform: capitalize;
`

const InlineWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > div {
    flex: 0 1 auto;
    width: auto;
    margin: 0;
    padding: 0;

    &:first-child {
      padding-top: 1px;
      margin-right: 20px;
    }

    input + span {
      color: ${props => props.theme.colors.DARKER_GREY};
      font-weight: 600;
    }
  }
`

interface CustomProps {
  values: CreateOrderFormValues
  dateFormat?: string
}

type ShootInfoPanelProps = CustomProps

const ShootInfoPanel: React.FunctionComponent<ShootInfoPanelProps> = ({ dateFormat = defaultDateFormat, ...props }) => {
  const { notesForPhotographer, prefferedShootDate, prefferedShootTime, realEstate: { occupied } } = props.values
  return (
    <StyledPanel heading='Shoot Information'>
      <StyledPanelContentWrapper>
        <StyledDetail inline>
          <StyledDetailLabel>Preferred Date & Time:</StyledDetailLabel>
          <StyledDetailContent>{prefferedShootDate && format(prefferedShootDate, dateFormat)} - {prefferedShootTime}</StyledDetailContent>
        </StyledDetail>
        <StyledDetail>
          <StyledDetailLabel>Notes for photographer:</StyledDetailLabel>
          <StyledDetailContent>{notesForPhotographer}</StyledDetailContent>
        </StyledDetail>
        <InlineWrapper>
          <StyledDetail inline>
            <StyledDetailLabel>Occupancy:</StyledDetailLabel>
            <StyledOccupancy>{occupied ? 'Occupied' : 'Vacant'}</StyledOccupancy>
          </StyledDetail>
          <Field
            name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('lockBox')}`}
            label='Lock-box'
            component={CheckboxField}
            compactMode={false}
            labelFirst
          />
        </InlineWrapper>
      </StyledPanelContentWrapper>
    </StyledPanel>
  )
}

export default ShootInfoPanel
