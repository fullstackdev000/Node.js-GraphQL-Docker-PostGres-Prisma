import { Currencies } from '#veewme/lib/constants'
import { nameof } from '#veewme/lib/util'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import TextareaField from '#veewme/web/common/formikFields/textareaField'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FormValues } from '../orderForm'
import { StyledHelpWrapper } from '../styled'
import { RealEstateFormData, TourFormData } from '../types'
import Rental from './rental'

const priceHelpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`
const realEstateHeadlineHelpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`
const realEstateDescriptionHelpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`
const realEstateShortDescriptionHelpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`

const StyledPanel = styled(Panel) `
  input {
    max-width: 100%;

    &[type='number'] {
      -moz-appearance:textfield;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
  }
`

const StyledGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  margin-top: 20px;
  align-items: end;
  & input {width: 100%;}
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StyledSizeUnitWrapper = styled.div `
  justify-self: start;
`

const StyledRealEstateHeadlineWrapper = styled.div `
  grid-column: 1 / span 3;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 1 / span 2;
  }
`

const StyledEditorWrapper = styled.div `
  grid-column: 1 / span 4;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-column: 1 / span 2;
  }
`

const StyledWysiwygHelpWrapper = styled(StyledHelpWrapper) `
  flex: 1;
  justify-content: flex-end;
`

const StyledUnitSelectField = styled(SelectField) `
  & > div {
    width: 120px;
  }
`

type Screen = 'small' | 'large'

const StyledEmptyCell = styled.div<{ screen: Screen }> `
  display: ${props => props.screen === 'large' ? 'block' : 'none'};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: ${props => props.screen === 'small' ? 'block' : 'none'};
  }
`

const CanadianBedroomsStyled = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    width: 47%;
    min-width: unset;
  }
