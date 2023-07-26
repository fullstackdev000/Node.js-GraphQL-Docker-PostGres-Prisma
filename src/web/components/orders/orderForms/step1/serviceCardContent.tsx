import Article from '#veewme/web/common/article'
import { RawDraftContentState } from 'draft-js'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import styled from '../../../../common/styled-components'

import { StyledReadMore, StyledText, StyledTextWrapper, StyledTitle } from '#veewme/web/components/services/cards/serviceCardContent'

export const StyledCardContent = styled.div<{ color: string }> `
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 13px;
  overflow: hidden;
  border-color: ${props => props.color};
  & svg {
    fill: ${props => props.color};
    color: ${props => props.color};
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

const StyledImage = styled.img<{
  checked?: boolean
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;

  ${props => props.checked && `
    opacity: 0.6;
    filter: blur(2px);
  `}
`

const StyledScrollBar = styled(Scrollbars) `
  margin: 0;
  backface-visibility: hidden;
`

const StyledArticle = styled(Article)<{
  suspended?: boolean
}>`
  color: ${props => props.theme.colors.SERVICE_DESCRIPTION};
`

interface ServiceCardContentProps {
  color: string
  icon: React.SVGFactory
  image?: string
}

interface ServiceCardFrontContentProps extends ServiceCardContentProps {
  readMore: boolean
  onReadMoreClick: (event: React.MouseEvent<HTMLSpanElement>) => void
  shortDescription: string
  title?: string
  checked?: boolean
}

interface ServiceCardBackContentProps extends ServiceCardContentProps {
  longDescription: RawDraftContentState
}

export const ServiceCardFrontContent: React.FunctionComponent<ServiceCardFrontContentProps> = props => (
  <StyledCardContent color={props.color}>
    {props.image
      ? <StyledImageWrapper>
          <StyledImage checked={props.checked} src={props.image} alt='image for the service'/>
        </StyledImageWrapper>
      : <StyledIconWrapper>
          <StyledIcon icon={props.icon}/>
        </StyledIconWrapper>
    }
    <StyledTextWrapper>
      <StyledTitle>{props.title}</StyledTitle>
      <StyledText>
        {props.shortDescription}
        {
          props.readMore && <StyledReadMore
            onClick={props.onReadMoreClick}
          >
            ... Read More
          </StyledReadMore>
        }
      </StyledText>
    </StyledTextWrapper>
  </StyledCardContent>
)

export const ServiceCardBackContent: React.FunctionComponent<ServiceCardBackContentProps> = props => (
  <StyledCardContent color={props.color}>
    <StyledTextWrapper>
      <StyledScrollBar autoHeight={true} autoHeightMax={260}>
        {props.longDescription && <StyledArticle content={props.longDescription} />}
      </StyledScrollBar>
    </StyledTextWrapper>
  </StyledCardContent>
)
