import { nameof } from '#veewme/lib/util'
import Input from '#veewme/web/common/formikFields/inputField'
import Radio from '#veewme/web/common/formikFields/radioInputField'
import Switch from '#veewme/web/common/formikFields/switchField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { FeesValues } from './valuesInterfaces'

const FeePanel = styled.div`
  color: ${props => props.theme.colors.LABEL_TEXT};
  padding: 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding-top: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
  padding-bottom: 22px;
  &:first-child {
    padding-top: 0;
  }
  &:last-child, &:nth-last-child(2) {
    border-bottom: none;
    padding-bottom: 0;
  }
  h2 {
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    display: flex;
  }
`

const StyledRadioHolder = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: -10px;
`

const Tooltip = styled(InlineHelp)`
  margin-left: 10px;
`

interface FeesSettingsProps {
  showMoreOptions?: boolean
}

const FeesSettings: React.FunctionComponent<FeesSettingsProps> = props => {
  return (
    <Panel heading='Collect Payment'>
      <StyledRadioHolder>
        <Field
          name={nameof<FeesValues>('collectPayment')}
          labelPosition='top'
          value='ORDER'
          component={Radio}
          label='On Order'
        />
        <Field
          name={nameof<FeesValues>('collectPayment')}
          labelPosition='top'
          value='DELIVERY'
          component={Radio}
          label='On Delivery'
        />
      </StyledRadioHolder>
      {props.showMoreOptions && <FeePanel>
        <h2>
          Company Pay
          <Tooltip text='Select if you wish to collect payment through a billing cycle versus on checkout.' />
        </h2>
        <Field
          component={Switch}
          name={nameof<FeesValues>('companyPay')}
        />
      </FeePanel>}
      <FeePanel>
        <h2>
          Special Pricing
          <Tooltip text='Select if you wish to offer special pricing to Broker. Pricing will be set in Services.' />
        </h2>
        <Field
          component={Switch}
          name={nameof<FeesValues>('specialPricing')}
        />
      </FeePanel>
      {props.showMoreOptions && <FeePanel>
        <h2>
          Broker Subsidy
          <Tooltip
            text='Select if Broker subsisizes services. Applies to Primary Services and Packages only. Amout will be reduced at checkout.'
          />
        </h2>
        <Field
          component={Switch}
          name={nameof<FeesValues>('brokerSubsidy')}
        />
      </FeePanel>}
      {props.showMoreOptions && <Field
        component={Input}
        name={nameof<FeesValues>('discount')}
        label='Discount:'
      />}
    </Panel>
  )
}

export default FeesSettings
