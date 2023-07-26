import styled from '#veewme/web/common/styled-components'
import { abstractAdminServiceCategory, getServiceCategoryIcon } from '#veewme/web/components/services/common/util'
import { ServiceCard } from '#veewme/web/components/services/types'
import * as React from 'react'
import Truncate from 'react-truncate'
import { StyledGreyTitle, StyledHeaderIconWrapper, StyledPrice, StyledSelectedServiceHeader, StyledService, StyledServiceSubtitle, StyledServiceTitle, StyledTitleWrapper } from './styled'

const MAX_TRUNCATED_LINES = 1

const StyledHeaderIcon = styled(props => <props.icon className={props.className}/>)`
  width: 20px;
  height: 18px;
`
// hide for now
const StyledContentWrapper = styled.div`
  margin-top: 20px;
  padding-right: 20px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.FIELD_TEXT};

  display: none;
`

const StyledTruncateWrapper = styled.div`
  width: 100%;
`

export const StyledServicePrice = styled(StyledPrice)<{ color?: string }> `
  color: ${props => props.color || props.theme.colors.PACKAGE_CARD};
`

const StyledReadMore = styled.button`
  margin-top: 12px;
  outline: none;
  border: none;
  background-color: transparent;
  color: ${props => props.theme.colors.BLUE};
  cursor: pointer;
`

interface SelectedServiceProps {
  card: ServiceCard
  onReadMoreClick?: (event: React.MouseEvent<HTMLSpanElement>) => void
  serviceType: string
}

interface SelectedServiceState {
  truncated: boolean,
  expanded: boolean
}

class SelectedService extends React.PureComponent<SelectedServiceProps, SelectedServiceState> {
  state: SelectedServiceState = {
    expanded: false,
    truncated: false
  }

  handleTruncate = (truncated: boolean) => {
    if (this.state.truncated !== truncated) {
      this.setState({ truncated })
    }
  }

  toggleLines = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { expanded, truncated } = this.state
    const colorObject = this.props.card.category ? this.props.card.category.color : undefined
    const color = colorObject ? `rgba(${colorObject.r}, ${colorObject.g}, ${colorObject.b}, ${colorObject.a})` : undefined
    const { color: { r, g, b, a } } = abstractAdminServiceCategory
    const adminColor = `rgba(${r}, ${g}, ${b}, ${a})`
    const isAdminService = this.props.card.serviceType === 'Admin'
    const icon = getServiceCategoryIcon(!isAdminService ? this.props.card.category.icon : undefined)

    return (
      <StyledService>
        <StyledSelectedServiceHeader>
          <StyledTitleWrapper>
            <StyledHeaderIconWrapper color={!isAdminService ? color : adminColor}>
              <StyledHeaderIcon
                icon={icon}
              />
            </StyledHeaderIconWrapper>
            <div>
              <StyledServiceTitle>{this.props.card.name}<StyledGreyTitle> ({this.props.serviceType})</StyledGreyTitle></StyledServiceTitle>
              {!isAdminService && <StyledServiceSubtitle>{this.props.card.categoryLabel}</StyledServiceSubtitle>}
            </div>
          </StyledTitleWrapper>
          <div>
            <StyledServicePrice color={color}>${this.props.card.price}</StyledServicePrice>
          </div>
        </StyledSelectedServiceHeader>
        <StyledContentWrapper>
          <StyledTruncateWrapper>
            <Truncate
              lines={expanded ? false : MAX_TRUNCATED_LINES}
              ellipsis={<span>... </span>}
              onTruncate={this.handleTruncate}
            >
              TODO add description
            </Truncate>
          </StyledTruncateWrapper>
          {truncated && !expanded &&
            <StyledReadMore onClick={this.toggleLines}>Read More</StyledReadMore>
          }
          {!truncated && expanded &&
            <StyledReadMore onClick={this.toggleLines}>Show Less</StyledReadMore>
          }
        </StyledContentWrapper>
      </StyledService>
    )
  }
}

export default SelectedService
