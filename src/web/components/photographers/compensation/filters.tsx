import { Photographer, ServiceType } from '#veewme/graphql/types'
import { FilterServiceTypes } from '#veewme/web/common/consts'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import { FieldWrapper, FiltersWrapper } from '../../../common/filters'
import InputField from '../../../common/formikFields/inputField'
import SelectField from '../../../common/formikFields/selectField'
import styled from '../../../common/styled-components'

import Button from '#veewme/web/common/buttons/basicButton'

const FieldHolder = styled(FieldWrapper)`
  margin-right: 15px;
  padding-right: 15px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
    margin-bottom: 20px;
    width: calc(33% - 25px);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: calc(50% - 25px);

    &:nth-child(2n) {
      padding-right: 0;
      margin-right: 0;
      border-right: 0 none;
    }
  }
`

const ButtonsHolder = styled.div`
  button {
    margin-right: 15px;
  }
`

interface Category {
  id: number
  label: string
}

export interface FiltersFormValues {
  serviceName: string
  regionId?: number
  photographerId?: Photographer['id']
  priceGroupId?: string
  category?: number
  type?: ServiceType
}

interface FiltersProps {
  onSubmit: (val: FiltersFormValues) => void
  categories: Category[]
  regionsOptions: Array<{
    value: number
    label: string
  }>
  photographersOptions: Array<{
    value: number
    label: string
  }>
}

type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

const FiltersFormView: React.FunctionComponent<FiltersFormProps> = ({
  categories,
  dirty,
  handleReset,
  onSubmit,
  photographersOptions,
  regionsOptions,
  submitForm,
  values
}) => {
  return (
    <Form>
      <FiltersWrapper>
        <FieldHolder>
          <Field
            type='text'
            name={nameof<FiltersFormValues>('serviceName')}
            placeholder='Search for service...'
            component={InputField}
          />
        </FieldHolder>
        <FieldHolder>
          <Field
            name={nameof<FiltersFormValues>('regionId')}
            placeholder='Region'
            component={SelectField}
            options={regionsOptions}
          />
        </FieldHolder>
        <FieldHolder>
          <Field
            name={nameof<FiltersFormValues>('photographerId')}
            placeholder='Photographer'
            component={SelectField}
            options={photographersOptions}
          />
        </FieldHolder>
        <FieldHolder>
          <Field
            name={nameof<FiltersFormValues>('category')}
            placeholder='Category'
            component={SelectField}
            options={categories.map(c => ({
              label: c.label,
              value: c.id
            }))}
          />
        </FieldHolder>
        <FieldHolder>
          <Field
            name={nameof<FiltersFormValues>('type')}
            placeholder='Type'
            component={SelectField}
            options={FilterServiceTypes}
          />
        </FieldHolder>

        <ButtonsHolder>
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
              submitForm()
            }}
            disabled={!dirty}
          />
        </ButtonsHolder>
      </FiltersWrapper>
    </Form>
  )
}

const FiltersForm = withFormik<FiltersProps, FiltersFormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    serviceName: ''
  })
})(FiltersFormView)

export default FiltersForm
