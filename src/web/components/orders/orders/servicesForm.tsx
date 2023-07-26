import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import { getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { OrderedService } from '../types'

const StyledCategoryIcon = styled(props => <props.icon className={props.className}/>) `
  width: 16px;
  height: 15px;
  fill: ${props => rgbaToString(props.category.color)};
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

const CustomScroll = styled(Scrollbars)`
  margin: 15px 0 30px;
`

const Error = styled.p`
  padding-top: 10px;
  color: ${props => props.theme.colors.ALERT};
  font-size: 13px;
`

const ServiceList = styled.ul`
`

export const maxPackageServicesCount = 9

interface CustomProps {
  onSubmit: (values: Array<OrderedService['id']>) => void
  services: OrderedService[]
}

interface SelectableService extends OrderedService {
  checked: boolean
}

interface FormValues {
  services: SelectableService[]
}

type ServicesFormViewProps = FormikProps<FormValues> & CustomProps

class ServicesFormView extends React.Component<ServicesFormViewProps, {}> {
  render () {
    const { values: { services }, submitForm } = this.props
    const servicesWithoutEvents = services.filter(s => !s.event)
    const servicesSelected = servicesWithoutEvents.some(service => service.checked)

    return (
      <Form>
        <CustomScroll autoHeight={true} autoHeightMax={200}>
          <ServiceList>
            {
              services.map((service, i) => {
                const disabled = !!service.event
                const category = service.service.category
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
                      icon={getServiceCategoryIcon(category.icon)}
                      category={category}
                    />
                  </ServiceItem>
                )
              })
            }
          </ServiceList>
        </CustomScroll>
        <Button full buttonTheme='action' type='button' label='Schedule' onClick={submitForm} disabled={!servicesSelected}/>
        {servicesWithoutEvents.length > 0 && !servicesSelected && <Error>Please select at least one service.</Error>}
        {!servicesWithoutEvents.length && <Error>Events has been already assigned to all services.</Error>}
      </Form>
    )
  }
}

const ServicesForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { props }) => {
    const services = values.services.filter(service => service.checked).map(service => service.id)
    props.onSubmit(services)
  },
  mapPropsToValues: props => ({
    services: props.services.map(service => ({
      ...service,
      checked: !service.event
    }))
  })
})(ServicesFormView)

export default ServicesForm
