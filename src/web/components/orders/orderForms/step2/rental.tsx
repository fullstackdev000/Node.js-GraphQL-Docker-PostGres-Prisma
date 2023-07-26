import RadioField from '#veewme/web/common/formikFields/radioInputField'
import { Switch } from '#veewme/web/common/formikFields/switchField'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldProps } from 'formik'
import * as React from 'react'
import { StyledBold } from '../styled'

const StyledSwitch = styled(Switch)`
  margin-bottom: 5px;
`

const StyledRentalWrapper = styled.div `
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  border-bottom: 2px solid ${props => props.theme.colors.BORDER};
`

const StyledRentalPeriodWrapper = styled.div `
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div {
    margin: unset;
  }
  & > :nth-child(2) {
    margin: 0 50px;
  }
`

const Rental: React.FunctionComponent<FieldProps> = props => {
  return (
    <StyledRentalWrapper>
      <div>
        <StyledSwitch
          name='rentalCheckbox'
          label={<><p><StyledBold>Rental</StyledBold></p><p>Select if you want to rent this property</p></>}
          value={!!props.field.value}
          onChange={() => {
            props.form.setFieldTouched(props.field.name)
            if (props.field.value) {
              props.form.setFieldValue(props.field.name, null)
            } else {
              props.form.setFieldValue(props.field.name, 'Month')
            }
          }}
        />
      </div>
      <StyledRentalPeriodWrapper>
        <Field
          name={props.field.name}
          labelPosition='bottom'
          value='Month'
          component={RadioField}
          label='Month'
        />
        <Field
          name={props.field.name}
          labelPosition='bottom'
          value='Week'
          component={RadioField}
          label='Week'
        />
        <Field
          name={props.field.name}
          labelPosition='bottom'
          value='Day'
          component={RadioField}
          label='Day'
        />
      </StyledRentalPeriodWrapper>
    </StyledRentalWrapper>
  )
}

export default Rental
