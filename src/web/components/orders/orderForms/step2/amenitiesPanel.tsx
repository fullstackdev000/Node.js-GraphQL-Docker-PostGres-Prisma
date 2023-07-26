
import { Amenity } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import PlusSvg from '#veewme/web/assets/svg/plus.svg'
import Button from '#veewme/web/common/buttons/basicButton'
import Chips, { Chip } from '#veewme/web/common/chips'
import InputField from '#veewme/web/common/formikFields/inputField'
import Modal from '#veewme/web/common/modal'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { FormValues } from '../orderForm'
import { RealEstateFormData } from '../types'
import AddAmenitiesForm from './addAmenitiesForm'

import { amenitiesList } from './amenities'

const StyledAddAmenitiesWrapper = styled.div `
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding-bottom: 30px;
  & > :nth-child(2) {
    margin: 0 30px;
  }
`

const StyledInputWrapper = styled.div `
  flex: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div {
    flex: 1;
    margin: 0 10px 0 0;
    & > div {
      margin: 0;
    }
  }
  input {width: 100%;}
`

const StyledAmenityField = styled(Field) `
  margin: 0;
`

const StyledAmenitiesListLabel = styled.p `
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

interface AmenitiesPanelProps {
  values: Pick<FormValues, 'realEstate' | 'amenityToAdd'>
  defaultAmenities: Amenity[]
  isOpen?: boolean
}

interface AmenitiesPanelState {
  modalOpen: boolean
}

class AmenitiesPanel extends React.PureComponent<AmenitiesPanelProps, AmenitiesPanelState> {
  state: AmenitiesPanelState = {
    modalOpen: false
  }

  sortAmenities = (amenities: string[]) => (
    amenities.sort((a, b) => a.localeCompare(b))
  )

  toggleModal = () => {
    this.setState(prev => ({
      modalOpen: !prev.modalOpen
    }))
  }

  render () {
    const { values } = this.props

    return (
      <Panel
        heading='Amenities'
        toggleable
        collapsed={!this.props.isOpen}
        id='amenities'
      >
        <FieldArray
          name={`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('amenities')}`}
          render={ ({ form, push, remove }) => (
            <>
              <StyledAddAmenitiesWrapper>
                <StyledInputWrapper>
                  <StyledAmenityField
                    name={nameof<FormValues>('amenityToAdd')}
                    component={InputField}
                    placeholder='Write and add own amenities...'
                  />
                  <Button
                    disabled={!form.values.amenityToAdd}
                    type='button'
                    full
                    buttonTheme='action'
                    icon={PlusSvg}
                    onClick={() => {
                      if (form.values.amenityToAdd) {
                        push(values.amenityToAdd)
                        form.setFieldValue(nameof<FormValues>('amenityToAdd'), undefined)
                      }
                    }}
                  />
                </StyledInputWrapper>
                <p>or</p>
                <Button label='Add from list' onClick={this.toggleModal}/>
              </StyledAddAmenitiesWrapper>
              <Modal isOpen={this.state.modalOpen} onRequestClose={this.toggleModal} title='Amenities'>
                <AddAmenitiesForm
                  amenities={amenitiesList}
                  selectedAmenities={values.realEstate.amenities}
                  onSubmit={(addAmenities: Amenity[]) => {
                    const filteredAmenities = [
                      ...values.realEstate.amenities.filter(amenity => !amenitiesList.some(da => amenity === da)),
                      ...addAmenities
                    ]
                    form.setFieldValue(
                      `${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('amenities')}`,
                      this.sortAmenities(filteredAmenities)
                    )
                    form.setFieldTouched(`${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('amenities')}`)
                    this.toggleModal()
                  }}
                />
              </Modal>
              <StyledAmenitiesListLabel>Amenities List:</StyledAmenitiesListLabel>
              <Chips
                chips={values.realEstate.amenities.map((label, id) => ({ label, id }))}
                onChipDelete={(id: Chip['id']) => {
                  // Because using `remove` helper method thrown an error (reported Formik issue)
                  // custom update method is used instead.
                  // Note that `id` corresponds to array index here
                  const filteredAmenities = values.realEstate.amenities.filter((a, i) => i !== id)
                  form.setFieldValue(
                    `${nameof<FormValues>('realEstate')}.${nameof<RealEstateFormData>('amenities')}`,
                    filteredAmenities
                  )
                }}
              />
            </>
          )}
        />
      </Panel>
    )
  }
}

export default AmenitiesPanel
