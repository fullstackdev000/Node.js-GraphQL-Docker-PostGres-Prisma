import * as Grid from '#veewme/web/common/grid'
import { NavHashLink } from '#veewme/web/common/hashLink'
import SecondaryNavigation from '#veewme/web/common/secondaryNavigation'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Access from './formPanels/access'
import General from './formPanels/general'

export interface EmployeeFormGeneralValues {
  firstName: string
  lastName: string
  email: string
  photo: string
}

export interface EmployeeFormAccessRightsValues {
  activateOrder: boolean
  addDeleteAgent: boolean
  addDeleteBroker: boolean
  addDeleteOrder: boolean
  addDeletePromoCode: boolean
  addDeleteService: boolean
  billing: boolean
  editService: boolean
  photographerCompensation: boolean
  reports: boolean
}

export interface EmployeeFormValues {
  accessRights: EmployeeFormAccessRightsValues
  general: EmployeeFormGeneralValues
}

export const defaultFormValues: EmployeeFormValues = {
  accessRights: {
    activateOrder: false,
    addDeleteAgent: false,
    addDeleteBroker: false,
    addDeleteOrder: false,
    addDeletePromoCode: false,
    addDeleteService: false,
    billing: false,
    editService: false,
    photographerCompensation: false,
    reports: false
  },
  general: {
    email: '',
    firstName: '',
    lastName: '',
    photo: ''
  }
}

interface EmployeeCustomProps {
  initialValues?: EmployeeFormValues
  onSubmit: (values: EmployeeFormValues) => void
}

type EmployeeFormProps = FormikProps<EmployeeFormValues> & EmployeeCustomProps

const EmployeeForm: React.FunctionComponent<EmployeeFormProps> = props => {
  return (
    <Grid.Wrapper as={Form}>
      <Grid.Heading>
        <h1>User profile</h1>
      </Grid.Heading>
      <Grid.LeftDesktopAside>
        <SecondaryNavigation>
          <li><NavHashLink to='#general'>General</NavHashLink></li>
          <li><NavHashLink to='#access'>Access Rights</NavHashLink></li>
        </SecondaryNavigation>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn>
        <General/>
        <Access/>
      </Grid.MainColumn>
      <Grid.Footer />
    </Grid.Wrapper>
  )
}

export default withFormik<EmployeeCustomProps, EmployeeFormValues>({
  enableReinitialize: true,
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...defaultFormValues,
    ...props.initialValues
  })
})(EmployeeForm)
