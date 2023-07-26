import { Countries, States } from '#veewme/lib/constants'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from '../orderForm'
import { StyledGreenBold, StyledRedSpanHeader } from '../styled'
import { RealEstateFormData, TourFormData } from '../types'

const RealEstateFormDataPanelHeader: React.FunctionComponent<{}> = () => (
  <StyledRedSpanHeader>
    <p>Property Address <span>*</span></p>
  </StyledRedSpanHeader>
)

const StyledGrid = styled.div `
  margin: 30px 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 30px;
  input {width: 100%;}
`
// hide button for now
const ButtonWrapper = styled.div `
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;

  display: none;
`

interface RealEstateAddressPanelProps {
  onUpdateLocation: () => void
  editMode?: boolean
}

const RealEstateAddressPanel: React.FunctionComponent<RealEstateAddressPanelProps> = props => {
  return (
    <Panel id='address' heading='' headingPlacedComponent={<RealEstateFormDataPanelHeader/>}>
      <p><StyledGreenBold>Note!</StyledGreenBold> Street address will lock after 30 days and it will not be changeable.</p>
      <StyledGrid>
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('street')}`}
          component={InputField}
          label='Street Address:'
          disabled={!props.editMode}
          required
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('city')}`}
          component={InputField}
          label='City:'
          disabled={!props.editMode}
          required
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('state')}`}
          component={SelectField}
          label='State/Province:'
          placeholder='State/Province...'
          options={States}
          isDisabled={!props.editMode}
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('zip')}`}
          component={InputField}
          label='ZIP/Postal Code:'
          disabled={!props.editMode}
          required
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('country')}`}
          component={SelectField}
          label='Country:'
          placeholder='Country...'
          options={Countries}
          compactMode
          isDisabled={!props.editMode}
        />
        {props.editMode && (
          <ButtonWrapper>
            <Button
              type='button'
              buttonTheme='action'
              full
              label='Update location'
              onClick={props.onUpdateLocation}
            />
          </ButtonWrapper>
        )}
      </StyledGrid>
      {props.editMode && (
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('tour')}.${nameof<TourFormData>('displayAddress')}`}
          label="Don't display address on Property Site/Tour"
          component={CheckboxField}
        />
      )}
    </Panel>
  )
}

export default RealEstateAddressPanel
