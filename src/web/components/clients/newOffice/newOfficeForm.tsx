import { OptionValue } from '#veewme/web/common/formikFields/selectField'
import AddBrokerage from '#veewme/web/common/formPanels/addBrokerage'
import Address from '#veewme/web/common/formPanels/address'
import ContactInformation from '#veewme/web/common/formPanels/contactInformation'
import PhotoDownloadPresets from '#veewme/web/common/formPanels/photoDownloadPresets'
import Region from '#veewme/web/common/formPanels/region'
import { NewOfficeValues } from '#veewme/web/common/formPanels/valuesInterfaces'
import * as Grid from '#veewme/web/common/grid'
import * as log from '#veewme/web/common/log'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import NewOfficeNavigation from './newOfficeNavigation'

interface NewOfficeCustomProps {
  regionOptions: OptionValue[]
  values: NewOfficeValues
}

type NewOfficeProps = FormikProps<NewOfficeValues> & NewOfficeCustomProps

const NewOfficeForm: React.FunctionComponent<NewOfficeProps> = props => {
  return (
    <Grid.Wrapper as={Form}>
      <Grid.Heading>
        <h1>Office Profile</h1>
      </Grid.Heading>
      <Grid.LeftDesktopAside>
        <NewOfficeNavigation/>
      </Grid.LeftDesktopAside>
      <Grid.MainColumn>
        <AddBrokerage />
        <Address />
        <PhotoDownloadPresets
          values={props.values.photoDownloadPresets}
        />
      </Grid.MainColumn>
      <Grid.RightAside>
        <ContactInformation />
        <Region options={props.regionOptions}/>
      </Grid.RightAside>
      <Grid.Footer />
    </Grid.Wrapper>
  )
}

export default withFormik<NewOfficeCustomProps, NewOfficeValues>({
  handleSubmit: (values, { setSubmitting }) => {
    log.debug(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => (props.values)
})(NewOfficeForm)
