import * as Grid from '#veewme/web/common/grid'
import { useComponentDynamicKey } from '#veewme/web/common/hooks'
import * as log from '#veewme/web/common/log'
import * as React from 'react'
import Pagination, { PaginationProps } from '../../../common/footer/pagination'
import { SortButton } from '../../../common/sortButton'
import { StyledMainWrapper } from '../../../common/styled'
import styled from '../../../common/styled-components'
import { StyledHeaderCell, StyledTable } from '../../../common/styledTable'
import Filters, { FiltersFormValues } from './filters'
import ServiceItem from './serviceItem'

import {
  OrderedServicesQuery,
  OrderedServicesQueryVariables,
  Region,
  ServiceFeeAdjustedByRegionWhereInput
} from '#veewme/gen/graphqlTypes'
import { OrderedServices as Services } from '#veewme/lib/graphql/queries'
// import { perPaginationPage } from '#veewme/web/common/consts'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

const StyledTableWrapper = styled.div`
  max-width: 100%;
  margin: 30px -1px;
  border: 1px solid ${props => props.theme.colors.TEXT};
  border-top-width: 0;
  border-radius: 5px;
  overflow: hidden;

  th:nth-last-child(2) {
    width: 110px;
  }

  th:last-child {
    width: 165px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    table th {
      padding: 10px;
    }
  }
`

const Heading = styled(Grid.Heading)`
  border-bottom: 2px solid ${props => props.theme.colors.BORDER};

  [type='submit'] {
    display: none;
  }
`

interface HeaderSortCellProps {
  label: string
  columnName: string
  sortColumn: string
  onSortClick: (columnName: string) => void
  isSortReverse: boolean
}

const HeaderSortCell: React.FunctionComponent<HeaderSortCellProps> = props => {
  const activeColumn = props.columnName === props.sortColumn
  return (
    <StyledHeaderCell
      onClick={() => props.onSortClick(props.columnName)}
      activeSort={activeColumn}
    >
      <span >
        {props.label}
        <SortButton
          active={activeColumn}
          reverse={activeColumn && props.isSortReverse}
        />
      </span>
    </StyledHeaderCell>
  )
}

interface CompensationTableViewProps {
  services: ServicesData['orderedServices']
  categories: ServicesData['serviceCategories']
  photographers: ServicesData['photographers']
  regions: ServicesData['regions']
  onSortClick: (columnName: string) => void
  isSortReverse: boolean
  sortColumn: string
  onFiltersChange: (val: FiltersFormValues) => void
}

const CompensationTableView: React.FunctionComponent<CompensationTableViewProps & PaginationProps> = ({
  services,
  ...props
}) => {
  return (
    <>
      <Filters
        onSubmit={props.onFiltersChange}
        categories={props.categories}
        regionsOptions={props.regions.map(r => ({
          label: r.label,
          value: r.id
        }))}
        photographersOptions={props.photographers.map(p => ({
          label: `${p.user.firstName} ${p.user.lastName}`,
          value: p.id
        }))}
      />
      <StyledTableWrapper>
        <StyledTable>
          <tbody>
            <tr>
              <HeaderSortCell
                columnName='service'
                label='Service/Product name'
                {...props}
              />
              <HeaderSortCell
                columnName='category'
                label='Category'
                {...props}
              />
              <HeaderSortCell
                columnName='serviceType'
                label='Service type'
                {...props}
              />
              <HeaderSortCell
                columnName='region'
                label='Region'
                {...props}
              />
              <HeaderSortCell
                columnName='photographer'
                label='Photographer'
                {...props}
              />
              <StyledHeaderCell>
                Default pay
              </StyledHeaderCell>
              <StyledHeaderCell>
                Photographer pay
              </StyledHeaderCell>
            </tr>
            {services.map(service => (
              <ServiceItem service={service} key={service.id} />
            ))}
          </tbody>
        </StyledTable>
      </StyledTableWrapper>
    </>
  )
}

interface CompensationTableProps {
  data: ServicesData
  onFiltersSubmit: (values: FiltersFormValues) => void
}

