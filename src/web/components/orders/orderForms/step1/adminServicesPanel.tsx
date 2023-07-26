import { nameof } from '#veewme/lib/util'
import { abstractAdminServiceCategory, getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import { ServiceListElement } from '#veewme/web/components/services/types'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import styled from '../../../../common/styled-components'
import { FormValues } from '../orderForm'
import ServiceCard from './serviceCard'
import { StyledCardsContainer, StyledPanel } from './servicePanel'

import {
  ServiceType
} from '#veewme/graphql/types'

interface AdminServicePanelProps {
  panelHeader: string
  services: ServiceListElement[]
  serviceType: ServiceType
}

const Wrapper = styled.div`
  display: flex;
`

const AdminServicePanel: React.FunctionComponent<AdminServicePanelProps> = props => {
  return (
    <StyledPanel heading={props.panelHeader}>
      <Wrapper>
        <StyledCardsContainer>
          <FieldArray
            name={`${nameof<FormValues>('serviceIds')}`}
            render={({ form, push }) => {
              return (
                props.services.map((card, j) => {
                  return (
                    <Field
                      key={card.id}
                      checked={form.values.serviceIds.includes(card.id)}
                      component={ServiceCard}
                      color={abstractAdminServiceCategory.color}
                      icon={getServiceCategoryIcon('Admin')}
                      requireConfirm={false} // TODO requireConfirm by props
                      card={card}
                      setValue={() => {
                        form.setFieldTouched(`${nameof<FormValues>('serviceIds')}`)
                        if (form.values.serviceIds.includes(card.id)) {
                          const serviceIds = [ ...form.values.serviceIds ]
                          const serviceIndex = form.values.serviceIds.indexOf(card.id)
                          serviceIds.splice(serviceIndex, 1)
                          form.setFieldValue(`${nameof<FormValues>('serviceIds')}`, serviceIds)
                        } else {
                          push(card.id)
                        }
                      }}
                    />
                  )
                })
              )
            }}
          />
        </StyledCardsContainer>
      </Wrapper>
    </StyledPanel>
  )
}

export default AdminServicePanel
