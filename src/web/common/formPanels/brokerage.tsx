import { nameof } from '#veewme/lib/util'
import PhotographerSvg from '#veewme/web/assets/svg/photographer.svg'
import SelectField from '#veewme/web/common/formikFields/selectField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldProps } from 'formik'
import * as React from 'react'
import { AgentValues, BrokerageValues } from './valuesInterfaces'

const BrokerageWrapper = styled.div`
  display: flex;
`

const BrokerLogo = styled.div`
  height: 125px;
  width: 200px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  margin-right: 15px;
  border-radius: 5px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 80%;
    max-height: 80%;
  }
  svg {
    width: 30%;
    fill: ${props => props.theme.colors.LIGHT_BLUISH_GREY};
  }
`

const BrokerageHelpers = styled.div`
  width: calc(100% - 200px - 15px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

interface BrokerageCustomProps {
  brokers: BrokerageValues[]
}

type BrokerageFieldProps = FieldProps & BrokerageCustomProps

const BrokerageField: React.FunctionComponent<BrokerageFieldProps> = ({ field, form, ...props }) => {
  const selectedBroker = props.brokers.find(broker => broker.id === field.value)
  return (
    <BrokerageWrapper>
      <BrokerLogo>
        {selectedBroker && selectedBroker.logoUrl ? <img src={selectedBroker.logoUrl} /> : <PhotographerSvg/>}
      </BrokerLogo>
      <BrokerageHelpers>
        <SelectField
          label='Broker Name / Office Location'
          options={props.brokers.map(option => ({
            label: option.companyName,
            value: option.id
          }))}
          field={field}
          form={form}
        />
      </BrokerageHelpers>
    </BrokerageWrapper>
  )
}

const Brokerage: React.FunctionComponent<BrokerageCustomProps> = props => {
  return (
    <Panel heading='Brokerage' id='brokerage' toggleable>
      <Field
        name={nameof<AgentValues>('brokerageId')}
        component={BrokerageField}
        brokers={props.brokers}
      />
    </Panel>
  )
}

export default Brokerage
