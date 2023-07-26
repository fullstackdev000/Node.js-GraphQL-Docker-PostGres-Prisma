import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import EmployeeForm, { EmployeeFormValues } from './employeeForm'

const NewEmployee: React.FunctionComponent<RouteComponentProps> = props => {
  const { addToast } = useToasts()

  const handleSubmit = (newValues: EmployeeFormValues) => {
    log.debug('submitted: ', newValues)
    addToast(
      `User ${newValues.general.firstName + ' ' + newValues.general.lastName} was created successfully`,
      { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
    )
    props.history.push(privateUrls.employees)
  }

  return (
    <EmployeeForm
      onSubmit={handleSubmit}
    />
  )
}

export default withRouter(NewEmployee)
