import { Role } from '#veewme/gen/graphqlTypes'
import * as log from '#veewme/web/common/log'
import { itemShadow } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import moment from 'moment'
import * as React from 'react'
import { formatPhoneNumber } from 'react-phone-number-input/input'
import { ButtonContainer, DropDownWrapper, StyledArrow, StyledIcon } from '../headerDropDown'
import JobsReportForm, { Regions } from './form'
import ReportModal, { Job } from './modal'

import {
  AllPhotographersQuery,
  JobsReportQuery,
  JobsReportQueryVariables,
  MeQuery
} from '#veewme/gen/graphqlTypes'
import { AllPhotographers, JobsReport, Me } from '#veewme/lib/graphql/queries'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useLazyQuery, useQuery } from '@apollo/react-hooks'

import Icon from '#veewme/web/assets/svg/job-sheet.svg'

const Container = styled(ButtonContainer)`
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0 10px 0 10px;
`

const Wrapper = styled(DropDownWrapper)`
  width: 130px;
  justify-content: center;
`
const ContentBox = styled.div`
  position: absolute;
  padding: 10px 15px;
  width: 150%;
  right: -25%;
  min-width: 75%;
  z-index: 100;
  border-radius: 0 0 5px 5px;
  border: 1px solid ${props => props.theme.colors.BUTTON_BORDER};
  background-color: ${props => props.theme.colors.HEADER_BACKGROUND};
  ${itemShadow}
`

const Icons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;

  ${StyledIcon} {
    width: 50px;
    height: 50px;
  }
`
interface JobsReportData {
  events: NoNullableArrayItems<NoNullableFields<JobsReportQuery['events']>>
}

interface JobsReportDropdownProps {
  role: Role
}

const JobsReportDropdown: React.FC<JobsReportDropdownProps> = ({
  role
}) => {
  const [visible, setVisibility] = React.useState(false)
  const [modalVisible, setModalVisibility] = React.useState(false)
  const [searchDate, setSearchDate] = React.useState('')

  React.useEffect(() => {
    setSearchDate('')
  }, [modalVisible])

  const [ loadReport, { data, loading }] = useLazyQuery<JobsReportData, JobsReportQueryVariables>(JobsReport)
  const { data: photographersData } = useQuery<AllPhotographersQuery>(AllPhotographers)
  const { data: meData } = useQuery<MeQuery>(Me)
  const modalTitle = searchDate ? `Jobs Report (${searchDate})` : 'Jobs Report'

  const reportData: Job[] = React.useMemo(() => {
    if (!data) {
      return []
    } else {
      const jobsData: Job[] = []
      data.events.forEach(e => {

        const services: Job[] = e.orderedServices.map<Job>(service => {
          const { order: { id, realEstate } } = service
          return {
            address: realEstate.address,
            agent: realEstate.agentPrimary.user,
            brokerage:  realEstate.agentPrimary.brokerage,
            id: service.id,
            orderId: id,
            phone:  formatPhoneNumber(realEstate.agentPrimary.phone),
            photographer: e.photographer.user,
            serviceName: service.service.name,
            shootDate: moment(e.start).format('MM/DD/YYYY'),
            time: moment(e.start).format('hh:mm a')
          }
        }).flat()

        jobsData.push(...services)
      })
      return jobsData
    }
  }, [data])

  const regions = React.useMemo(() => {
    let regionsData: Regions = []

    if (meData) {
      const account = meData.me.account
      if (account.__typename === 'Affiliate') {
        regionsData = account.regions || []
      }
    }

    return regionsData
  }, [meData])

  return (
    <>
      <Wrapper onMouseLeave={() => setVisibility(false)}>
        <Container onClick={() => setVisibility(prev => !prev)}>
          <Tooltipped
            tooltip='Jobs at a glance'
            delayShow={1500}
          >
            <Icons>
              <StyledIcon icon={Icon}/>
              <StyledArrow/>
            </Icons>
          </Tooltipped>
        </Container>
        {visible &&
          <ContentBox>
            <JobsReportForm
              photographers={photographersData ? photographersData.photographers : []}
              regions={regions}
              onSubmit={vals => {
                log.debug(vals)
                setVisibility(false)
                setModalVisibility(true)
                if (vals.date) {
                  setSearchDate(moment(vals.date).format('DD/MM/yyyy'))
                }
                loadReport({
                  variables: {
                    where: {
                      photographer: {
                        id: vals.photographerId,
                        regionId: {
                          id: vals.regionId
                        }
                      },
                      start_gte: vals.date
                    }
                  }
                })

              }}
              role={role}
            />
          </ContentBox>
        }
      </Wrapper>
      <ReportModal
        isOpen={modalVisible}
        close={() => setModalVisibility(false)}
        title={modalTitle}
        data={reportData}
        loading={loading}
      />
    </>
  )
}

export default JobsReportDropdown
