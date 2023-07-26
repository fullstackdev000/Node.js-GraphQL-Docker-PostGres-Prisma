import {
  AllPhotographersQuery,
  Photographer,
  Region,
  Role
} from '#veewme/gen/graphqlTypes'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import DateField from '#veewme/web/common/formikFields/dateFields/dateSelectField'
import SelectField from '#veewme/web/common/formikFields/selectField'
// import * as log from '#veewme/web/common/log'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

const StyledForm = styled(Form)`
  padding: 15px 5px;

  button {
    width: 100%;
  }
`

const FieldWrapper = styled.div`
  margin-bottom: 15px;

  &:last-of-type {
    margin-bottom: 25px;
  }
`

const StyledSelect = styled(SelectField)`
  min-width: 100px;
`

export type Regions = Array<Pick<Region, 'id' | 'label'>>
interface CustomProps {
  onSubmit: (values: FormValues) => void
  role: Role
  photographers: AllPhotographersQuery['photographers']
  regions: Regions
}

interface FormValues {
  date?: Date
  regionId?: Region['id']
  photographerId?: Photographer['id']
}

type JobsReportFormViewProps = FormikProps<FormValues> & CustomProps

const JobsReportFormView: React.FunctionComponent<JobsReportFormViewProps> = props => {
  const photographersOptions = React.useMemo(() => props.photographers.map(p => ({
    label: `${p.user.firstName} ${p.user.lastName}`,
    value: p.id
  })), [props.photographers])

  const regionsOptions = React.useMemo(() => props.regions.map(r => ({
    label: r.label,
    value: r.id
  })), [props.regions])

  return (
    <StyledForm>
      <FieldWrapper>
        <Field
          name={`${nameof<FormValues>('date')}`}
          component={DateField}
          compactMode={false}
          placeholder='Date'
        />
      </FieldWrapper>
      {props.role === `AFFILIATE` && (
        <>
          <FieldWrapper>
            <Field
              name={`${nameof<FormValues>('regionId')}`}
              component={StyledSelect}
              compactMode={false}
              placeholder='Region'
              options={regionsOptions}
            />
          </FieldWrapper>
          <FieldWrapper>
            <Field
              name={`${nameof<FormValues>('photographerId')}`}
              component={StyledSelect}
              compactMode={false}
              placeholder='Photographer'
              options={photographersOptions}
            />
          </FieldWrapper>
        </>
      )}
      <Button type='submit' full buttonTheme='action' label='Generate Report' />
    </StyledForm>
  )
}

export const JobsReportForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({})
})(JobsReportFormView)

export default JobsReportForm
