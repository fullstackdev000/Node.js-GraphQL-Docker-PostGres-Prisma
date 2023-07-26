import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import Textarea from '#veewme/web/common/formikFields/textareaField'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { TextInlineFieldsFull } from '../../common/styled'
import { FormValues, ServiceFormOptions } from '../types'

const StyledEditor = styled(Editor)`
  margin-top: 20px;
`

// TODO: validate name length also on backend
export const serviceNameMaxLength = 50
export const serviceTitleMaxLength = 65
export const packageTitleMaxLength = 60
export const shortDescriptionMaxLength = 150

interface DetailsProps {
  formOptions: ServiceFormOptions
  isPackage: boolean
  isAdmin: boolean
}

const Details: React.FunctionComponent<DetailsProps> = props => {
  const { isAdmin, isPackage, formOptions } = props

  return (
    <>
      <TextInlineFieldsFull>
        {!isPackage && !isAdmin && <Field
          name={`${nameof<FormValues>('categoryId')}`}
          isDisabled={isPackage}
          component={SelectField}
          options={formOptions.serviceCategories.map(({ label, id }) => ({ label, value: id })) || []}
          label='Category'
          placeholder={isPackage ? 'Category' : undefined}
        />}

        <Field name={nameof<FormValues>('name')} component={InputField} label='Headline' maxLength={serviceNameMaxLength} />
      </TextInlineFieldsFull>
      <Field
        name={nameof<FormValues>('title')}
        component={InputField}
        label='Title'
        maxLength={isPackage ? packageTitleMaxLength : serviceTitleMaxLength}
      />
      {!isPackage && <Field
        name={nameof<FormValues>('shortDescription')}
        label='Front description'
        component={Textarea}
        maxLength={shortDescriptionMaxLength}
      />}
      {!isPackage && <Field
        name={nameof<FormValues>('longDescription')}
        label='Back description'
        component={StyledEditor}
      />}
    </>
  )
}

export default Details
