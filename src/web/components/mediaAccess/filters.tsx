import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import InputField from '#veewme/web/common/formikFields/inputField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

import {
  Agent,
  MediaAccessFiltersDataQuery,
  Region
} from '#veewme/gen/graphqlTypes'
import { MediaAccessFiltersData } from '#veewme/lib/graphql/queries'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

const FiltersDiv = styled.div`
  padding: 25px 0 10px 0;
  display: flex;
  flex-wrap: wrap;

  button {
    margin-right: 15px;
  }
`

const FieldWrapper = styled.div<{ shrinked?: boolean }>`
  display: flex;
  flex: 0 0 auto;
  ${props => !props.shrinked && 'min-width: 250px;'}
  margin-right: 25px;
  margin-bottom: 15px;
  border-right: 2px solid  ${props => props.theme.colors.BORDER};
  padding-right: 25px;
  align-items: center;
  height: 32px;


  input {
    flex: 1 0 auto;
  }

  > div {
    width: 100%;
  }
`

const StyledSelectWrapper = styled(FieldWrapper)`
  & > div {
    &:first-child {
      margin-right: 15px;
    }
    min-width: 150px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    flex: 1 0 auto;
  }

`

const RightHolder = styled.div`
  display: flex;
  flex: 0 0 auto;
  height: 32px;

`

export interface FiltersFormValues {
  search: string
  regionId?: number
  clientId?: number
  mediaOnly?: boolean
}

interface RegionOption {
  label: Region['label']
  value: Region['id']
}

interface ClientOption {
  label: string
  value: Agent['id']
}

interface FiltersProps {
  regions: RegionOption[]
  clients: ClientOption[]
  onSubmit: (vals: FiltersFormValues) => void
}

type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

const ClientOptions = [{
  label: 'Client 1',
  value: 'Client 1'
}, {
  label: 'Client 2',
  value: 'Client 2'
}, {
  label: 'Client 3',
  value: 'Client 3'
}]

const FiltersForm: React.FC<FiltersFormProps> = ({
  clients,
  dirty,
  handleReset,
  regions,
  submitForm
}) => {
  return (
    <Form>
      <FiltersDiv>
        <FieldWrapper>
          <Field
            type='text'
            name={nameof<FiltersFormValues>('search')}
            placeholder='Search Address / Order ID...'
            component={InputField}
          />
        </FieldWrapper>
        <StyledSelectWrapper>
          <Field
            name={nameof<FiltersFormValues>('regionId')}
            placeholder='Region'
            component={SelectField}
            options={regions}
          />
          <Field
            name={nameof<FiltersFormValues>('clientId')}
            placeholder='Client'
            component={SelectField}
            options={clients}
          />
        </StyledSelectWrapper>
        <RightHolder>
          <FieldWrapper shrinked>
            <Field
              name={nameof<FiltersFormValues>('mediaOnly')}
              label='Media only'
              component={CheckboxField}
              options={ClientOptions}
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
              submitForm()
            }}
            disabled={!dirty}
          />
        </RightHolder>
      </FiltersDiv>
    </Form>
  )
}

type FormikAllProps = Omit<FiltersProps, 'regions' | 'clients'>

const FiltersFormEnhanced = withFormik<FiltersProps, FiltersFormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    mediaOnly: false,
    search: ''
  })
})(FiltersForm)

type FiltersData = NoNullableFields<MediaAccessFiltersDataQuery>

type FiltersContainerProps = Omit<FormikAllProps, 'regions'>

const FiltersContainer: React.FunctionComponent<FiltersContainerProps> = props => {
  const { data } = useQuery<FiltersData>(MediaAccessFiltersData)
  const regions = data && data.me.account.__typename === 'Affiliate' ? data.me.account.regions : []
  const regionsOptions = React.useMemo(() => regions.map(r => ({
    label: r.label,
    value: r.id
  })), [regions])

  const clients = data && data.agents || []
  const clientsOptions = React.useMemo(() => clients.map(c => ({
    label: `${c.user.firstName} ${c.user.lastName}`,
    value: c.id
  })), [regions])

  return (
    <FiltersFormEnhanced
      {...props}
      regions={regionsOptions}
      clients={clientsOptions}
    />
  )

}

export default FiltersContainer
