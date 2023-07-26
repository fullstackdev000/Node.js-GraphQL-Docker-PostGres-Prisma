import { OrderStatus, Photographer } from '#veewme/graphql/types'
import Button from '#veewme/web/common/buttons/basicButton'
import { getOrderLegendStatus, LegendLabel } from '#veewme/web/common/status'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { StylesConfig } from 'react-select/lib/styles'
import { nameof } from '../../../../lib/util'
import DateRangeSelectField from '../../../common/formikFields/dateFields/dateRangeSelectField'
import InputField from '../../../common/formikFields/inputField'
import SelectField from '../../../common/formikFields/selectField'
import withOnChange, { FormPropsWithOnChange } from '../../../common/formikFields/withOnChange'
import { StyledFiltersWrapper } from '../filtersBarElements'

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

const ClientOptions = [{
  label: 'Client 1',
  value: 'Client 1'
}, {
  label: 'Client 2',
  value: 'Client 2'
}, {
  label: 'Client 22',
  value: 'Client 22'
}, {
  label: 'Client 3',
  value: 'Client 3'
}]

const PhotographersOptions = [{
  label: 'John Newman',
  value: '#1'
}, {
  label: 'Rod Stewart',
  value: '#2'
}, {
  label: 'Edward Norton',
  value: '#3'
}]

const StyledFieldWrapper = styled.div `
`

const StyledInputField = styled(InputField) `
  font-size: 11px;
  min-width: 180px;
  width: 180px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    font-size: 13px;
    min-width: 200px;
    width: 200px;
  }
`

const StyledSelectField = styled(SelectField) `
  font-size: 11px;
  min-width: 150px;
  width: 150px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    font-size: 13px;
    min-width: 200px;
    width: 200px;
  }
`

const StyledRegionSelectField = styled(StyledSelectField) `
  min-width: 180px;
  width: 180px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    min-width: 150px;
    width: 150px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    min-width: 200px;
    width: 200px;
  }
`

const StyledDateRangeField = styled(DateRangeSelectField) `
  font-size: 11px;
  min-width: 180px;
  width: 180px;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_FHD}) {
    font-size: 13px;
    min-width: 200px;
    width: 205px;
  }
`

const StyledMainGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(4, auto) 1fr;
  grid-template-areas: 'area1 area2 area2 area2 .' 'area1 area3 area4 . .';
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    grid-template-columns: repeat(3, auto) 1fr;
    grid-template-areas: 'area3 area1 area2 area4';
  }
`

const StyledArea1 = styled.div `
  grid-area: area1;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: column;
    & > :last-child {
      border-left: unset;
      margin-left: 0;
      padding-left: 0;
      margin-top: 0;
    }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    flex-direction: row;
    & > :first-child, & > :last-child {
      border-left: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
      margin-left: 10px;
      padding-left: 10px;
      margin-top: 0;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    flex-direction: row;
    & > :first-child, & > :last-child {
      border-left: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
      margin-left: 12px;
      padding-left: 12px;
      margin-top: 0;
    }
  }
`

const StyledArea2 = styled.div `
  grid-area: area2;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  ${StyledFieldWrapper} {
    margin-left: 12px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    ${StyledFieldWrapper} {
      margin-left: 10px;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    ${StyledFieldWrapper} {
      margin-left: 12px;
    }
  }
`

const StyledArea3 = styled.div `
  grid-area: area3;
  ${StyledFieldWrapper} {
    margin-left: 12px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    ${StyledFieldWrapper} {
      margin-left: 0;
    }
  }
`

const StyledArea4 = styled.div `
  grid-area: area4;
  ${StyledFieldWrapper} {
    margin-left: 12px;
  }
`

const StyledAreaSegment = styled.div `
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`

const StyledArea2Segment1 = styled(StyledAreaSegment) `
`

const StyledArea4Segment1 = styled(StyledAreaSegment) `
  & > :first-child, & > :last-child {
      border-left: unset;
      padding-left: 0;
    }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    & > :first-child, & > :last-child {
      border-left: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
      margin-left: 10px;
      padding-left: 10px;
    }
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    & > :first-child, & > :last-child {
      border-left: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
      margin-left: 12px;
      padding-left: 12px;
    }
  }
`

interface StatusOption {
  color: string
  label: string
  value: OrderStatus
}

const getStatusOptions = (statuses: LegendLabel[]) => {
  return statuses.map(status => ({
    color: getOrderLegendStatus(status).color,
    label: getOrderLegendStatus(status).label,
    value: status
  }))
}

const colourStyles = {
  option: (styles: StylesConfig, { data }: { data: StatusOption }) => {
    return {
      ...styles,
      color: data.color
    }
  }
}

export interface FiltersFormValues {
  address?: string
  region?: string
  client?: string
  photographerId?: Photographer['id']
  date?: Date
  status?: OrderStatus
}

interface FiltersProps {
  statuses: LegendLabel[]
}

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
          <StyledMainGrid>
            <StyledArea3>
              <StyledFieldWrapper>
                <Field
                  name={nameof<FiltersFormValues>('status')}
                  placeholder='Status'
                  component={StyledSelectField}
                  isClearable
                  options={getStatusOptions(this.props.statuses)}
                  styles={colourStyles}
                />
              </StyledFieldWrapper>
          </StyledArea3>
            <StyledArea1>
              <Field
                type='text'
                name={nameof<FiltersFormValues>('address')}
                placeholder='Search Address/OrderID...'
                component={StyledInputField}
              />
              <StyledFieldWrapper>
                <Field
                  name={nameof<FiltersFormValues>('region')}
                  placeholder='Region'
                  component={StyledRegionSelectField}
                  isClearable
                  options={RegionOptions}
                />
              </StyledFieldWrapper>
            </StyledArea1>
            <StyledArea2>
              <StyledArea2Segment1>
                <StyledFieldWrapper>
                  <Field
                    name={nameof<FiltersFormValues>('client')}
                    placeholder='Client'
                    component={StyledSelectField}
                    isClearable
                    options={ClientOptions}
                  />
                </StyledFieldWrapper>
                <StyledFieldWrapper>
                  <Field
                    name={nameof<FiltersFormValues>('photographerId')}
                    placeholder='Photographer'
                    component={StyledSelectField}
                    isClearable
                    options={PhotographersOptions}
                  />
                </StyledFieldWrapper>
                <StyledFieldWrapper>
                  <Field
                    name={nameof<FiltersFormValues>('date')}
                    placeholder='Date'
                    component={StyledDateRangeField}
                  />
                </StyledFieldWrapper>
              </StyledArea2Segment1>
            </StyledArea2>
            <StyledArea4>
              <StyledArea4Segment1>
                <StyledFieldWrapper>
                  <Button
                    type='button'
                    onClick={handleReset}
                    disabled={!dirty}
                    label='Reset'
                  />
                </StyledFieldWrapper>
              </StyledArea4Segment1>
            </StyledArea4>
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
    client: '',
    photographerId: 0, // TODO make optional for initial data
    region: ''
  })
})(withOnChange(FiltersBar))

export default FiltersForm
