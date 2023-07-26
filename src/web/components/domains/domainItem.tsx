import Button from '#veewme/web/common/buttons/basicButton'
import DeleteConfirmation from '#veewme/web/common/deleteConfirmation'
import { OptionValue, Select } from '#veewme/web/common/formikFields/selectField'
import { itemShadowHover } from '#veewme/web/common/styled'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import { DomainItemProps } from './'

import { components } from 'react-select'
import { OptionProps } from 'react-select/lib/components/Option'

export const StyledListItem = styled.li `
  display: flex;
  border-radius: 7px;
  padding: 5px 10px;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.BORDER};
  margin: 20px 0;

  ${itemShadowHover}
`

const ItemBody = styled.div`
  display: flex;
  flex: 1 1 auto;
`

export const StyledTitle = styled.h3`
  display: flex;
  flex: 1 1 260px;
  margin-right: 10px;
  font-weight: 500;
  padding: 5px 15px;
  font-size: 13px;
  color: ${props => props.theme.colors.FIELD_TEXT};
  align-items: center;
  width: 215px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    flex-shrink: 0;
  }
`

const SelectCell = styled.div`
  padding: 0 10px;
  display: flex;
  align-items: center;
  min-width: 280px;
  margin: -5px 0 -5px 0;
  padding: 15px;
  border: 1px dashed ${props => props.theme.colors.BORDER};
  border-width: 0 1px;
  background: ${props => props.theme.colors.ACTIONBAR_BACKGROUND};

  span {
    margin: 0 8px 0 0;
    font-weight: 500;
    font-size: 13px;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }

  span + div {
    width: 100%;

    & > div {
      margin-bottom: 0 !important;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    min-width: 230px;

    > span {
      display: none;
    }
  }
`

const ButtonsCell = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  padding: 0 8px;
`

const OptionStyled = styled.div<{
  selected: boolean
}>`
  display: flex;
  align-items: center;

  span:first-child {
    font-weight: 500;
    color: ${props => props.theme.colors.FIELD_TEXT};

    & + span {
      font-size: 11px;
      color: ${props => props.selected ? '#fff' : props.theme.colors.LABEL_TEXT};
    }
  }
`

interface CustomOptionData {
  labelDescription: string
}

interface FilterData {
  data: OptionValue<string, CustomOptionData>
}

const Option = (props: OptionProps<CustomOptionData>) => {
  const { label, customData: { labelDescription } } = props.data

  return (
    <components.Option {...props}>
      <OptionStyled selected={props.isSelected}>
        <span>{label}</span>
        <span>{labelDescription}</span>
      </OptionStyled>
    </components.Option>
  )
}

const DomainItem: React.FunctionComponent<DomainItemProps> = props => {
  const { domain, onDelete, onOrderChange, orders } = props
  return (
    <StyledListItem>
      <ItemBody>
        <StyledTitle>{domain.url}</StyledTitle>
        <SelectCell>
          <span>Order:</span>
          <Select
            components={{
              Option
            }}
            placeholder='Select order'
            options={orders.map(order => {
              const { id, realEstate: { address } } = order
              return {
                customData: {
                  labelDescription: address
                },
                label: String(id),
                value: String(id)
              }
            })}
            onChange={selected => {
              selected && onOrderChange(domain.id, Number(selected.value))
            }}
            filterOption={(option: FilterData, query: string) => {
              const description = option.data.customData ? option.data.customData.labelDescription.toLowerCase() : ''
              const lowerCaseQuery = query.toLowerCase()
              return description.indexOf(lowerCaseQuery) > -1 || option.data.label.indexOf(lowerCaseQuery) > -1
            }}
          />
        </SelectCell>
        <ButtonsCell>
          <Tooltipped
            delayShow={500}
            tooltip={domain.existing ? 'Delete domain' : 'This domain can\'t be deleted'}
          >
            <div>
              <DeleteConfirmation
                onConfirm={() => onDelete(domain.id)}
                message='Are you sure you want to delete this item?'
              >
                {toggleDeleteConfirmation => (
                  <Button
                    size='medium'
                    label='Delete'
                    full
                    disabled={!domain.existing}
                    buttonTheme='alert'
                    onClick={toggleDeleteConfirmation}
                  />
                )}
              </DeleteConfirmation>
            </div>
          </Tooltipped>
        </ButtonsCell>
      </ItemBody>
    </StyledListItem>
  )
}

export default DomainItem
