import { nameof } from '#veewme/lib/util'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { EmployeeFormAccessRightsValues, EmployeeFormValues } from '../employeeForm'

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 30px;
`

const StyledColumn = styled.div `
  display: flex;
  flex-direction: column;
`

const Access: React.FunctionComponent<{}> = () => {
  return (
    <Panel
      heading='Access Rights'
      id='access'
      toggleable
    >
      <CustomGrid>
        <StyledColumn>
          <Field label='Add/Delete Order' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('addDeleteOrder')}`}/>
          <Field label='Activate Order' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('activateOrder')}`}/>
          <Field label='Billing' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('billing')}`}/>
          <Field label='Reports' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('reports')}`}/>
          <Field label='Photographer Compenstation' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('photographerCompensation')}`}/>
        </StyledColumn>
        <StyledColumn>
          <Field label='Add/Delete Agent' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('addDeleteAgent')}`}/>
          <Field label='Add/Delete Broker' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('addDeleteBroker')}`}/>
        </StyledColumn>
        <StyledColumn>
          <Field label='Add/Delete Service' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('addDeleteService')}`}/>
          <Field label='Edit Services' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('editService')}`}/>
          <Field label='Add/Delete Promo-code' component={SwitchField} name={`${nameof<EmployeeFormValues>('accessRights')}.${nameof<EmployeeFormAccessRightsValues>('addDeletePromoCode')}`}/>
        </StyledColumn>
      </CustomGrid>
    </Panel>
  )
}

export default Access
