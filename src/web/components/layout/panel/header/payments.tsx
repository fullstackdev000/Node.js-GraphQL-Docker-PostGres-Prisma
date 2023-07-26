// import * as log from '#veewme/web/common/log'
import { privateUrls } from '#veewme/lib/urls'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import { Link } from 'react-router-dom'

import {
  AgentOrdersToFinalizeQuery,
  AgentOrdersToFinalizeQueryVariables
} from '#veewme/gen/graphqlTypes'
import { AgentOrdersToFinalize } from '#veewme/lib/graphql/queries'
import { useQuery } from '@apollo/react-hooks'

import { Dollar } from 'styled-icons/boxicons-regular'

const Wrapper = styled.div`
  position: relative;
  padding: 2px 15px 0 15px;
  display: flex;
  max-width: 138px;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  background-color: ${props => props.theme.colors.HEADER_BACKGROUND};
  border-left: 1px solid ${props => props.theme.colors.BORDER};
  flex: 1 0 auto;

  svg {
    color: ${props => props.theme.colors.ALERT};
    animation: flash 1s infinite alternate;
  }

  @keyframes flash {
    0% {
      opacity: 0.7;
    }

    100% {
     opacity: 1
    }
  }
`

interface PaymentsProps {
  agentId: number
}

const Payments: React.FC<PaymentsProps> = props => {
  const { data } = useQuery<AgentOrdersToFinalizeQuery, AgentOrdersToFinalizeQueryVariables>(AgentOrdersToFinalize, {
    variables: {
      where: {
        payments_some: {
          agentSecondary: {
            id: props.agentId
          },
          status: 'UNPAID'
        }
      }
    }
  })
  const paymentsToFinalize = data && data.orders.length > 0

  if (!paymentsToFinalize) {
    return null
  }

  return (
    <Wrapper>
        <Link to={privateUrls.orders}>
          <Tooltipped tooltip='There are waiting payments.' position='bottom' delayShow={500}>
            <Dollar size={32} />
          </Tooltipped>
        </Link>
    </Wrapper>
  )
}

export default Payments
