import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import CheckboxField from '#veewme/web/common/formikFields/checkboxField'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { CounterTextDiv } from '../../common/styled'
import { FetchedService } from '../types'

const ServiceItem = styled.li<{disabled: boolean}>`
  opacity: ${props => props.disabled ? '0.4' : '1'};

  & > div {
    padding: 6px 0;
  }
`

const CustomScroll = styled(Scrollbars)`
  margin: 15px 0 30px;
`

const ServiceList = styled.ul`
`

export const maxPackageServicesCount = 9

interface CustomProps {
  onSubmit: (values: Array<FetchedService['id']>) => void
  services: FetchedService[]
  serviceIds: Array<FetchedService['id']>
}

interface SelectableService extends FetchedService {
  checked: boolean
}

interface FormValues {
  services: SelectableService[]
}

type PackageServicesFormViewProps = FormikProps<FormValues> & CustomProps

class PackageServicesFormView extends React.Component<PackageServicesFormViewProps, {}> {
  render () {
    const { values: { services }, submitForm } = this.props
    const selectedServicesCount = services.filter(service => service.checked).length

    return (
      <Form>
        <CounterTextDiv>
          {`${selectedServicesCount} selected out of ${maxPackageServicesCount}`}
        </CounterTextDiv>
        <CustomScroll autoHeight={true} autoHeightMax={200}>
          <ServiceList>
            {
              services.map((service, i) => {
                const disabled = selectedServicesCount >= maxPackageServicesCount && !service.checked
                return (
                  <ServiceItem
                    key={service.id}
                    disabled={disabled}
                    title={disabled ? 'Package includes max number of services' : ''}
                  >
                    <Field
                      name={`${nameof<FormValues>('services')}[${i}].checked`}
                      component={CheckboxField}
                      label={service.name}
                      disabled={disabled}
                    />
                  </ServiceItem>
                )
              })
            }
          </ServiceList>
        </CustomScroll>
        <Button full buttonTheme='action' type='button' label='Add Services' onClick={submitForm} />
      </Form>
    )
  }
}

const PackageServicesForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { props }) => {
    const services = values.services.filter(service => service.checked).map(service => service.id)
    props.onSubmit(services)
  },
  mapPropsToValues: props => ({
    // 'check' services that are already included in package
    services: props.services.map(service => ({
      ...service,
      checked: !!(props.serviceIds || []).includes(service.id)
    }))
  })
})(PackageServicesFormView)

export default PackageServicesForm
