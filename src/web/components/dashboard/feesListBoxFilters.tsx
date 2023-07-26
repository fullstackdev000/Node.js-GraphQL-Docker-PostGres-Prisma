import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

const FiltersDiv = styled.div`
  padding: 0 0 16px 0;
  display: flex;
`

const FieldWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  min-width: 300px;
  margin-right: 25px;
  border-right: 2px solid  ${props => props.theme.colors.BORDER};
  padding-right: 25px;

  input {
    flex: 1 0 auto;
  }

  > div {
    width: 100%;
  }
`

const ResetButton = styled.button`
  padding: 6px 15px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  border-radius: 5px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  background-color: transparent;
  font-weight: 600;
  cursor: pointer;
  transition: border .5s, color .5s;

  &:hover {
    border: 2px solid ${props => props.theme.colors.GREY};
  }
`

export interface FiltersFormValues {
  agentOrTourAddress: string
}

interface FiltersProps {
  onFiltersChange: (val: FiltersFormValues) => void
}

type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

class FiltersForm extends React.Component<FiltersFormProps, {}> {
  componentDidUpdate (prevProps: FiltersFormProps) {
    // componentDidUpdate is recommended by Formik for triggering custom action
    // in response to value changes
    if (prevProps.values !== this.props.values) {
      this.props.onFiltersChange(this.props.values)
    }
  }

  render () {
    const {
      dirty,
      handleReset
    } = this.props

    return (
      <Form>
        <FiltersDiv>
          <FieldWrapper>
            <Field
              type='text'
              name={nameof<FiltersFormValues>('agentOrTourAddress')}
              placeholder='Search for Agent/Tour address...'
              component={InputField}
            />
          </FieldWrapper>
          <ResetButton
            type='button'
            onClick={handleReset}
            disabled={!dirty}
          >
            Reset
          </ResetButton>
        </FiltersDiv>
      </Form>
    )
  }
}

/*
  Prop `handleSubmit` is required by Formik but not needed if form is not submitted in normal way (on submit btn click)
  Prop handleSubmit injected to form component is not the same function as defined in withFormik config
  so this can't be accessed directly inside form.. so actually is not needed in this case
*/
const FiltersFormEnhanced = withFormik<FiltersProps, FiltersFormValues>({
  handleSubmit:  () => null, //tslint:disable-line
  mapPropsToValues: () => ({
    agentOrTourAddress: ''
  })
})(FiltersForm)

export default FiltersFormEnhanced
