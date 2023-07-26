import Panel from '#veewme/web/common/panel'
import * as React from 'react'
import styled from '../../../../common/styled-components'
import { CreateOrderFormValues } from '../types'
import SelectedPackage from './selectedPackage'
import SelectedService from './selectedService'
import { Step3ServiceProps } from './step3'

const StyledServicesWrapper = styled.div `
  display: flex;
  flex-direction: column;
  align-items: stretch;
  & > :not(:first-child) {
    padding: 30px 0;
    border-top: 2px solid ${props => props.theme.colors.BORDER}
  }
  & > :first-child {
    padding-bottom: 30px;
  }
`

interface CustomProps {
  values: CreateOrderFormValues
}

type SelectedServicesPanelProps = CustomProps & Step3ServiceProps

const SelectedServicesPanel: React.FunctionComponent<SelectedServicesPanelProps> = props => {
  const packageService = props.servicePackages.find(card => card.id === props.values.servicePackageId)
  const primaryServices = props.primaryServices.filter(card => (props.values.serviceIds.indexOf(card.id) > -1) && card)
  const addOnServices = props.addOnServices.filter(card => (props.values.serviceIds.indexOf(card.id) > -1) && card)
  const adminServices = props.adminServices.filter(card => (props.values.serviceIds.indexOf(card.id) > -1) && card)

  return (
    <Panel heading='Selected Service(s)'>
      <StyledServicesWrapper>
        {packageService &&
          <SelectedPackage card={packageService}/>
        }
        {primaryServices.length > 0 &&
          primaryServices.map((card, key) => (
            <SelectedService key={key} card={card} serviceType='Primary'/>
          ))
        }
        {addOnServices.length > 0 &&
          addOnServices.map((card, key) => (
            <SelectedService key={key} card={card} serviceType='Add On'/>
          ))
        }
        {adminServices.length > 0 &&
          adminServices.map((card, key) => (
            <SelectedService key={key} card={card} serviceType='Admin'/>
          ))
        }
      </StyledServicesWrapper>
    </Panel>
  )
}

export default SelectedServicesPanel
