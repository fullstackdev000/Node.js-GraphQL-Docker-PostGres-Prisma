import ListHeaderItem from '#veewme/web/common/listHeaderItem'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const StyledHeader = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr 105px;
  grid-template-rows: auto;
  grid-template-areas: "one multi action";
  width: 100%;
  margin-top: 20px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 1fr 105px;
    grid-template-rows: auto auto;
    grid-template-areas: "one one" "multi action";
  }
`

const StyledGroup1 = styled.div `
  grid-area: one;
  display: grid;
  grid-template-columns: 100px 80px 5fr 3fr;
  grid-template-rows: auto;
  grid-template-areas: "date id address agent";
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    padding: 2px 0;
  }
`

const StyledGroup2 = styled.div `
  grid-area: multi;
  display: grid;
  grid-template-columns: 100px 2fr 3fr 45px;
  grid-template-rows: auto;
  grid-template-areas: "date photo service done";
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 100px 2fr 3fr 45px;
    border-top: 1px dashed ${props => props.theme.colors.INFO_BORDER};
    padding: 4px 0;
  }
`

const StyledGroup3 = styled.div `
  grid-area: action;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 105px;
  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    border-top: 1px dashed ${props => props.theme.colors.INFO_BORDER};
    border-left: 1px dashed ${props => props.theme.colors.INFO_BORDER};
    padding: 4px 0;
  }
`

interface ListHeaderProps {
  reverseSort: boolean,
  onSort?: (label: string) => void
}

const ListHeader: React.FunctionComponent<ListHeaderProps> = props => {
  const handleSortButtonsClick = (label: string) => {
    if (props.onSort) {
      props.onSort(label)
    }
  }

  return (
    <StyledHeader>
      <StyledGroup1>
        <ListHeaderItem label={'Date'} active reverseSort={props.reverseSort} onSort={handleSortButtonsClick}/>
        <ListHeaderItem label={'Order ID'} />
        <ListHeaderItem label={'Address'} />
        <ListHeaderItem label={'Agent'} />
      </StyledGroup1>
      <StyledGroup2>
        <ListHeaderItem label={'Shoot Date'}/>
        <ListHeaderItem label={'Photographer'}/>
        <ListHeaderItem label={'Service'} />
        <ListHeaderItem label={'Done'} />
      </StyledGroup2>
      <StyledGroup3>
        <ListHeaderItem label={'Actions'} />
      </StyledGroup3>
    </StyledHeader>
  )
}

export default ListHeader