`

const get0to20Options = () => (
  [...Array(21).keys()].map(i => ({
    label: i,
    value: i
  }))
)

interface BedroomsProps {
  showCanadianBedrooms: boolean
}

const Bedrooms: React.FC<BedroomsProps> = props => {
  return props.showCanadianBedrooms ? (
    <CanadianBedroomsStyled>
      <Field
        name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('bedroomsAboveGrade')}`}
        component={SelectField}
        label='Bedrooms Above Grade'
        options={get0to20Options()}
      />
    <Field
      name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('bedroomsBelowGrade')}`}
      component={SelectField}
      label='Bedrooms Below Grade:'
      options={get0to20Options()}
    />
    </CanadianBedroomsStyled>
  ) : (
    <Field
      name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('bedrooms')}`}
      component={SelectField}
      label='Bedrooms:'
      options={get0to20Options()}
    />
  )
}
const RealEstateDetailsPanel: React.FunctionComponent<{
  isOpen?: boolean,
  showCanadianBedrooms: boolean
}> = props => {

  const listingTypeOptions = [
    {
      label: 'Primary',
      options: [
        { label: 'Single Family Home', value: 'SingleFamilyHome' },
        { label: 'Townhouse', value: 'Townhouse' },
        { label: 'Cooperative', value: 'Cooperative' },
        { label: 'Rental/Lease', value: 'RentalLease' },
        { label: 'Lot/Land', value: 'LotLand' }
      ]
    },
    {
      label: 'Additional',
      options: [
        { label: 'Commercial', value: 'Commercial' },
        { label: 'Cottage', value: 'Cottage' },
        { label: 'Industrial', value: 'Industrial' },
        { label: 'Residential Home', value: 'ResidentialHome' }
      ]
    }
  ]

  const homeSizeUnitOptions = [
    { label: 'Sq. Ft.', value: 'SquareFeet' },
    { label: 'Sq. Meters', value: 'SquareMeters' }
  ]

  const lotSizeUnitOptions = homeSizeUnitOptions.concat([
    { label: 'Acres', value: 'Acres' },
    { label: 'Hectares', value: 'Hectares' }
  ])

  return (
    <StyledPanel
      heading='Property Details'
      toggleable
      collapsed={!props.isOpen}
      id='details'
    >
      <Field component={Rental} name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('rental')}`} />
      <StyledGrid>
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('listingType')}`}
          component={SelectField}
          label='Listing Type:'
          options={listingTypeOptions}
        />
        <StyledEmptyCell screen='small'/>
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('price')}`}
          component={InputField}
          rightComponent={
            <StyledHelpWrapper>
              <InlineHelp
                text={priceHelpText}
              />
            </StyledHelpWrapper>
          }
          type='number'
          label='Price:'
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('currency')}`}
          component={SelectField}
          label='Currency:'
          options={Currencies}
        />
        <Bedrooms showCanadianBedrooms={props.showCanadianBedrooms} />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('fullBathrooms')}`}
          component={SelectField}
          label='Full Bathrooms:'
          options={get0to20Options()}
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('halfBathrooms')}`}
          component={SelectField}
          label='Half Bathrooms:'
          options={get0to20Options()}
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('garages')}`}
          component={SelectField}
          label='Garages:'
          options={get0to20Options()}
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('parkingSpaces')}`}
          component={InputField}
          type='number'
          label='Parking Spaces:'
        />
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('yearBuilt')}`}
          component={InputField}
          type='number'
          label='Year Built:'
        />
        <StyledEmptyCell screen='large'/>
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('homeSize')}`}
          component={InputField}
          type='number'
          label='Home Size:'
        />
        <StyledSizeUnitWrapper>
          <Field
            name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('homeSizeUnit')}`}
            component={StyledUnitSelectField}
            options={homeSizeUnitOptions}
            compactMode={false}
          />
        </StyledSizeUnitWrapper>
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('lotSize')}`}
          component={InputField}
          type='number'
          label='Lot Size:'
        />
        <StyledSizeUnitWrapper>
          <Field
            name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('lotSizeUnit')}`}
            component={StyledUnitSelectField}
            options={lotSizeUnitOptions}
            compactMode={false}
          />
        </StyledSizeUnitWrapper>
        <Field
          name={`${nameof<FormValues>('mlsPrimary')}`}
          component={InputField}
          type='text'
          label='MLS Primary:'
        />
        <Field
          name={`${nameof<FormValues>('mlsSecondary')}`}
          component={InputField}
          type='text'
          label='MLS Secondary:'
        />
        <StyledRealEstateHeadlineWrapper>
          <Field
            name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('tour')}.${nameof<TourFormData>('realEstateHeadline')}`}
            component={InputField}
            label='Property Headline:'
            rightComponent={
              <StyledHelpWrapper>
                <InlineHelp
                  text={realEstateHeadlineHelpText}
                />
              </StyledHelpWrapper>
            }
          />
        </StyledRealEstateHeadlineWrapper>
        <Field
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('tour')}.${nameof<TourFormData>('hideRealEstateHeadline')}`}
          component={CheckboxField}
          label='Hide headline:'
          compactMode={false}
        />
        <StyledEditorWrapper>
          <Field
            name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('tour')}.${nameof<TourFormData>('descriptionFull')}`}
            placeholder='Some description here...'
            component={Editor}
            label='Property Description:'
            toolbarCustomButtons={[
              <StyledWysiwygHelpWrapper key={0}>
                <InlineHelp
                  text={realEstateDescriptionHelpText}
                />
              </StyledWysiwygHelpWrapper>
            ]}
          />
        </StyledEditorWrapper>
        <StyledEditorWrapper>
          <Field
            name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('tour')}.${nameof<TourFormData>('descriptionShort')}`}
            placeholder='Some description here...'
            component={TextareaField}
            label='Short Description (Brochure & Social Media Use):'
            labelBarComponent={
              <StyledHelpWrapper>
                <InlineHelp text={realEstateShortDescriptionHelpText}/>
              </StyledHelpWrapper>
            }
            labelBarComponentPosition='right'
          />
        </StyledEditorWrapper>
      </StyledGrid>
    </StyledPanel>
  )
}

export default RealEstateDetailsPanel
