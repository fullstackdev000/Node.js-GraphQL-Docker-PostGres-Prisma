import { PackageCard, ServiceCard, ServiceListElement } from '#veewme/web/components/services/types'
import * as React from 'react'
import { CreateOrderFormValues } from '../types'
import { ConvertedAgent } from '../types'
import CostSummaryPanel from './costSummary'
import RealEstateDetailsPanel from './realEstateDetailsPanel'
import SelectedServicesPanel from './selectedServicesPanel'
import ShootInfoPanel from './shootInfo'
import { MiddleRow, StepTitle } from './styled'

interface CustomProps {
  agents: ConvertedAgent[]
  values: CreateOrderFormValues
  discount: number
  validPromoCode: boolean
  onApplyPromoCode: () => void
  onCancelPromoCode: () => void
}

export interface Step3ServiceProps {
  servicePackages: PackageCard[]
  adminServices: ServiceListElement[]
  addOnServices: ServiceCard[]
  primaryServices: ServiceCard[]
}

type Step3Props = CustomProps & Step3ServiceProps

const Step3: React.FunctionComponent<Step3Props> = props => {
  return (
    <>
      <StepTitle>
        <div>Ready to place your order?</div>
        <div>Let's make sure everything's right.</div>
      </StepTitle>
      <SelectedServicesPanel
        adminServices={props.adminServices}
        servicePackages={props.servicePackages}
        addOnServices={props.addOnServices}
        primaryServices={props.primaryServices}
        values={props.values}
      />
      <MiddleRow>
        <RealEstateDetailsPanel
          agents={props.agents}
          values={props.values}
        />
        <ShootInfoPanel
          values={props.values}
        />
      </MiddleRow>
      <CostSummaryPanel
        values={props.values}
        discount={props.discount}
        validPromoCode={props.validPromoCode}
        onApplyPromoCode={props.onApplyPromoCode}
        onCancelPromoCode={props.onCancelPromoCode}
      />
    </>
  )
}

export default Step3
