import { Agent, Brokerage, Photographer } from '#veewme/gen/graphqlTypes'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import styled, { createGlobalStyle } from '#veewme/web/common/styled-components'
import * as React from 'react'

import { MailOutline, Print } from 'styled-icons/material'

export interface Job {
  address: string
  agent: Pick<Agent['user'], 'firstName' | 'lastName'>
  brokerage: Pick<Brokerage, 'companyName'>
  id: number
  photographer: Pick<Photographer['user'], 'firstName' | 'lastName'>
  serviceName: string
  shootDate: string
  orderId: number
  phone: string
  time: string
}

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  min-width: 500px;
`

const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 8px 6px;
    text-align: left;
    border-bottom: 2px solid ${props => props.theme.colors.BORDER};

    &:first-child {
      width: 90px;
    }

    &:nth-child(3) {
      width: 75px;
    }

    &:nth-child(5) {
      width: 220px;
    }

    &:last-child {
      width: 140px;
    }
  }

  th {
    font-weight: 500;
    vertical-align: bottom;
  }

  @media (max-width: 1000px) {
    td,
    th {
      font-size: 12px;

      &:first-child {
        width: 80px;
      }

      &:nth-child(5) {
        width: 100px;
      }

      &:last-child {
        width: auto;
      }
    }
  }
`

const Toolbar = styled.div`
  position: absolute;
  top: -60px;
  right: 0;
  display: flex;

  svg {
    color: ${props => props.theme.colors.TEXT};
  }

  span {
    margin: 0 7px;
    cursor: pointer;
  }
`

export const Spinner = styled(DotSpinner)`
`

const PrintStyle = createGlobalStyle`
  @media print {
    #app {
      display: none !important;
    }

    ${Spinner} {
      display: none;
    }

    body * {
      box-shadow: unset !important;
      border: 0 none !important;
      opacity: 1 !important;
    }

    .ReactModal__Overlay.ReactModal__Overlay--after-open {
      background-color: #fff !important;
    }

    .ReactModal__Content {
      margin-top: 0;

      &:not(:first-child) {
        display: none;
      }

      & > div {
        max-width: unset;
        width: 100%;
      }

      table {
        th, td {
          border: 1px solid #000 !important;
          display: table-cell !important
        }

        th {
          word-break: break-word;
        }
      }

      button, svg {
        display: none;
      }
    }
  }
`

const CellLine = styled.div`

`

const StyledTr = styled.tr<{
  colored: boolean
}>`
  ${props => props.colored && `background: ${props.theme.colors.BACKGROUND}`}
`

interface JobsReportModalProps {
  isOpen: boolean
  close: () => void
  title: string
  data: Job[]
  loading?: boolean
}

const JobsReportModal: React.FunctionComponent<JobsReportModalProps> = props => {
  const orderCounter = React.useRef(0)

  React.useEffect(() => {
    orderCounter.current = 0
  }, [props.isOpen])

  return (
    <Modal isOpen={props.isOpen} onRequestClose={props.close} title={props.title}>
      <ModalContent>
        <Spinner isProcessComplete={!props.loading}/>
        <Toolbar>
          <span onClick={() => log.debug('Email Report')}><MailOutline size='24' /></span>
          {/* Here should be request to generate PDF*/}
          <span onClick={() => window.print()}><Print size='24' /></span>
        </Toolbar>
        {!props.data.length && !props.loading && 'No data found'}
        {
          !props.loading && props.data.length > 0 && (
            <StyledTable>
              <tbody>
                <tr>
                  <th>Shoot Date</th>
                  <th>Photographer</th>
                  <th>Order ID</th>
                  <th>Product / Service</th>
                  <th>Address</th>
                  <th>Agent</th>
                </tr>
                {
                  props.data.map((job, i) => {
                    const prevJob = props.data[i - 1]
                    const jobBelongsToDifferentTour = prevJob ? job.orderId !== prevJob.orderId : false

                    if (jobBelongsToDifferentTour) {
                      orderCounter.current = orderCounter.current + 1
                    }
                    const groupColorIndicator = !(orderCounter.current % 2)
                    const agentName = `${job.agent.firstName} ${job.agent.lastName}`
                    return (
                      <StyledTr key={job.id} colored={groupColorIndicator}>
                        <td>
                          <CellLine>{job.shootDate}</CellLine>
                          <CellLine>{job.time}</CellLine>
                        </td>
                        <td>{job.photographer.firstName + ' ' + job.photographer.lastName}</td>
                        <td>{job.orderId}</td>
                        <td>{job.serviceName}</td>
                        <td>{job.address}</td>
                        <td>
                          <CellLine>{agentName}</CellLine>
                          <CellLine>{job.phone}</CellLine>
                        </td>
                      </StyledTr>
                    )
                  })
                }
              </tbody>
            </StyledTable>
          )
        }
        <PrintStyle />
      </ModalContent>
    </Modal>
  )
}

export default JobsReportModal