const CompensationTable: React.FC<CompensationTableProps> = props => {
  const [reverseSort, setReverseSort] = React.useState(false)
  const [sortColumnName, setSortColumnName] = React.useState('name')

  const handleSort = (columnName: string) => {
    // here will be logic responsible for sending request for sorted data
    log.debug('sort', columnName)
    setReverseSort(prev => columnName === sortColumnName ? !prev : false)
    setSortColumnName(columnName)
  }

  const handlePageChange = (page: number) => {
    log.debug('page changed', page)
  }

  const handleFiltersSubmit = (values: FiltersFormValues) => {
    log.debug('filters change - ', JSON.stringify(values))
    props.onFiltersSubmit(values)
  }

  const paginationProps = {
    maxButtons: 7,
    onPageChange: handlePageChange,
    pageLimit: 10,
    totalRecords: 100
  }

  return (
    <CompensationTableView
      services={props.data.orderedServices}
      onSortClick={(columnName: string) => handleSort(columnName)}
      sortColumn={sortColumnName}
      isSortReverse={reverseSort}
      onFiltersChange={handleFiltersSubmit}
      categories={props.data.serviceCategories}
      photographers={props.data.photographers}
      regions={props.data.regions}
      {...paginationProps}
    />
  )
}

export interface ServicesData {
  orderedServices: NoNullableArrayItems<NoNullableFields<OrderedServicesQuery['orderedServices']>>
  serviceCategories: NoNullableArrayItems<NoNullableFields<OrderedServicesQuery['serviceCategories']>>
  photographers: NoNullableArrayItems<NoNullableFields<OrderedServicesQuery['photographers']>>
  regions: Array<Pick<Region, 'id' | 'label'>>

}

export interface ServiceQueryData {
  orderedServices: ServicesData['orderedServices']
  serviceCategories: ServicesData['serviceCategories']
  photographers: ServicesData['photographers']
  me: {
    account: {
      __typename: OrderedServicesQuery['me']['account']['__typename']
      regions: NoNullableArrayItems<OrderedServicesQuery['me']['account']['regions']>
    }
  }
}

const Container: React.FC = () => {
  const { data: rawData, loading, refetch } = useQuery<ServiceQueryData, OrderedServicesQueryVariables>(Services, {
    notifyOnNetworkStatusChange: true,
    variables: {
      // first: perPaginationPage
    }
  })

  const services = (rawData && rawData.orderedServices) || []
  const photographers = (rawData && rawData.photographers) || []
  const categories = (rawData && rawData.serviceCategories) || []
  // const totalCount = (rawData && rawData.orderedServices.totalCount) || 0
  // const pageCount = Math.ceil(totalCount / perPaginationPage)
  const pageCount = 5 // TODO remove
  const regions = rawData && rawData.me.account.__typename === 'Affiliate' ? rawData.me.account.regions : []

  const data = {
    orderedServices: services,
    photographers,
    regions,
    serviceCategories: categories
  }

  const [paginationKey, setPaginationKey] = useComponentDynamicKey()
  log.debug('Pagination key:', paginationKey)

  const handleFiltersSubmit = (values: FiltersFormValues) => {
    // regionId can't be passed directly, it must be wrapped in object.
    // Otherwise services with no region defined would't be returned if regionId is undefined (user hasn't selected any region in filters)
    // Wrapping regionId in object as below allows for "optional filtering"
    let region: ServiceFeeAdjustedByRegionWhereInput | undefined = {}
    if (values.regionId) {
      region = {
        id: values.regionId
      }
    } else {
      region = undefined
    }

    refetch({
      search: values.serviceName,
      // skip: 0,
      where: {
        event: values.photographerId ? {
          photographer: {
            id: values.photographerId
          }
        } : undefined,
        orderId: {
          realEstateId: {
            agentPrimaryId: {
              region
            }
          }
        },
        serviceId: {
          categoryId: {
            id: values.category
          },
          serviceType: values.type
        }
      }
    }).catch(e => log.debug(e))

    setPaginationKey()
  }

  return (
    <StyledMainWrapper>
      <Heading>
        <h1>Compensation</h1>
      </Heading>
      <DotSpinnerModal isOpen={loading} />
      {data && (
        <>
          <CompensationTable
            data={data}
            onFiltersSubmit={handleFiltersSubmit}
          />
          <Pagination
            key={paginationKey}
            pageCount={pageCount}
            onChange={page => {
              /*
              const skip = page * perPaginationPage
              refetch({
                first: perPaginationPage,
                skip
              }).catch(e => log.debug(e))
              */
            }}
          />
        </>
      )}
    </StyledMainWrapper>
  )
}
export default Container
