import { OrderMediaFilter, Role } from '#veewme/graphql/types'
import Button from '#veewme/web/common/buttons/basicButton'
import { themeColors } from '#veewme/web/common/colors'
import HideForRole from '#veewme/web/common/hideForRole'
import { useRole } from '#veewme/web/common/hooks'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import DateRangeSelectField from '../../../common/formikFields/dateFields/dateRangeSelectField'
import InputField from '../../../common/formikFields/inputField'

import * as log from '#veewme/web/common/log'

import {
  OrdersFiltersDataQuery
} from '#veewme/gen/graphqlTypes'
import { OrdersFiltersData } from '#veewme/lib/graphql/queries'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

type StatusColor = {
  [Status in FilterStatus]: string;
}

export const statusColor: StatusColor = {
  Completed: themeColors.GREEN,
  Pending: themeColors.GREY
}

export const StyledFiltersWrapper = styled.div `
  padding: 8px 0;
  width: 100%;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin-top: 10px;
  }
`

const StyledInputField = styled(InputField) `
  width: 200px;
`

const StyledMainGrid = styled.div `
  padding-top: 10px;
`

const StatusFields = styled.div`
  position: relative;
  top: -9px;
  display: flex;
  justify-content: center;
  width: 60px;
  margin: 0 15px 0 10px;
  flex-wrap: wrap;
  padding-top: 11px;
`

const StatusItemStyled = styled.span<{
  checked?: boolean
  status: FilterStatus
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border-radius: 3px;
  background-color: ${props => statusColor[props.status]};
  cursor: pointer;
  transition: box-shadow .5s, opacity .5s;

  &:hover {
    opacity: 0.9;
  }

  &:last-of-type {
    margin-right: 0;
  }

  ${props => props.checked && `
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.55);

    &:after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border: 2px solid #fff;
      border-radius: 100%;
    }
  `}
`

const StyledDateField = styled(DateRangeSelectField) `
  min-width: 205px;
`

const StyledRow = styled.div`
  display: flex;

  & > * {
    margin-right: 10px;
  }
`

const getReadableStatusName = (status: FilterStatus) => status.split(/(?=[A-Z])/).join(' ')

export type FilterStatus = 'Pending' | 'Completed'
const filterStatuses: FilterStatus[] = ['Pending','Completed']

type StatusesMap = {
  [status in FilterStatus]: boolean
}

export interface FiltersFormValues extends StatusesMap {
  search?: string
  date?: {
    end?: Date
    start?: Date
  }
  mediaType?: OrderMediaFilter
}

interface FiltersProps {
  onSubmit: (vals: FiltersFormValues) => void
  role?: Role
  defaultValues?: Partial<FiltersFormValues>
}

type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

const StatusItem: React.FC<FiltersFormProps> = ({
  setFieldValue,
  values
}) => {
  return (
    <StatusFields>
      {
        filterStatuses.map((status, i) => {
          const readableStatusName = getReadableStatusName(status)
          return (
            <Tooltipped
              tooltip={readableStatusName}
              position='top'
              key={status}
            >
              <StatusItemStyled
                status={status}
                checked={values[status]}
                onClick={() => {
                  const checked = !values[status]
                  const fieldName = nameof<FiltersFormValues>(status)
                  setFieldValue(fieldName, checked)
                }}
              />
            </Tooltipped>
          )
        })
      }
    </StatusFields>
  )
}

const FiltersBar: React.FC<FiltersFormProps> = props => {
  return (
    <Form>
      <StyledFiltersWrapper>
        <StyledMainGrid>
          <div>
            <StyledRow>
              <Field
                type='text'
                name={nameof<FiltersFormValues>('search')}
                placeholder='Search Address/OrderID...'
                component={StyledInputField}
              />
              <Button
                type='submit'
                full
                buttonTheme='action'
                label='Filter'
              />
              <StatusItem {...props}/>
            <Button
              type='submit'
              buttonTheme='action'
              label='Reset'
              onClick={() => {
                props.handleReset()
                props.submitForm()
              }}
              disabled={!props.dirty}
            />
            </StyledRow>
            <StyledRow>
              <HideForRole action='show' roles={['AGENT', 'PHOTOGRAPHER', 'PROCESSOR']}>
                <Field
                  name={nameof<FiltersFormValues>('date')}
                  placeholder='Date'
                  component={StyledDateField}
                  calendarPosition='right'
                />
              </HideForRole>
            </StyledRow>
          </div>
        </StyledMainGrid>
      </StyledFiltersWrapper>
    </Form>
  )
}

const initialValuesWithoutStatuses: Omit<FiltersFormValues, FilterStatus> = {
  date: undefined,
  search: ''
}

const accInit = {}
const initialValuesStatuses: StatusesMap = filterStatuses.reduce<StatusesMap>((acc, current) => {
  acc[current] = false
  return acc
}, accInit as StatusesMap) // TODO try to find another way to type object which specific fields will be added dynamically

const initialValues: FiltersFormValues = {
  ...initialValuesWithoutStatuses,
  ...initialValuesStatuses
}

const FiltersForm = withFormik<FiltersProps, FiltersFormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    log.debug(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...initialValues,
    ...props.defaultValues
  })
})(FiltersBar)

type FiltersData = NoNullableFields<OrdersFiltersDataQuery>
type FiltersContainerProps = Omit<FiltersProps, 'agentsOptions' | 'regionsOptions' | 'photographersOptions' | 'processorsOptions'>

const FiltersContainer: React.FunctionComponent<FiltersContainerProps> = props => {
  const role = useRole()
  const { data } = useQuery<FiltersData>(OrdersFiltersData, {
    skip: role !== 'AFFILIATE'
  })
  log.debug(data)

  return (
    <FiltersForm
      {...props}
    />
  )

}

export default FiltersContainer
