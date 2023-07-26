import { OrderMediaFilter, Photographer, Role } from '#veewme/graphql/types'
import Button from '#veewme/web/common/buttons/basicButton'
import ExpandableFilters, { FirstRow, SecondRow } from '#veewme/web/common/expandableFilters'
import HideForRole from '#veewme/web/common/hideForRole'
import { useRole } from '#veewme/web/common/hooks'
import { getOrderLegendStatus, LegendLabel } from '#veewme/web/common/status'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { nameof } from '../../../../lib/util'
import DateRangeSelectField from '../../../common/formikFields/dateFields/dateRangeSelectField'
import InputField from '../../../common/formikFields/inputField'
import SelectField from '../../../common/formikFields/selectField'
import { StyledFiltersWrapper } from '../filtersBarElements'

import * as log from '#veewme/web/common/log'

import {
  OrdersFiltersDataQuery,
  Region
} from '#veewme/gen/graphqlTypes'
import { OrdersFiltersData } from '#veewme/lib/graphql/queries'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

import QMark from '#veewme/web/assets/svg/qmark.svg'

interface MediaOption {
  label: string
  value: OrderMediaFilter
}

interface MediaOptions {
  label: string
  options: MediaOption[]
}

const MediaOptions: MediaOptions[] = [{
  label: '',
  options: [{
    label: 'All Video',
    value: 'VIDEO_ALL'
  }, {
    label: 'Hosted Video',
    value: 'VIDEO_HOSTED'
  }, {
    label: 'Faux Video',
    value: 'VIDEO_FAUX'
  }]
}, {
  label: '---------------------------',
  options: [{
    label: 'All Interactive',
    value: 'INTERACTIVE_ALL'
  }, {
    label: 'Uploaded Images',
    value: 'INTERACTIVE_FLOOR_PLAN_PHOTOS'
  }, {
    label: 'Embed Code',
    value: 'EMBEDDED'
  }]
}, {
  label: '---------------------------',
  options: [{
    label: 'Panorama',
    value: 'PANORAMA'
  }]
}]

const StyledInputField = styled(InputField) `
  width: 200px;
`

const StyledSelectField = styled(SelectField) `
  min-width: 200px;
  width: 200px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    min-width: 150px;
    width: 150px;
  }
`

const StyledRegionSelectField = styled(StyledSelectField) `
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    min-width: 200px;
    width: 200px;
  }
`

const StyledDateField = styled(DateRangeSelectField) `
  min-width: 205px;
`

const StyledMainGrid = styled.div `
  padding-top: 10px;
`

const StatusFields = styled.div`
  position: relative;
  top: -9px;
  display: flex;
  justify-content: center;
  width: 260px;
  margin: 0 15px 0 10px;
  flex-wrap: wrap;
  padding-top: 11px;
  border-top: 2px solid ${props => props.theme.colors.BORDER};
`

const StatusFieldsTitle = styled.div`
  width: 84px;
  position: absolute;
  top: -7px;
  left: 50%;
  margin-left: -45px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  background: ${props => props.theme.colors.BACKGROUND};
  text-align: center;
  font-size: 11px;
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
  background-color: ${props => getOrderLegendStatus(props.status).color};
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

const QuestionMarkBox = styled.div`
  margin-left: 4px;
`

const TooltipStatusItem = styled.div<{
  status: FilterStatus
}>`
  margin: 6px;
  font-size: 14px;
  color: ${props => getOrderLegendStatus(props.status).color};

  &:first-child {
    margin-top: 15px;
  }

  &:last-child {
    margin-bottom: 15px;
  }
