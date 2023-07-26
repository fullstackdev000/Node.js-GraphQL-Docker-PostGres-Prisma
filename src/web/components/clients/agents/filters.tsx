import Button from '#veewme/web/common/buttons/basicButton'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import CheckboxField from '../../../common/formikFields/checkboxField'
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

const AgentsFilters = styled(Form)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  margin-bottom: 30px;
  flex-wrap: wrap;

  & > * {
    margin-top: 15px;
  }

  button {
    margin-right: 15px;
  }
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  border-right: 1px solid ${props => props.theme.colors.BORDER};
  margin-right: 15px;
  padding: 2px 0;
`

const Input = styled(InputField)`
  margin-right: 15px;
  width: 180px;
`

const SelectRegion = styled(SelectField)`
  width: 180px;
  min-width: 180px;
  margin-right: 10px;
`

const OfficeCheckbox = styled(CheckboxField)`
  margin-right: 10px;
  font-size: 11px;
`

const SelectPerPage = styled(SelectField)`
  display: flex;
  min-width: 190px;
  align-items: center;
  margin-left: auto;
  & > label:first-child {
    width: auto;
    margin: 10px 10px 10px 0;
  }
  & > *:nth-child(2) {
    width: auto;
  }
`

interface FiltersProps {
  regions: Array<Pick<Region, 'id' | 'label'>>
  onSubmit: (val: AgentFiltersValues) => void
}

interface AgentFiltersValues {
  agentsPerPage: string
  affiliateFilter?: string
  brokerageFilter?: string
  officeAdmin: boolean
  region?: number
  searchPhrase?: string
}

type FiltersCustomProps = FiltersProps & FormikProps<AgentFiltersValues>

const Filters: React.FC<FiltersCustomProps> = props => {
  const regionsOptions = React.useMemo(() => props.regions.map(r => ({
    label: r.label,
    value: r.id
  })), [props.regions])

  return (
    <AgentsFilters>
      <FilterGroup>
        <Field
          name={nameof<AgentFiltersValues>('searchPhrase')}
          component={Input}
          placeholder='Search Agent...'
        />
      </FilterGroup>
      <FilterGroup>
        <Field
          name={nameof<AgentFiltersValues>('brokerageFilter')}
          component={Input}
          placeholder='Filter by brokerage...'
        />
        <Field
          component={SelectRegion}
          name={nameof<AgentFiltersValues>('region')}
          options={regionsOptions}
          placeholder='Region...'
        />
      </FilterGroup>
      <FilterGroup>
        <Field
          component={OfficeCheckbox}
          label='Office admin only'
          name={nameof<AgentFiltersValues>('officeAdmin')}
        />
      </FilterGroup>
      <Button
        type='submit'
        full
        buttonTheme='action'
        label='Filter'
      />
      <Button
        label='Reset'
        disabled={!props.dirty}
        onClick={() => {
          props.handleReset()
          props.submitForm()
        }}
      />
      <Field
        component={SelectPerPage}
        label='Agents per page:'
        name={nameof<AgentFiltersValues>('agentsPerPage')}
        compactMode
        options={[
          { label: '20', value: '20' },
          { label: '50', value: '50' },
          { label: '100', value: '100' }
        ]}
      />
    </AgentsFilters>
  )
}

const AgentFilters = withFormik<FiltersProps, AgentFiltersValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    agentsPerPage: '20',
    officeAdmin: false
  })
})(Filters)

type MeData = NoNullableFields<MeQuery>

type AgentFiltersContainerProps = Omit<FiltersProps, 'regions'>

const AgentFiltersContainer: React.FunctionComponent<AgentFiltersContainerProps> = props => {
  const { data } = useQuery<MeData>(Me)
  const regions = data && data.me.account.__typename === 'Affiliate' ? data.me.account.regions : []

  return (
    <AgentFilters
      {...props}
      regions={regions}
    />
  )

}

export default AgentFiltersContainer
