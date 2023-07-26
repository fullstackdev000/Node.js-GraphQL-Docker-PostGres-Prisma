import { PopupAd } from '#veewme/lib/types'
import DropDownButton from '#veewme/web/common/buttons/dropDownButton'
import { DropDownListGroups } from '#veewme/web/common/dropDownList'
import styled from '#veewme/web/common/styled-components'
import { formatLines } from '#veewme/web/common/util'
import * as React from 'react'
import { Check } from 'styled-icons/fa-solid'

const StyledItem = styled.div<{selected?: boolean}> `
  width: 600px;
  border-radius: 7px;
  background-color: white;
  margin: 10px 0;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid ${props => props.selected ? props.theme.colors.BUTTON_BORDER_HOVER : 'transparent'}
  box-shadow: ${props => props.selected ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' : 'none'};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    font-size: 10px;
  }
  &:hover, &:active {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
`

const StyledHeader = styled.header `
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.BUTTON_BORDER};
`

const StyledHeadingsWrapper = styled.div `
  flex: 1;
  margin-left: 16px;
  & > h3 {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.colors.LABEL_TEXT_HOVER};
  }
  & > h4 {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }
`

const StyledCheckButton = styled.button<{selected?: boolean}> `
  border: 2px solid ${props => props.selected ? props.theme.colors.BUTTON_BORDER_HOVER : props.theme.colors.BUTTON_BORDER};
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  outline: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  &:hover, &:active {
    border: 2px solid ${props => props.theme.colors.BUTTON_BORDER_HOVER};
    svg {
      color: ${props => props.theme.colors.BUTTON_BORDER_HOVER};
    }
  }
  svg {
    width: 50%;
    height: 50%;
    background: transparent
    color: ${props => props.selected ? props.theme.colors.BUTTON_BORDER_HOVER : props.theme.colors.BUTTON_BORDER};
  }
`

const StyledDropDownButton = styled(DropDownButton)`
  button {
    width: 100%;
    padding: 0 8px;
    background-color: transparent;
  }
`

const StyledContent = styled.div `
  display: flex;
  max-width: 100%;
`

const StyledDetails = styled.div `
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledDescription = styled.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const StyledImageWrapper = styled.div `
  flex: 0 0 230px;
  height: 230px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const StyledFooter = styled.footer `
  margin: 16px 0;
  color: ${props => props.theme.colors.LABEL_TEXT_HOVER};
  font-size: 12px;
  font-weight: 700;
`

export enum PopupAdAction {
  Assign,
  Delete
}

interface PopupAdsListItemProps {
  popupAd: PopupAd
  selected?: boolean
  onSelect: (id: PopupAd['id']) => void
  onActionClick: (action: PopupAdAction, id: PopupAd['id']) => void
}

const PopupAdsListItem: React.FunctionComponent<PopupAdsListItemProps> = props => {
  const actionOptions: DropDownListGroups = [{
    items: [{
      label: 'Assign',
      onClick: () => props.onActionClick(PopupAdAction.Assign, props.popupAd.id)
    }, {
      label: 'Edit',
      linkTo: '#' // TODO update link
    }, {
      label: 'Delete',
      onClick: () => props.onActionClick(PopupAdAction.Delete, props.popupAd.id)
    }]
  }]

  return (
    <StyledItem selected={props.selected}>
      <StyledHeader>
        <StyledCheckButton
          selected={props.selected}
          onClick={() => props.onSelect(props.popupAd.id)}
        >
          <Check/>
        </StyledCheckButton>
        <StyledHeadingsWrapper>
          <h3>{props.popupAd.headline}</h3>
          {props.popupAd.region &&
            <h4>Region: {props.popupAd.region}</h4>
          }
        </StyledHeadingsWrapper>
        <StyledDropDownButton list={actionOptions} />
      </StyledHeader>
      <StyledContent>
        <StyledDetails>
          <StyledDescription>
            <div>
              {formatLines(props.popupAd.description)}
            </div>
          </StyledDescription>
          <StyledFooter>
            {props.popupAd.footNote}
          </StyledFooter>
        </StyledDetails>
        <StyledImageWrapper>
          <img src={props.popupAd.imageUrl} alt='image for popup ad'/>
        </StyledImageWrapper>
      </StyledContent>
    </StyledItem>
  )
}

export default PopupAdsListItem
