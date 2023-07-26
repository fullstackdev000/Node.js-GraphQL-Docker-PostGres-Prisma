import { nameof } from '#veewme/lib/util'
import RadioInputField from '#veewme/web/common/formikFields/radioInputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { BrokerFormValues } from './valuesInterfaces'

const StyledPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const Radio = styled(RadioInputField)`
  &:not(:first-child) { margin-top: 25px; }
  &:not(:last-child) { margin-bottom: 25px; }
`

const Select = styled(SelectField)`
  padding-left: 20px;
`

const RealEstateSiteMediaStyle: React.FunctionComponent<{}> = () => {
  return (
    <StyledPanel
      heading='Property Site / Media Style'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text='Select the property site / tour style to display media in. Click on sample links to view te different styles.'
        />
      }
    >
      <Field
        name={nameof<BrokerFormValues>('realEstateSiteMediaStyle')}
        value='MODERN'
        component={Radio}
        size='s'
        label='Modern (default) Overview'
      />
      <Field
        name={nameof<BrokerFormValues>('realEstateSiteMediaStyle')}
        value='SLIDESHOW'
        component={Radio}
        size='s'
        label={<>Slideshow Overview</>}
      />
      <Field
        name={nameof<BrokerFormValues>('music')}
        label='Select Music:'
        component={Select}
        options={[
          { label: 'option 1', value: 'option1' },
          { label: 'option 2', value: 'option2' },
          { label: 'option 3', value: 'option3' }
        ]}
      />
      <Field
        name={nameof<BrokerFormValues>('realEstateSiteMediaStyle')}
        value='RESPONSIVE'
        component={Radio}
        size='s'
        label={<>Responsive Overview</>}
      />
      <Field
        name={nameof<BrokerFormValues>('realEstateSiteMediaStyle')}
        value='VIDEO'
        component={Radio}
        size='s'
        label={<>Video Overview</>}
      />
    </StyledPanel>
  )
}

export default RealEstateSiteMediaStyle
