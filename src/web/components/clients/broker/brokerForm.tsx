import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import { OptionValue } from '#veewme/web/common/formikFields/selectField'
import AddBrokerage from '#veewme/web/common/formPanels/addBrokerage'
import Address from '#veewme/web/common/formPanels/address'
import ContactInformation from '#veewme/web/common/formPanels/contactInformation'
import Region from '#veewme/web/common/formPanels/region'
import { BrokerFormValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as Grid from '#veewme/web/common/grid'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { BrokerNavigation } from './brokerNavigation'
import BrokerValidationSchema from './validation'

export interface FormOptions {
  regionOptions: OptionValue[]
}

interface BrokerCustomProps {
  formOptions: FormOptions
  values: BrokerFormValues
  onSubmit: (values: BrokerFormValues) => void
  name?: string
}

type BrokerFormProps = FormikProps<BrokerFormValues> & BrokerCustomProps

const BrokerForm: React.FunctionComponent<BrokerFormProps> = props => {
  return (
    <>
      <Grid.Wrapper as={Form}>
        <Grid.Heading>
          <h1>Broker profile{props.name && `: ${props.name}`}</h1>
        </Grid.Heading>
        <Grid.LeftDesktopAside>
          <BrokerNavigation />
        </Grid.LeftDesktopAside>
        <Grid.MainColumn>
          <AddBrokerage />
          <Address />
        </Grid.MainColumn>
        <Grid.RightAside>
          <ContactInformation />
          <Region
            options={props.formOptions.regionOptions}
          />
        </Grid.RightAside>
        <Grid.Footer />
      </Grid.Wrapper>
      <NavigationWarning touched={props.touched} />
    </>
  )
}

export default withFormik<BrokerCustomProps, BrokerFormValues>({
  enableReinitialize: true,
  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => (props.values),
  validateOnChange: false,
  validationSchema: BrokerValidationSchema
})(BrokerForm)
