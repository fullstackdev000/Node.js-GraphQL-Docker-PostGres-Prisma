import HideForRole from '#veewme/web/common/hideForRole'
import * as React from 'react'
import { AllServicesCards } from '../common'
import { FormValues } from '../orderForm'
import AdminPanel from './adminServicesPanel'
import PackagesPanel from './packagesPanel'
import ServicePanel from './servicePanel'

interface CustomProps {
  values: FormValues
  addOnCategoriesOrder: string[]
  primaryCategoriesOrder: string[]
  addOnCollapsedIds: number[]
  primaryCollapsedIds: number[]
}

type Step1Props = CustomProps & AllServicesCards

const Step1: React.FunctionComponent<Step1Props> = props => (
  <>
    {
      props.packageCards.length > 0 && <PackagesPanel
        packageCards={props.packageCards}
        values={props.values}
      />
    }
    {props.primaryCards && <ServicePanel
      panelHeader='Select Primary Services'
      services={props.primaryCards}
      categoriesOrder={props.primaryCategoriesOrder}
      collapsedIds={props.primaryCollapsedIds}
      serviceType='Primary'
    />}
    {props.addOnCards && <ServicePanel
      panelHeader='Select Add On Services'
      services={props.addOnCards}
      categoriesOrder={props.addOnCategoriesOrder}
      collapsedIds={props.addOnCollapsedIds}
      serviceType='AddOn'
    />}
    <HideForRole action='show' roles={['AFFILIATE']}>
      {props.adminCards && props.adminCards.length > 0 && <AdminPanel
        panelHeader='Select Admin Services'
        services={props.adminCards}
        serviceType='Admin'
      />}
    </HideForRole>
  </>
)

export default Step1
