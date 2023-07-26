import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import Panel from '#veewme/web/common/panel'
import { Field } from 'formik'
import * as React from 'react'
import AddChipsSection from './addChipsSection'
import { FormValues } from './form'
import { StyledSection } from './styled'

interface TourIdProps {
  values: FormValues
}

const TourId: React.FunctionComponent<TourIdProps> = props => (
  <Panel heading="Home Page Tour ID's" toggleable>
    <StyledSection>
      <Field
        name={nameof<FormValues>('tourIdTopSample')}
        component={InputField}
        label='Top Sample:'
        compactMode
      />
    </StyledSection>
    <AddChipsSection
      chips={props.values.bottomSamples}
      valuesName={nameof<FormValues>('bottomSamples')}
      inputValue={props.values.bottomSampleToAdd}
      inputName={nameof<FormValues>('bottomSampleToAdd')}
      inputPlaceholder='Add own sample...'
      inputLabel='Bottom Samples:'
    />
  </Panel>
)

export default TourId
