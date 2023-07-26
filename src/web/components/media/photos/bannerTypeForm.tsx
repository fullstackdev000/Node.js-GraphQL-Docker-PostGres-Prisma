import InlineHelp from '#veewme/web/common/inlineHelp'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import AudioField from '../../../common/formikFields/audioSelectField'
import SwitchField from '../../../common/formikFields/switchField'
import withOnChange, { FormPropsWithOnChange } from '../../../common/formikFields/withOnChange'
import styled from '../../../common/styled-components'

const FiltersDiv = styled.div`
  display: flex;
  margin: -30px 0 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    display: block;
    padding: 0 0 0 15px;
    margin: 0;
    border-left: 2px solid  ${props => props.theme.colors.BORDER};
    height: calc(100% - 30px);
  }
`

const LabelHolder = styled.div`
  display: flex;

  div {
    margin-left: 10px;
    margin-top: -2px;
  }
`

const FieldWrapper = styled.div`
  padding-left: 35px;
  margin-top: -15px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin-top: 0;
    label {
      display: none;
    }
  }
`

export const AudioFilesMock = [{
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

export interface BannerTypeFormValues {
  slideshow: boolean
  audio?: string
}

interface CustomProps {}

type BannerTypeFormProps = CustomProps & FormikProps<BannerTypeFormValues>

class BannerTypeForm extends React.Component<BannerTypeFormProps, {}> {
  render () {
    return (
      <Form>
        <FiltersDiv>
          {/* TODO change InlineHelp text */}
          <Field
            type='text'
            name={nameof<BannerTypeFormValues>('slideshow')}
            label={<LabelHolder>Enable Slideshow on Overview <InlineHelp text='Lorem ipsum dolort' /></LabelHolder>}
            component={SwitchField}
          />
          <FieldWrapper>
            <Field
              name={nameof<BannerTypeFormValues>('audio')}
              component={AudioField}
              audios={AudioFilesMock}
              label='Select'
            />
          </FieldWrapper>
        </FiltersDiv>
      </Form>
    )
  }
}

const BannerTypeFormEnhanced = withFormik<FormPropsWithOnChange<CustomProps, BannerTypeFormValues>, BannerTypeFormValues>({
  handleSubmit:  () => null, //tslint:disable-line
  mapPropsToValues: () => ({
    slideshow: false
  })
})(withOnChange(BannerTypeForm))

export default BannerTypeFormEnhanced
