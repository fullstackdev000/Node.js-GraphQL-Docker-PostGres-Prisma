import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import withOnChange, { FormPropsWithOnChange } from '#veewme/web/common/formikFields/withOnChange'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

// Test data - to remove later
const RegionOptions = [{
  label: 'Region 1',
  value: 'Region 1'
}, {
  label: 'Region 2',
  value: 'Region 2'
}, {
  label: 'Region 22',
  value: 'Region 22'
}, {
  label: 'Region 3',
  value: 'Region 3'
}]

export const StyledFiltersWrapper = styled.div `
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 8px 0;
  width: 100%;
  & > div {
    margin-right: 12px;
  }
  & > :last-child {
    margin-right: 0;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin-top: 10px;
  }
`

const StyledFieldWrapper = styled.div `
`

const StyledInputField = styled(InputField) `
  width: 200px;
`

const StyledSelectField = styled(SelectField) `
  min-width: 200px;
  width: 200px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    min-width: 150px;
    width: 150px;
  }
`

export const ResetButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding: 0 8px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  border-radius: 5px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  background-color: transparent;
  font-weight: 600;
  cursor: pointer;
  transition: border .5s, color .5s;
  margin-bottom: 5px;

  &:hover {
    border: 2px solid ${props => props.theme.colors.GREY};
  }
`

export interface FiltersFormValues {
  address?: string
  region?: string
}

interface FiltersProps {}

type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

class FiltersBar extends React.PureComponent<FiltersFormProps, {}> {
  render () {
    const {
      dirty,
      handleReset
    } = this.props

    return (
      <Form>
        <StyledFiltersWrapper>
          <StyledFieldWrapper>
            <Field
              type='text'
              name={nameof<FiltersFormValues>('address')}
              placeholder='Search Address/OrderID...'
              component={StyledInputField}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              name={nameof<FiltersFormValues>('region')}
              placeholder='Region'
              component={StyledSelectField}
              isClearable
              options={RegionOptions}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <ResetButton
              type='button'
              onClick={handleReset}
              disabled={!dirty}
            >
              Reset
            </ResetButton>
          </StyledFieldWrapper>
        </StyledFiltersWrapper>
      </Form>
    )
  }
}

const FiltersForm = withFormik<FormPropsWithOnChange<FiltersProps, FiltersFormValues>, FiltersFormValues>({
  handleSubmit:  () => null, //tslint:disable-line
  mapPropsToValues: () => ({
    address: '',
    region: ''
  })
})(withOnChange(FiltersBar))

export default FiltersForm