`
const getReadableStatusName = (status: FilterStatus) => status.split(/(?=[A-Z])/).join(' ')

type FilterStatus = Extract<LegendLabel, 'Overdue' | 'Unscheduled' | 'Unpaid' | 'Uncompleted' | 'Unpublished' | 'MediaOnly' | 'Published'>
const filterStatuses: FilterStatus[] = ['Published', 'Unpublished', 'Overdue', 'Unscheduled', 'Uncompleted', 'Unpaid', 'MediaOnly']

type StatusesMap = {
  [status in FilterStatus]: boolean
}

export interface FiltersFormValues extends StatusesMap {
  search?: string
  regionId?: number
  clientId?: number
  photographerId?: Photographer['id']
  processorId?: number
  date?: {
    end?: Date
    start?: Date
  }
  mediaType?: OrderMediaFilter
  interactive?: boolean
  panorama?: boolean
  itemsPerPage?: number
}

interface Option { value: number, label: string}

interface FiltersProps {
  onSubmit: (vals: FiltersFormValues) => void
  agentsOptions: Option[]
  regionsOptions: Option[]
  photographersOptions: Option[]
  processorsOptions: Option[]
  agentId?: number
  photographerId?: number
  processorId?: number
  role?: Role
  defaultValues?: Partial<FiltersFormValues>
}

type StatusesDescription = {
  [status in FilterStatus]: string
}
const StatusesDescriptions: StatusesDescription = {
  MediaOnly: 'Display Media Only orders',
  Overdue: 'Service(s) not completed / appointment date before today',
  Published: 'Property Site published',
  Uncompleted: 'Orders with service(s) not completed',
  Unpaid: 'Orders with an unpaid balance',
  Unpublished: 'Service(s) completed but property site not published',
  Unscheduled: 'Orders where at least one service has no date assigned'
}
type FiltersFormProps = FiltersProps & FormikProps<FiltersFormValues>

const StatusItem: React.FC<FiltersFormProps> = ({
  setFieldValue,
  values
}) => {
  const statusesList = filterStatuses.map(status => (
    <TooltipStatusItem
      key={status}
      status={status}
    >
      <div>{getReadableStatusName(status)} - {StatusesDescriptions[status]}</div>
    </TooltipStatusItem>
  ))
  return (
    <StatusFields>
      <StatusFieldsTitle>
        Order Status
      </StatusFieldsTitle>
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
      <QuestionMarkBox>
        <Tooltipped
          tooltip={statusesList}
          position='bottom'
          disableOpacity={true}
          key={status}
        >
          <div>
            <QMark width='24' height='24' />
          </div>
        </Tooltipped>
      </QuestionMarkBox>
    </StatusFields>
  )
}

const FiltersBar: React.FC<FiltersFormProps> = props => {
  return (
    <Form>
      <StyledFiltersWrapper>
        <StyledMainGrid>
          <ExpandableFilters>
            <FirstRow>
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
              <Field
                name={nameof<FiltersFormValues>('mediaType')}
                placeholder='Media Type'
                component={StyledSelectField}
                isClearable
                options={MediaOptions}
                styles={{
                  menuList: (provided: React.CSSProperties) => ({
                    ...provided,
                    maxHeight: 'none'
                  })
                }}
              />
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
            </FirstRow>
            <SecondRow>
              <HideForRole action='show' roles={['AFFILIATE']}>
                <Field
                  name={nameof<FiltersFormValues>('clientId')}
                  placeholder='Client'
                  component={StyledSelectField}
                  isClearable
                  options={props.agentsOptions}
                />
                <Field
                  name={nameof<FiltersFormValues>('photographerId')}
                  placeholder='Photographer'
                  component={StyledSelectField}
                  isClearable
                  options={props.photographersOptions}
                />
                <Field
                  name={nameof<FiltersFormValues>('processorId')}
                  placeholder='Processor'
                  component={StyledSelectField}
                  isClearable
                  options={props.processorsOptions}
                />
                <Field
                  name={nameof<FiltersFormValues>('regionId')}
                  placeholder='Region'
                  component={StyledRegionSelectField}
                  isClearable
                  options={props.regionsOptions}
                />
                <Field
                  name={nameof<FiltersFormValues>('date')}
                  placeholder='Date'
                  component={StyledDateField}
                />
              </HideForRole>
              <HideForRole action='show' roles={['AGENT', 'PHOTOGRAPHER', 'PROCESSOR']}>
                <Field
                  name={nameof<FiltersFormValues>('date')}
                  placeholder='Date'
                  component={StyledDateField}
                  calendarPosition='right'
                />
              </HideForRole>
            </SecondRow>
          </ExpandableFilters>
        </StyledMainGrid>
      </StyledFiltersWrapper>
    </Form>
  )
}

const initialValuesWithoutStatuses: Omit<FiltersFormValues, FilterStatus> = {
  date: undefined,
  interactive: false,
  itemsPerPage: 20,
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

type RoleStatusesMap = {
  [role in Role]?: Partial<StatusesMap>
}

export const roleDefaultStatuses: RoleStatusesMap = {
  PHOTOGRAPHER: {
    Uncompleted: true
  }
}

const FiltersForm = withFormik<FiltersProps, FiltersFormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    log.debug(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    ...initialValues,
    ...props.defaultValues,
    clientId: props.agentId,
    photographerId: props.photographerId,
    processorId: props.processorId
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
  const agents = data && data.agents || []
  const agentsOptions = React.useMemo(() => agents.map(a => ({
    label: `${a.user.firstName} ${a.user.lastName}`,
    value: a.id
  })), [agents])

  const photographers = data && data.photographers || []
  const photographersOptions = React.useMemo(() => photographers.map(a => ({
    label: `${a.user.firstName} ${a.user.lastName}`,
    value: a.id
  })), [photographers])

  const processors = data && data.processors || []
  const processorsOptions = React.useMemo(() => processors.map(a => ({
    label: `${a.user.firstName} ${a.user.lastName}`,
    value: a.id
  })), [processors])

  let regions: Array<Pick<Region, 'id' | 'label'>> = []
  if (data && data.me.account.__typename === 'Affiliate') {
    regions = data.me.account.regions
  } else if (data && data.me.account.__typename === 'Agent') {
    // TODO: Agent doesn't have access to this data for now. Remove it or give Agent access to it
    regions = data.me.account.affiliate.regions
  }

  const regionsOptions = React.useMemo(() => regions.map(r => ({
    label: r.label,
    value: r.id
  })), [regions])

  return (
    <FiltersForm
      {...props}
      agentsOptions={agentsOptions}
      regionsOptions={regionsOptions}
      photographersOptions={photographersOptions}
      processorsOptions={processorsOptions}
      defaultValues={role && roleDefaultStatuses[role]}
    />
  )

}

export default FiltersContainer
