import { nameof } from '#veewme/lib/util'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import { abstractAdminServiceCategory, getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import { Field } from 'formik'
import * as React from 'react'
import { AddEventFormViewProps, FormValues } from './addEventForm'

const StyledCategoryIcon = styled(props => <props.icon className={props.className}/>) `
  width: 16px;
  height: 15px;
  fill: ${props => rgbaToString(props.color)};
`

const ServiceItem = styled.li<{disabled: boolean}>`
  display: flex;
  opacity: ${props => props.disabled ? '0.4' : '1'};
  align-items: center;
  justify-content: space-between;

  & > div {
    padding: 6px 0;
  }
`

const ServiceList = styled.ul`
`

const ServicesField: React.FC<AddEventFormViewProps> = props => {
  const { values: { services } } = props

  return (
    <>
      {
        services && <ServiceList>
          {
            services.map((service, i) => {
              const disabled = !!service.event && service.event.eventId !== props.eventId
              const category = service.service.category
              const adminService = service.service.serviceType === 'Admin'
              return (
                <ServiceItem
                  key={service.id}
                  disabled={disabled}
                  title={disabled ? 'Event for this service has been already assigned' : ''}
                >
                  <Field
                    name={`${nameof<FormValues>('services')}[${i}].checked`}
                    component={CheckboxField}
                    label={service.service.name}
                    disabled={disabled}
                  />
                  <StyledCategoryIcon
                    icon={getServiceCategoryIcon(adminService ? undefined : category.icon)}
                    color={adminService ? abstractAdminServiceCategory.color : category.color}
                  />
                </ServiceItem>
              )
            })
          }
        </ServiceList>
      }
    </>
  )
}

export default ServicesField
