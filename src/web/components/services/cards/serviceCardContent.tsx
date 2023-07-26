import { ServiceCategory } from '#veewme/gen/graphqlTypes'
import Article from '#veewme/web/common/article'
import { rgbaToString } from '#veewme/web/common/formikFields/colorField'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { getServiceCategoryIcon } from '../common/util'
import { ServiceCard } from '../types'

const StyledCardContent = styled.div<{ category: ServiceCategory, suspended?: boolean }> `
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 13px;
  overflow: hidden;
  background-color: ${props => props.suspended ? '#fff' : rgbaToString({
    ...props.category.color,
    a: 0.5
  })};
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : 'inherit'};
  & svg {
    color: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString(props.category.color)};
    fill: ${props => props.suspended ? props.theme.colors.SUSPENDED : rgbaToString(props.category.color)};
  }
`

const StyledImageWrapper = styled.div `
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 150px;
  justify-content: center;
`

const StyledIconWrapper = styled(StyledImageWrapper) `
  align-items: center;
`

const StyledIcon = styled(props => <props.icon className={props.className}/>) `
  width: 80px;
  height: 60px;
`

const StyledImage = styled.img<{ suspended?: boolean }> `
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${props => props.suspended ? 'grayscale(100%) opacity(30%)' : 'none'}
`

export const StyledTextWrapper = styled.div `
  flex: 1;
  padding: 10px 12px 10px 12px;
  position: relative;
  width: 100%;
`

const StyledScrollBar = styled(Scrollbars) `
  margin: 0;
  backface-visibility: hidden;
`

export const StyledText = styled.div<{
  suspended?: boolean
}>`
  line-height: 1.5;
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.theme.colors.SERVICE_DESCRIPTION};
  font-size: 11px;
`

export const StyledReadMore = styled.p<{ suspended?: boolean }> `
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.theme.colors.DARK_GREY};
  cursor: ${props => props.suspended ? 'default' : 'pointer'};
  width: 100%;
  text-align: center;
  margin: 10px 0;
  font-weight: 500;
  display: inline;
`

export const StyledTitle = styled.div<{
  suspended?: boolean
}>`
  padding-bottom: 7px;
  margin-top: 3px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${props => props.suspended ? props.theme.colors.BORDER : props.theme.colors.DARK_GREY};
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  text-align: center;
`

const StyledArticle = styled(Article)<{
  suspended?: boolean
}>`
  color: ${props => props.suspended ? props.theme.colors.SUSPENDED : props.theme.colors.SERVICE_DESCRIPTION};
`

interface ServiceCardContentProps {
  category: ServiceCategory
  card: ServiceCard
  suspended?: boolean
}

interface ServiceCardFrontContentProps extends ServiceCardContentProps {
  onReadMoreClick: (event: React.MouseEvent<HTMLSpanElement>) => void
}

export const ServiceCardFrontContent: React.FunctionComponent<ServiceCardFrontContentProps> = props => {
  return (
    <StyledCardContent
      category={props.category}
      suspended={props.card.suspended}
    >
      {props.card.serviceImage
        ? <StyledImageWrapper>
            <StyledImage suspended={props.card.suspended} src={props.card.serviceImage.path} alt='image for the service'/>
          </StyledImageWrapper>
        : <StyledIconWrapper>
            <StyledIcon icon={getServiceCategoryIcon(props.card.serviceType === 'Admin' ? undefined : props.category.icon)}/>
          </StyledIconWrapper>
      }
      <StyledTextWrapper>
        <StyledTitle suspended={props.card.suspended}>{props.card.title}</StyledTitle>
        <StyledText suspended={props.card.suspended}>
            {props.card.shortDescription}
            {props.card.longDescription &&
              <StyledReadMore
                onClick={props.card.suspended ? undefined : props.onReadMoreClick}
                suspended={props.card.suspended}
              >
                ... Read More
              </StyledReadMore>
            }
        </StyledText>

      </StyledTextWrapper>
    </StyledCardContent>
  )
}

export const ServiceCardBackContent: React.FunctionComponent<ServiceCardContentProps> = props => (
  <StyledCardContent
    category={props.category}
    suspended={props.card.suspended}
  >
    <StyledTextWrapper>
      <StyledScrollBar autoHeight={true} autoHeightMax={260}>
        {props.card.longDescription && <StyledArticle suspended={props.suspended} content={props.card.longDescription} />}
      </StyledScrollBar>
    </StyledTextWrapper>
  </StyledCardContent>
)
