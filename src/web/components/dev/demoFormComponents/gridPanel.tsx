import DateRangeField from '#veewme/web/common/formikFields/dateFields/dateRangeSelectField'
import DateField from '#veewme/web/common/formikFields/dateFields/dateSelectField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import { Field } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import AudioField from '../../../common/formikFields/audioSelectField'
import ColorField from '../../../common/formikFields/colorField'
import InputField from '../../../common/formikFields/inputField'
import SelectField from '../../../common/formikFields/selectField'
import { RangeSliderField, SliderField } from '../../../common/formikFields/sliderField'
import Panel from '../../../common/panel'
import { Button, ColorFieldWrapper, FieldWrapper, InlineFields, ResetButton, StyledHelpWrapper } from './styled'
import { DemoFormValues, GridPanelProps } from './types'

// Mock help text
const HelpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`

const AudioFilesMock = [{
  id: 'ap1',
  name: 'African Party',
  src: '/public/static/audio/african-party.mp3'
}, {
  id: 'cb2',
  name: 'Cannonballs',
  src: '/public/static/audio/cannonballs.mp3'
}, {
  id: 'so3',
  name: 'Startover',
  src: '/public/static/audio/startover.mp3'
}, {
  id: 'sb4',
  name: 'Summer beat',
  src: '/public/static/audio/summer-beat.mp3'
}, {
  id: 'md5',
  name: 'Magic dreams',
  src: '/public/static/audio/magic-dreams.mp3'
}]

// Mock select options
const RegionOptions = [{
  label: 'Region #1',
  value: 'Option #1'
}, {
  label: 'Region #2',
  value: 'Option #2'
}, {
  label: 'Region #3',
  value: 'Option #3'
}]// Shape of form values

const GridPanel: React.FunctionComponent<GridPanelProps> = props => {
  return (
    <Panel heading='Section 1'>
      <InlineFields>
        <FieldWrapper>
          <Field
            type='text'
            name={nameof<DemoFormValues>('userName')}
            placeholder='User name'
            component={InputField}
            autoComplete='off'
            label='User name'
          />
        </FieldWrapper>
        <FieldWrapper>
          <Field
            type='text'
            name={nameof<DemoFormValues>('userName')}
            placeholder='User name'
            component={InputField}
            autoComplete='off'
            label='User name with inline help button'
            rightComponent={
              <StyledHelpWrapper>
                <InlineHelp
                  text={HelpText}
                />
              </StyledHelpWrapper>
            }
          />
        </FieldWrapper>
        <FieldWrapper>
          <Field
            name={nameof<DemoFormValues>('region')}
            placeholder='Region'
            component={SelectField}
            options={RegionOptions}
            label='Region'
          />
        </FieldWrapper>
        <FieldWrapper>
          <Field
            name={nameof<DemoFormValues>('withSearch')}
            placeholder='Is searchable'
            component={SelectField}
            options={RegionOptions}
            label='Is searchable'
            isSearchable={true}
          />
        </FieldWrapper>
      </InlineFields>
      <InlineFields>
        <FieldWrapper>
          <Field
            name={nameof<DemoFormValues>('dateRange')}
            component={DateRangeField}
            label='Date range select'
          />
        </FieldWrapper>
        <FieldWrapper>
          <Field
            name={nameof<DemoFormValues>('date')}
            component={DateField}
            label='Date select'
          />
        </FieldWrapper>
      </InlineFields>
      <InlineFields>
        <ColorFieldWrapper>
          <Field
            name={nameof<DemoFormValues>('color1')}
            component={ColorField}
            label='Click to change color standard (chrome)'
          />
        </ColorFieldWrapper>
        <ColorFieldWrapper>
          <Field
            name={nameof<DemoFormValues>('color2')}
            component={ColorField}
            label='Click to change color standard (block)'
            pickerType='block'
          />
        </ColorFieldWrapper>
      </InlineFields>
      <InlineFields>
        <Field
          name={nameof<DemoFormValues>('audio')}
          component={AudioField}
          audios={AudioFilesMock}
          label='Select audio'
        />
      </InlineFields>
      <FieldWrapper>
        <Field
          name={nameof<DemoFormValues>('slider')}
          component={SliderField}
          max={80}
          label='Slider'
          unit='&#176;'
        />
      </FieldWrapper>
      <FieldWrapper>
        <Field
          name={nameof<DemoFormValues>('rangeSlider')}
          label='Range slider'
          max={50}
          component={RangeSliderField}
        />
      </FieldWrapper>
      <Button
        type='submit'
      >
        Submit
      </Button>
      <ResetButton
        type='reset'
        disabled={!props.dirty}
      >
        Reset
      </ResetButton>
    </Panel>
  )
}

export default GridPanel
