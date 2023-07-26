import { nameof } from '#veewme/lib/util'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import AddChipsSection from './addChipsSection'
import { FormValues } from './form'

const StyledPanel = styled(Panel) `
  & section + section {
    padding-top: 16px;
    border-top: 1px solid ${props => props.theme.colors.BORDER}
  }
`

interface RealEstateTypesProps {
  values: FormValues
}

const RealEstateTypes: React.FunctionComponent<RealEstateTypesProps> = props => (
  <StyledPanel heading='Property Types' toggleable>
    <AddChipsSection
      chips={props.values.primaryRealEstateTypes}
      valuesName={nameof<FormValues>('primaryRealEstateTypes')}
      inputValue={props.values.primaryRealEstateTypeToAdd}
      inputName={nameof<FormValues>('primaryRealEstateTypeToAdd')}
      inputPlaceholder='Add own primary type...'
      inputLabel='Primary Type:'
    />
    <AddChipsSection
      chips={props.values.otherRealEstateTypes}
      valuesName={nameof<FormValues>('otherRealEstateTypes')}
      inputValue={props.values.otherRealEstateTypeToAdd}
      inputName={nameof<FormValues>('otherRealEstateTypeToAdd')}
      inputPlaceholder='Add own other type...'
      inputLabel='Other Type:'
    />
  </StyledPanel>
)

export default RealEstateTypes
