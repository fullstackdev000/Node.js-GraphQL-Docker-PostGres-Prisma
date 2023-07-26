import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { EmployeeFormGeneralValues, EmployeeFormValues } from '../employeeForm'

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px;
  column-gap: 30px;
  & > * {
    grid-column: 1
    & > * {width: 100%}
  }
  & > *:last-child {
    grid-column: 2;
    grid-row-start: 1;
    grid-row-end: 6;
    margin-top: 35px;
  }
`
const General: React.FunctionComponent<{}> = () => {
  return (
    <Panel
      heading='General'
      id='general'
      toggleable
    >
      <CustomGrid>
        <Field label='First Name' component={InputField} name={`${nameof<EmployeeFormValues>('general')}.${nameof<EmployeeFormGeneralValues>('firstName')}`}/>
        <Field label='Last Name:' component={InputField} name={`${nameof<EmployeeFormValues>('general')}.${nameof<EmployeeFormGeneralValues>('lastName')}`}/>
        <Field label='Email:' component={InputField} name={`${nameof<EmployeeFormValues>('general')}.${nameof<EmployeeFormGeneralValues>('email')}`}/>
        <Field
          component={UploadImageField}
          name={`${nameof<EmployeeFormValues>('general')}.${nameof<EmployeeFormGeneralValues>('photo')}`}
          label={<>
            Uploaded picture will be cropped/resized to a square.
            To achieve best results, upload a square or almost square picture.
          </>}
        />
      </CustomGrid>
    </Panel>
  )
}

export default General
