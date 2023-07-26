import { Card as CardType } from '#veewme/lib/types'
import * as React from 'react'
import styled from './styled-components'

const StyledTitle = styled.h4 `
  display: inline-block;
  font-weight: 600;
  font-size: 15px;
  color: white;
  padding: 0 10px;
  text-align: center;
`

const StyledFooter = styled.footer `
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 50px;
`

const StyledCard = styled.div `
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-color: darkgrey;
  border-style: solid;
  border-width: 2px;
  border-radius: 7px;
  box-shadow: none;
  cursor: pointer;
`

const StyledContent = styled.div `
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const HorizontalLine = styled.div `
  width: 100%;
  height: 2px;
  border-color: inherit;
  border-style: solid;
  border-width: 2px 0 0 0;
`

export interface BaseCardProps {
  footerContent: React.ReactNode
  className?: string
}

export const BaseCard: React.FunctionComponent<BaseCardProps> = props => {
  return (
    <StyledCard
      className={props.className}
    >
      <StyledContent>
        {props.children}
      </StyledContent>
      <HorizontalLine/>
      <StyledFooter>
        {props.footerContent}
      </StyledFooter>
    </StyledCard>
  )
}

const StyledHeader = styled.header `
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  border-radius: 6px 6px 0 0;
  background-color: darkgrey;
`

export type CardProps = BaseCardProps & CardType

const Card: React.FunctionComponent<CardProps> = props => {
  const { title, children, ...rest } = props
  return (
    <BaseCard
      {...rest}
    >
      <StyledHeader>
        <StyledTitle>{props.title}</StyledTitle>
      </StyledHeader>
      {props.children}
    </BaseCard>
  )
}

export default Card
