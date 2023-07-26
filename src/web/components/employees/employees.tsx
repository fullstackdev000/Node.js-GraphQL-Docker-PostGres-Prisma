import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import NewEmployee from './employee/newEmployee'
import EmployeesList from './employeesList/employeesList'

const Employees: React.FunctionComponent<RouteComponentProps> = () => (
  <Switch>
    <Route exact path={privateUrls.addEmployee} component={NewEmployee} />
    <Route exact path={privateUrls.employees} component={EmployeesList} />
  </Switch>
)

export default Employees
