import Button from '#veewme/web/common/buttons/basicButton'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import InputField from '../../../common/formikFields/inputField'
import SelectField from '../../../common/formikFields/selectField'
import styled from '../../../common/styled-components'

import {
  MeQuery,
  Region
} from '#veewme/gen/graphqlTypes'
import { Me } from '#veewme/lib/graphql/queries'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

const FiltersDiv = styled.div`
  padding: 25px 0 0 0;
  display: flex;

  button + button {
    margin-left: 20px;
  }
`

const FieldWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  min-width: 250px;
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

export interface FiltersFormValues {
  processorName?: string
  region?: string
}

interface RegionOption {
  label: Region['label']
  value: Region['id']
}

interface FiltersProps {
  regions: RegionOption[]
  onSubmit: (vals: FiltersFormValues) => void
}

type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

type MeData = NoNullableFields<MeQuery>

const FiltersForm: React.FC<FiltersFormProps> = props => {
  const {
    dirty,
    handleReset
  } = props

  return (
    <Form>
      <FiltersDiv>
        <FieldWrapper>
          <Field
            type='text'
            name={nameof<FiltersFormValues>('processorName')}
            placeholder='Search for processor...'
            component={InputField}
          />
        </FieldWrapper>
        <FieldWrapper>
          <Field
            name={nameof<FiltersFormValues>('region')}
            placeholder='Region'
            component={SelectField}
            options={props.regions}
          />
        </FieldWrapper>
        <Button
          type='submit'
          full
          buttonTheme='action'
          label='Filter'
        />
        <Button
          type='submit'
          buttonTheme='action'
          label='Reset'
          onClick={() => {
            handleReset()
            props.submitForm()
          }}
          disabled={!dirty}
        />
      </FiltersDiv>
    </Form>
  )
}

const FiltersFormEnhanced = withFormik<FiltersProps, FiltersFormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    processorName: ''
  })
})(FiltersForm)

type FiltersContainerProps = Omit<FiltersProps, 'regions'>

const FiltersContainer: React.FunctionComponent<FiltersContainerProps> = props => {
  const { data } = useQuery<MeData>(Me, {
    fetchPolicy: 'cache-only'
  })
  const regions = data && data.me.account.__typename === 'Affiliate' ? data.me.account.regions : []
  const regionsOptions = React.useMemo(() => regions.map(r => ({
    label: r.label,
    value: r.id
  })), [regions])

  return (
    <FiltersFormEnhanced
      {...props}
      regions={regionsOptions}
    />
  )

}

export default FiltersContainer
