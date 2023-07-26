import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'

export const StyledPanel = styled(Panel)`
  display: flex;
  flex-direction: column;

  header {
    display: block;
    margin: 0;
    padding: 15px 20px 0 20px;
  }

  h2 {
    margin: 0;
    padding-bottom: 10px;
    font-weight: 600;
    font-size: 15px;
    color: ${props => props.theme.colors.DARKER_GREY};
    border-bottom: 1px solid ${props => props.theme.colors.BORDER}
  }

  & > div {
    display: flex;
    flex-direction: column;
    padding: 15px 20px 24px 20px;
    height: 100%;
  }
`

export const StyledSelectedServiceHeader = styled.header`
  display: flex;
  justify-content: space-between;
`

export const StyledPrice = styled.h4 `
  display: inline-block;
  margin: 0 10px;
  font-weight: 600;
  font-size: 26px;
  color: ${props => props.theme.colors.GREEN};
`

export const StyledOldPrice = styled(StyledPrice)`
  color: ${props => props.theme.colors.GREY};
  text-decoration: line-through;
`

export const StyledTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledHeaderIconWrapper = styled.div<{ color?: string }> `
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.color || props.theme.colors.PACKAGE_CARD};
  border-radius: 50%;
  margin-right: 10px;
  & svg {
    fill: ${props => props.color || props.theme.colors.PACKAGE_CARD};
  }
`

export const StyledServiceTitle = styled.h5`
  font-weight: 700;
  font-size: 14px;
  color: ${props => props.theme.colors.FIELD_TEXT};
`

export const StyledServiceSubtitle = styled.h6`
  font-weight: 500;
  font-size: 14px;
  margin-top: 5px;
  color: ${props => props.theme.colors.FIELD_TEXT};
`

export const StyledGreyTitle = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.GREY};
`

export const StyledService = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

export const StyledInlineWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledPanelContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  & > :not(:first-child) {
    padding: 10px 0;
  }
  & > :first-child {
    padding-bottom: 5px;
  }

  & > :last-child {
    padding-bottom: 0;
  }
`

export const StyledDetail = styled.div<{
  inline?: boolean
}>`
  flex: 0 0 auto;
  font-size: 13px;
  width: 100%;

  ${props => props.inline && `
    display: flex;

    ${StyledDetailLabel} {
      margin-right: 10px;
    }
  `}
`

export const StyledDetailLabel = styled.p`
  margin-bottom: 3px;
  color: ${props => props.theme.colors.DARKER_GREY};
  font-weight: 600;
`

export const StyledDetailContent = styled.p`
  font-weight: 500;
  font-size: 13px;
  color: ${props => props.theme.colors.DARKER_GREY};
`

export const SectionHeading = styled.h4`
  margin: 0 0 13px 0;
  padding-bottom: 10px;
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.theme.colors.DARKER_GREY};
  border-bottom: 1px solid ${props => props.theme.colors.BORDER}
`

export const MiddleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 50%;
  gap: 10px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    grid-template-columns: 1fr 1fr;

    & > div:last-child {
      grid-column: 1 /span 2;
    }
  }
`

export const PropertyDetailsSection = styled.div`
  margin-top: 15px;
  margin-bottom: 10px;
`

export const StepTitle = styled.h2`
  margin: 0 0 13px 0;
  padding-bottom: 10px;
  font-weight: 500;
  font-size: 25px;
  color: ${props => props.theme.colors.DARKER_GREY};
`
