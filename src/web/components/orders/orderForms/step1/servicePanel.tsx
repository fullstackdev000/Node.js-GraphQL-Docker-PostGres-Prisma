import { Color } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import InnerPanel from '#veewme/web/common/innerPanel/innerPanel'
import Panel from '#veewme/web/common/panel'
import { getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import { StyledListWrapper } from '#veewme/web/components/services/services/servicesList'
import { ServiceTypeCards } from '#veewme/web/components/services/types'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import styled from '../../../../common/styled-components'
import { FormValues } from '../orderForm'
import ServiceCard from './serviceCard'

import {
  ServiceType,
  UpdateCatCollapsedMutationVariables
} from '#veewme/graphql/types'
import { UpdateCatCollapsed } from '#veewme/lib/graphql/queries/service'
import { useMutation } from '@apollo/react-hooks'

export const StyledCardsContainer = styled(StyledListWrapper)`
  margin: 0 auto;
`

export const StyledInnerPanel = styled(InnerPanel) <{ color: Color }> `
  & header {
      svg {fill: ${({ color: { r, g, b, a } }) => `rgba(${r}, ${g}, ${b}, ${a})`}};
  }
`

export const StyledPanel = styled(Panel)`
  & ${StyledInnerPanel} {
    margin: 25px 0;
  }
`

interface ServicePanelProps {
  panelHeader: string
  services: ServiceTypeCards
  categoriesOrder: string[]
  collapsedIds: number[]
  serviceType: ServiceType
}

const ServicePanel: React.FunctionComponent<ServicePanelProps> = props => {
  const [ saveCollapsed ] = useMutation<{}, UpdateCatCollapsedMutationVariables>(UpdateCatCollapsed)

  const usedCategories = Object.keys(props.services)
  const sortedUsedCategories = props.categoriesOrder.filter(cat => usedCategories.find(v => v === cat))
  return (
    <StyledPanel heading={props.panelHeader}>
      {sortedUsedCategories.map(categoryLabel => {
        const services = props.services[categoryLabel]
        const category = services[0].category // TODO fetch categories
        const initiallyCollapsed = category ? props.collapsedIds.includes(category.id) : false

        return (
          <StyledInnerPanel
            key={categoryLabel}
            label={categoryLabel}
            icon={getServiceCategoryIcon(category.icon)}
            itemsTotal={services.length}
            color={category.color}
            toggleable
            collapsed={initiallyCollapsed}
            onToggle={collapsed => saveCollapsed({
              variables: {
                collapsed,
                id: category.id,
                type: props.serviceType
              }
            })}
          >
            <StyledCardsContainer>
              <FieldArray
                name={`${nameof<FormValues>('serviceIds')}`}
                render={({ form, push }) => {
                  return (
                    services.map((card, j) => {
                      return (
                        <Field
                          key={card.id}
                          checked={form.values.serviceIds.includes(card.id)}
                          component={ServiceCard}
                          color={category.color}
                          icon={getServiceCategoryIcon(category.icon)}
                          requireConfirm={!!card.note}
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
          </StyledInnerPanel>
        )
      })}
    </StyledPanel>
  )
}

export default ServicePanel
