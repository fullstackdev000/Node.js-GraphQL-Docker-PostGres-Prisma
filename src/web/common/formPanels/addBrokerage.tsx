import { nameof } from '#veewme/lib/util'
import Input from '#veewme/web/common/formikFields/inputField'
import UploadImageField, { HelpersWrapper } from '#veewme/web/common/formikFields/uploadImageField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { Company } from './valuesInterfaces'

const BrokerageLogo = styled(UploadImageField)`
  ${HelpersWrapper} {
    & > label {
      margin-top: 0;
      & > div {
        margin-top: 0;
      }
    }
  }
`

const BrokerageNameInput = styled(Input)`
  & > label {
    margin-top: 0;
  }
`

const BrokerageName: React.FunctionComponent<{}> = () => {
  return (
    <Field
      name={nameof<Company>('companyName')}
      component={BrokerageNameInput}
      label='Company Name:'
    />
  )
}

const AddBrokerage: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='Brokerage' id='addBrokerage' toggleable>
      <Field
        name={nameof<Company>('profilePicture')}
        component={BrokerageLogo}
        fieldOrientation='landscape'
        label={<BrokerageName/>}
        imageFullDimensions={{ height: 120, width: 200 }}
      />
    </Panel>
  )
}

export default AddBrokerage
