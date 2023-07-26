import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import SelectField from '#veewme/web/common/formikFields/selectField'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'

import * as React from 'react'

import {
  MeQuery,
  Region
} from '#veewme/gen/graphqlTypes'
import { MediaAccessFiltersData } from '#veewme/lib/graphql/queries'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

const StyledFiltersWrapper = styled.div `
  padding: 15px 0 0 0;
  display: flex;
  flex-direction: column;
  & > p {
    color: ${props => props.theme.colors.LABEL_TEXT};
    margin-bottom: 4px;
  }

  button {
    margin-right: 15px;
  }
`

const StyledFieldsBar = styled.div `
  flex: 1;
  display: flex;
`

const StyledFieldWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  width: 200px;
  margin-right: 15px;
  padding-right: 25px;
  input {
    flex: 1 0 auto;
  }
  > div {
    width: 100%;
  }
`

const StyledButtonWrapper = styled.div `
  border-left: 2px solid  ${props => props.theme.colors.BORDER};
  padding-left: 15px;
`

export interface FiltersFormValues {
  client?: string
  region?: number
  category?: number
  type?: string
}

interface Category {
  id: number
  label: string
}

interface FiltersProps {
  categories: Category[]
  onSubmit: (values: FiltersFormValues) => void
  regions: Array<{
    label: Region['label']
    value: Region['id']
  }>
}

type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

class FiltersForm extends React.Component<FiltersFormProps, {}> {
  render () {
    const {
      categories,
      dirty,
      handleReset,
      regions,
      submitForm
    } = this.props

    return (
      <Form>
        <StyledFiltersWrapper>
          <StyledFieldsBar>
            <StyledFieldWrapper>
              <Field
                name={nameof<FiltersFormValues>('region')}
                placeholder='Region'
                component={SelectField}
                options={regions}
              />
            </StyledFieldWrapper>
            <StyledFieldWrapper>
              <Field
                name={nameof<FiltersFormValues>('category')}
                placeholder='Category'
                component={SelectField}
                options={categories.map(c => ({
                  label: c.label,
                  value: c.id
                }))}
              />
            </StyledFieldWrapper>
            <StyledButtonWrapper>
            <Button
              type='submit'
              full
              buttonTheme='action'
              label='Filter'
            />
            <Button
              label='Reset'
              disabled={!dirty}
              onClick={() => {
                handleReset()
                submitForm()
              }}
            />
            </StyledButtonWrapper>
          </StyledFieldsBar>
        </StyledFiltersWrapper>
      </Form>
    )
  }
}

type FormikAllProps = Omit<FiltersProps, 'regions' | 'clients'>

const FiltersFormEnhanced = withFormik<FiltersProps, FiltersFormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
  })
})(FiltersForm)

type FiltersData = NoNullableFields<MeQuery>

type FiltersContainerProps = Omit<FormikAllProps, 'regions'>

const FiltersContainer: React.FunctionComponent<FiltersContainerProps> = props => {
  const { data } = useQuery<FiltersData>(MediaAccessFiltersData)
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
