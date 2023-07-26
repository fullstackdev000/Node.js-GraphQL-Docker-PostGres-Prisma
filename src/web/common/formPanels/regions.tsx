import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { Clear } from 'styled-icons/material'
import { EditAffiliateValues, Region } from '../../components/affiliates/editAffiliate/types'

const StyledFieldWrapper = styled.div `
  display: flex;
  margin: 4px 0;
  align-items: flex-end;

  &:first-child {
    button {
      display: none;
    }
  }

  & > :first-child {
    margin-right: 8px;
    flex: 1;
  }

  & > :last-child {
    margin-bottom: 15px;
  }
`

const ButtonWrapper = styled.div `
  margin-top: 16px;
`
const TooltipText = `Regions can be almost anything you need to track/manage your business.
i.e. Time-zones, country regions, counties, zip-codes, photographers, etc
`
interface AffiliateRegionsProps {
  regions: Region[]
}

const AffiliateRegions: React.FunctionComponent<AffiliateRegionsProps> = ({
  regions
}) => {
  return (
    <Panel
      heading='Regions'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text={TooltipText}
        />
      }
    >
      <FieldArray
        name={`${nameof<EditAffiliateValues>('regions')}`}
        render={({
          push,
          remove
        }) => {
          return (
            <>
              {/*
                generally array indices shouldn't be used as keys but in this case it shouldn't cause problems
              */}
              {regions.map((region, i) => (
                <StyledFieldWrapper
                  key={i}
                >
                  <Field
                    name={`${nameof<EditAffiliateValues>('regions')}[${i}].label`}
                    label={i === 0 ? 'Default Region:' : `Region ${i + 1}`}
                    component={InputField}
                  />
                  <Button
                    buttonTheme='alert'
                    inverseTextColor
                    icon={Clear}
                    onClick={() => {
                      remove(i)
                    }}
                  />
                </StyledFieldWrapper>
              ))}
              <ButtonWrapper>
                <Button
                  type='button'
                  buttonTheme='action'
                  label='Add another region'
                  onClick={() => push({
                    label: ''
                  })}
                />
              </ButtonWrapper>
            </>
          )
        }}
      />
    </Panel>
  )
}

export default AffiliateRegions
