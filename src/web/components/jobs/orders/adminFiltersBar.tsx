import { Affiliate } from '#veewme/lib/types'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import CheckboxField from '../../../common/formikFields/checkboxField'
import DateRangeSelectField from '../../../common/formikFields/dateFields/dateRangeSelectField'
import InputField from '../../../common/formikFields/inputField'
import SelectField from '../../../common/formikFields/selectField'
import withOnChange, { FormPropsWithOnChange } from '../../../common/formikFields/withOnChange'

// Test data - to remove later
const VideoOptions = [{
  label: 'Video 1',
  value: 'Video 1'
}, {
  label: 'Video 2',
  value: 'Video 2'
}, {
  label: 'Video 22',
  value: 'Video 22'
}, {
  label: 'Video 3',
  value: 'Video 3'
}]

const StyledFiltersWrapper = styled.div `
  margin: 8px 0;
  width: 100%;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin-top: 12px;
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

const StyledDateField = styled(DateRangeSelectField) `
  min-width: 205px;
`

const StyledCheckboxField = styled(CheckboxField) `
  margin-bottom: 5px;
`

const StyledMainGrid = styled.div `
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'area1 area2';
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: 1fr;
    grid-template-areas: 'area1' 'area2';
  }
`

const StyledArea1 = styled.div `
  grid-area: area1;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  & > * {
    padding: 0 12px;
  }
  & > :first-child {
    border-right: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
    padding-left: 0;
  }
  & > :last-child {
    border-right: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
    padding-left: 0;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    & > :last-child {
      border-right: none;
      padding-right: 0;
    }
  }
`

const StyledArea2 = styled.div `
  grid-area: area2;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  ${StyledFieldWrapper} {
    padding-left:12px;
  }
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin-top: 12px;
    & > :first-child {
      padding-left: 0;
    }
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
  affiliate?: Affiliate['id']
  date?: Date
  videoType?: string
  interactive?: boolean
  panorama?: boolean
}

interface FiltersProps {}

type FiltersBarProps = FiltersProps & FormikProps<FiltersFormValues>

class FiltersBar extends React.PureComponent<FiltersBarProps, {}> {
  render () {
    const {
      dirty,
      handleReset
    } = this.props

    return (
      <Form>
        <StyledFiltersWrapper>
          <StyledMainGrid>
            <StyledArea1>
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
                  type='text'
                  name={nameof<FiltersFormValues>('affiliate')}
                  placeholder='Affiliate'
                  component={StyledInputField}
                />
              </StyledFieldWrapper>
              <StyledFieldWrapper>
                  <Field
                    name={nameof<FiltersFormValues>('date')}
                    placeholder='Date'
                    component={StyledDateField}
                  />
                </StyledFieldWrapper>
            </StyledArea1>
            <StyledArea2>
                <StyledFieldWrapper>
                  <Field
                    name={nameof<FiltersFormValues>('videoType')}
                    placeholder='Video Type'
                    component={StyledSelectField}
                    isClearable
                    options={VideoOptions}
                  />
                </StyledFieldWrapper>
                <StyledFieldWrapper>
                  <Field
                    name={nameof<FiltersFormValues>('interactive')}
                    label='Interactive'
                    component={StyledCheckboxField}
                  />
                </StyledFieldWrapper>
                <StyledFieldWrapper>
                  <Field
                    name={nameof<FiltersFormValues>('panorama')}
                    label='Panorama'
                    component={StyledCheckboxField}
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
            </StyledArea2>
          </StyledMainGrid>
        </StyledFiltersWrapper>
      </Form>
    )
  }
}

const FiltersForm = withFormik<FormPropsWithOnChange<FiltersProps, FiltersFormValues>, FiltersFormValues>({
  handleSubmit:  () => null, //tslint:disable-line
  mapPropsToValues: () => ({
    address: '',
    affiliate: 0, // TODO make optional for initial data
    interactive: false,
    panorama: false,
    videoType: ''
  })
})(withOnChange(FiltersBar))

export default FiltersForm
