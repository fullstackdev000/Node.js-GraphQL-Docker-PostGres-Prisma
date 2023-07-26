import Button from '#veewme/web/common/buttons/basicButton'
import Chips, { Chip } from '#veewme/web/common/chips'
import InputField from '#veewme/web/common/formikFields/inputField'
import { guidGenerator } from '#veewme/web/common/util'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { Plus } from 'styled-icons/fa-solid'
import { StyledInputWrapper, StyledSection } from './styled'

interface AddChipsSectionProps {
  valuesName: string
  chips: Chip[]
  inputName: string
  inputValue: string
  inputPlaceholder: string
  inputLabel: string
}

const AddChipsSection: React.FunctionComponent<AddChipsSectionProps> = props => (
  <StyledSection>
    <FieldArray
      name={props.valuesName}
      render={ ({ push, form, remove }) => (
        <>
          <StyledInputWrapper>
            <Field
              name={props.inputName}
              component={InputField}
              value={props.inputValue}
              placeholder={props.inputPlaceholder}
              label={props.inputLabel}
              compactMode
            />
            <Button
              type='button'
              full
              buttonTheme='action'
              icon={Plus}
              onClick={() => {
                if (props.inputValue.length > 0) {
                  push({
                    id: guidGenerator(),
                    label: props.inputValue
                  })
                  form.setFieldValue(props.inputName, '')
                }
              }}
            />
          </StyledInputWrapper>
          <Chips
            chips={props.chips}
            onChipDelete={(id: Chip['id']) => {
              const idx = props.chips.findIndex(chip => chip.id === id)
              if (idx > -1) {
                remove(idx)
              }
            }}
          />
        </>
      )}
    />
  </StyledSection>
)

export default AddChipsSection
