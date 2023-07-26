import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import { Switch } from '#veewme/web/common/formikFields/switchField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { FormValues, FrontendServiceFeeAdjustedByRegion, Region } from '../types'

const RegionName = styled.span`
  display: flex;
  font-size: 14px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  font-weight: 500;
`

const Table = styled.table`
  margin-top: 5px;
  table-layout: fixed;
  width: 100%;
`
const Tr = styled.tr`
`
const Th = styled.th`
  width: 180px;
  padding: 15px 0;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-weight: 400;

  &:first-child {
    width: auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    width: 155px;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_SM}) {
    width: 120px;
  }
`

const Td = styled.td`
  padding: 15px 10px 10px 0;
  border-top: 1px solid ${props => props.theme.colors.BORDER};

  &:last-child {
    padding-right: 0;
  }

  input {
    max-width: 100%;
    font-weight: 500;

    &::placeholder {
      opacity: 0.5;
    }

    &[disabled] {
      background: #fff;
      color: ${props => props.theme.colors.LABEL_TEXT};
      cursor: not-allowed;
      font-weight: 400;
      opacity: 0.8;
    }
  }
`

interface RegionsProps {
  isPackage: boolean
  regions: Region[]
}

const Regions: React.FunctionComponent<RegionsProps> = props => {
  const { isPackage } = props

  return (
    <>
      <Panel id='regions' heading='Regions'>
        <FieldArray
          name={nameof<FormValues>('regionFeesAdjusted')}
          render={({ form, name, push, remove, replace, ...arrayHelpers }) => {
            const adjustedFees: FrontendServiceFeeAdjustedByRegion[] = form.values[name]
            const { defaultCompensation, price } = form.values
            const firstNotOverridedRegion = adjustedFees.find(fee => fee.adjustedCompensation === undefined && fee.adjustedPrice === undefined)
            const allSelected = !firstNotOverridedRegion
            const toggleAllRegions = () => {
              form.setFieldValue(name, adjustedFees.map(fee => {
                if (allSelected) {
                  return {
                    id: fee.id,
                    regionId: fee.regionId
                  }
                } else {
                  return {
                    adjustedCompensation: fee.adjustedCompensation || defaultCompensation,
                    adjustedPrice: fee.adjustedPrice || price,
                    id: fee.id,
                    regionId: fee.regionId
                  }
                }
              }))
            }
            return (
              <>
                {allSelected ? (
                  <Button buttonTheme='alert' full label='Unselect All' type='button' onClick={toggleAllRegions} />
                ) : <Button buttonTheme='action' full label='Select All' type='button' onClick={toggleAllRegions} />}
                <Table>
                  <tbody>
                    <Tr>
                      <Th>Region</Th>
                      <Th>Adjusted price</Th>
                      {isPackage || <Th>Adjusted compensation</Th>}
                    </Tr>
                    {adjustedFees.map((fee, i) => {
                      const regionLabelIndex = props.regions.findIndex(({ id }) => id === fee.regionId)
                      const label = props.regions && props.regions[regionLabelIndex] && props.regions[regionLabelIndex].label
                      const feeIsOverrided = fee.adjustedCompensation !== undefined || fee.adjustedPrice !== undefined
                      const feeFieldNamePrefix = `${name}[${i}]`
                      const feeAdjustedPriceName = `${feeFieldNamePrefix}.${nameof<FrontendServiceFeeAdjustedByRegion>('adjustedPrice')}`
                      const feeAdjustedCompensationName = `${feeFieldNamePrefix}.${nameof<FrontendServiceFeeAdjustedByRegion>('adjustedCompensation')}`

                      return (
                        <Tr key={fee.regionId}>
                          <Td>
                            <RegionName>
                            <Switch
                              name={label}
                              label={label}
                              onChange={() => {
                                if (feeIsOverrided) {
                                  replace(i, { regionId: fee.regionId })
                                } else {
                                  replace(i, {
                                    adjustedCompensation: defaultCompensation,
                                    adjustedPrice: price,
                                    regionId: fee.regionId
                                  })
                                }
                              }}
                              value={feeIsOverrided}
                            />
                            </RegionName>
                          </Td>
                          <Td><Field name={feeAdjustedPriceName} disabled={!feeIsOverrided} placeholder='0' component={InputField} type='number' /></Td>
                          {isPackage || <Td><Field name={feeAdjustedCompensationName} disabled={!feeIsOverrided} placeholder='0' component={InputField} type='number' /></Td>}
                        </Tr>
                      )
                    })}
                  </tbody>
                </Table>
              </>
            )
          }}
        />
      </Panel>
    </>
  )
}

export default Regions
