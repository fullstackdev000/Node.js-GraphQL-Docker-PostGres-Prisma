import Button from '#veewme/web/common/buttons/basicButton'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import CheckboxField from '../../../common/formikFields/checkboxField'
import InputField from '../../../common/formikFields/inputField'
import styled from '../../../common/styled-components'

import {
  MeQuery,
  Region
} from '#veewme/gen/graphqlTypes'
import { Me } from '#veewme/lib/graphql/queries'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

const Wrapper = styled(Form)`
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

const OfficeCheckbox = styled(CheckboxField)`
  margin-right: 10px;
  font-size: 11px;
`

interface FiltersProps {
  regions: Array<Pick<Region, 'id' | 'label'>>
  onSubmit: (val: BrokerFiltersValues) => void
}

interface BrokerFiltersValues {
  search: string
  companyPay: boolean
}

type FiltersCustomProps = FiltersProps & FormikProps<BrokerFiltersValues>

const Filters: React.FC<FiltersCustomProps> = props => {
  return (
    <Wrapper>
      <FilterGroup>
        <Field
          name={nameof<BrokerFiltersValues>('search')}
          component={Input}
          placeholder='Search Brokerage...'
        />
      </FilterGroup>
      <FilterGroup>
        <Field
          component={OfficeCheckbox}
          label='Company pay'
          name={nameof<BrokerFiltersValues>('companyPay')}
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
    </Wrapper>
  )
}

const BrokersFilters = withFormik<FiltersProps, BrokerFiltersValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    companyPay: false,
    search: ''
  })
})(Filters)

type MeData = NoNullableFields<MeQuery>

type BrokersFiltersContainerProps = Omit<FiltersProps, 'regions'>

const BrokersFiltersContainer: React.FunctionComponent<BrokersFiltersContainerProps> = props => {
  const { data } = useQuery<MeData>(Me)
  const regions = data && data.me.account.__typename === 'Affiliate' ? data.me.account.regions : []

  return (
    <BrokersFilters
      {...props}
      regions={regions}
    />
  )

}

export default BrokersFiltersContainer
