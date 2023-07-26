import {
  EventQuery,
  EventQueryVariables

} from '#veewme/gen/graphqlTypes'
import {
  Event
} from '#veewme/lib/graphql/queries'

import { DotSpinner } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'

import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import moment from 'moment-timezone'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import Form, { CustomProps } from './addEventForm'
import { PhotographerEventData, Services } from './types'

const ModalContent = styled.div`
`

const StyledTime = styled.time`
  margin: 20px 0;
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.colors.BLUE};

  svg {
    margin-right: 10px;
    color: ${props => props.theme.colors.LABEL_TEXT}
  }
`

export const Spinner = styled(DotSpinner)<{
  isProcessComplete: boolean
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(255, 255, 255, 0.7);
  display: ${props => props.isProcessComplete ? 'none' : 'flex'};

  > div {
    top: -20px;
  }
`

interface EventModalProps {
  onRequestClose: () => void
  isOpen: boolean
  onSubmit: CustomProps['onSubmit']
  date: Date | string
  photographers: CustomProps['photographers']
  allDay: boolean
  title: string
  initialData?: Partial<PhotographerEventData>
  timeZone: string
  services?: Services
  eventId?: number
  photographerNote?: string
}

type EventData = NoNullableFields<EventQuery>

const EventModal: React.FunctionComponent<EventModalProps> = props => {
  const eventDate = props.timeZone === 'local' ? moment(props.date) : moment(props.date).tz(props.timeZone)
  const dateFormat = props.allDay ? 'MM/DD/YYYY' : 'MM/DD/YYYY | hh:mm a'
  const formattedDateStr = eventDate && eventDate.format(dateFormat)
  const history = useHistory()

  const { data, loading: loadingEvents } = useQuery<EventData, EventQueryVariables>(Event, {
    onCompleted: response => {
      // TODO fetch single event instead of events array with single item when API is fixed
      const servicesIds = response.event ? response.event.orderedServices.map(s => s.id).join(',') : ''
      history.push({
        search: servicesIds
      })
    },
    skip: !props.eventId,
    variables: {
      eventId: props.eventId || -1
    }
  })

  const event = data && data.event
  const services = !props.eventId ? props.services : (props.services || (event && event.orderedServices))
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        title={props.title}
        background='LIGHT'
        fullSide
      >
        <Spinner isProcessComplete={!loadingEvents} />
        <ModalContent>
          <StyledTime dateTime={formattedDateStr}>{formattedDateStr}</StyledTime>
          <Form
            onCancel={props.onRequestClose}
            onSubmit={props.onSubmit}
            photographers={props.photographers}
            initialData={props.initialData}
            services={services}
            eventId={props.eventId}
            photographerNote={props.photographerNote}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default EventModal
