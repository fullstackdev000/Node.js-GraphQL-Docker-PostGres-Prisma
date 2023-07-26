import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { Close } from 'styled-icons/material'

const StyledChipsList = styled.ul `
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`

const StyledChip = styled.li `
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  border: 1px solid ${props => props.theme.colors.BORDER};
  border-radius: 5px;
  font-size: 12px;
  color: black;
  margin: 4px;
  padding: 4px;
`

const StyledChipTextLabel = styled.p `
  display: block;
  margin: 4px;
`

const StyledChipDeleteButton = styled.button `
  margin-left:8px;
  padding: 0 4px;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
`

const StyledDeleteIcon = styled(Close) `
  width: 16px;
  height: 16px;
  fill: ${props => props.theme.colors.ALERT};
`

export interface Chip {
  id: number
  label: number | string | JSX.Element
}

interface ChipsProps {
  chips: Chip[]
  onChipDelete?: (ChipId: Chip['id']) => void
}

const Chips: React.FunctionComponent<ChipsProps> = props => (
  <StyledChipsList>
    {props.chips.map(chip => (
      <StyledChip key={chip.id}>
        {typeof chip.label === 'string'
          ?
          <StyledChipTextLabel>{chip.label}</StyledChipTextLabel>
          :
          chip.label
        }
        {props.onChipDelete &&
          <StyledChipDeleteButton
            type='button'
            onClick={() => props.onChipDelete && props.onChipDelete(chip.id)}
          >
            <StyledDeleteIcon/>
          </StyledChipDeleteButton>
        }
      </StyledChip>
    ))}
  </StyledChipsList>
)

export default Chips
