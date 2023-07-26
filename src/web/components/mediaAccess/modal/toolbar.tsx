import Button from '#veewme/web/common/buttons/basicButton'
import DropdownButton from '#veewme/web/common/buttons/dropDownButton'
import { DropDownListGroups } from '#veewme/web/common/dropDownList'
import styled from '#veewme/web/common/styled-components'
import Tooltipped from '#veewme/web/common/tooltipped'
import * as React from 'react'
import { PhotoBasic } from '../types'

import { MailOutline } from 'styled-icons/material'

const ToolbarWrapper = styled.div`
  padding: 0 0 20px 20px;

  button {
    margin-right: 11px;
  }
`
const Hint = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.LABEL_TEXT};

  svg {
    fill: ${props => props.theme.colors.GREEN};
  }
`

const SelectionButtonHolder = styled.div`
  flex: 0 0 205px;
`

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 15px 0;

  &:first-child {
    justify-content: space-between;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    flex-wrap: wrap;

    ${Hint} {
      margin-top: 15px;
      margin-bottom: -15px;
    }
  }

`

const EmailButtonStyled = styled(props => <Button {...props} />)`
  width: 60px;

  svg {
    margin: 0 7px;
    width: 25px;
    height: 23px;
    max-width: unset;
    max-height: unset;
    fill: ${props => props.theme.colors.GREEN};
  }
`
const StyledDropdown = styled(DropdownButton)`
  flex: 0 0 auto;

  button {
    width: 190px;
    margin-right: 0;


    & + div {
      width: 100%;
      left: 0;

      ul > li {
        border-top: 1px dashed ${props => props.theme.colors.LABEL_TEXT};

        &:first-child {
          border-top: 0 none;
        }

        & li {
          border: 0 none;
        }
      }
    }
  }
`

interface ToolbarProps {
  toggleAll: (selected: boolean) => void
  selectedPhotosIds: Array<PhotoBasic['id']>
  allSelected?: boolean
  allDeselected?: boolean
  showEmailPopup: () => void
  dropdownOptions: DropDownListGroups
  downloadText: JSX.Element
  emailTooltipText: string
  emailBtnDisabled?: boolean
}

const Toolbar: React.FunctionComponent<ToolbarProps> = props => {

  return (
    <ToolbarWrapper>
      <ToolbarRow>
        <StyledDropdown
          label='Select Download Type'
          list={props.dropdownOptions}
          autoHeight
        />
        <Tooltipped tooltip={props.emailTooltipText} >
          <div>
            <EmailButtonStyled
              buttonTheme='primary'
              icon={MailOutline}
              type='button'
              onClick={() => props.showEmailPopup()}
              disabled={props.emailBtnDisabled}
            />
          </div>
        </Tooltipped>
      </ToolbarRow>
      <ToolbarRow>
        <SelectionButtonHolder>
          <Button
            buttonTheme='primary'
            label='Select All'
            type='button'
            onClick={() => props.toggleAll(true)}
            disabled={props.allSelected}
          />
          <Button
            buttonTheme='primary'
            label='Unselect'
            type='button'
            onClick={() => props.toggleAll(false)}
            disabled={props.allDeselected}
          />
        </SelectionButtonHolder>
        <Hint>
          {props.downloadText}
        </Hint>
      </ToolbarRow>
    </ToolbarWrapper>
  )
}

export default Toolbar
