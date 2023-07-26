import { Card } from '#veewme/lib/types'
import FlipCard from '#veewme/web/common/flipCard'
import { FieldProps } from 'formik'
import * as React from 'react'
import CheckMarkStamp from '../checkMarkStamp'
import styled from '../styled-components'

export const StyledCheckMarkStamp = styled(CheckMarkStamp) `
  display: none;
  position: absolute;
  top: 100px;
  left: 50%;
  margin-left: -45px;
  width: 90px;
  height: 90px;
  z-index: 10;
  background-color: ${props => props.theme.colors.GREEN};
  box-shadow: 4px 5px 3px -2px rgba(0, 0, 0, 0.5);

  svg {
    position: relative;
    left: 3px;
    filter: drop-shadow( -1px -2px 2px rgba(0, 0, 0, .3));
  }

`

const StyledFlipCard = styled(FlipCard) `
  position: relative;
  width: 100%;
  height: 100%;
`

const StyledCardWrapper = styled.div<{ checked?: boolean }> `
  position: relative;
  width: 100%;
  height: 100%;
  & ${StyledCheckMarkStamp} {
    display: ${props => props.checked ? 'flex' : 'none'}
  }
  & ${StyledFlipCard} {
    & > div {
      box-shadow: ${props => props.checked ? '0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' : 'none'};
    }
  }
`

export interface FlipCardProps {
  cardFront: React.ReactNode
  cardBack: React.ReactNode
  className?: string
  flipped?: boolean
  confirmCallback?: () => void
  id: Card['id']
}

export type CheckboxFlipCardProps = FlipCardProps & {
  checked: boolean
  setValue: () => void
}

export const CheckboxFlipCard: React.FunctionComponent<CheckboxFlipCardProps> = props => {

  const handleClick = () => {
    if (props.confirmCallback) {
      props.confirmCallback()
    } else {
      props.setValue()
    }
  }

  return (
      <StyledCardWrapper
        className={props.className}
        checked={props.checked}
        onClick={handleClick}
      >
        <StyledFlipCard
          flipped={props.flipped}
          cardFront={
            <>
              <StyledCheckMarkStamp/>
              {props.cardFront}
            </>
          }
          cardBack={
            <>
              <StyledCheckMarkStamp/>
              {props.cardBack}
            </>
          }
        />
      </StyledCardWrapper>
  )
}

export type FormikFlipCardProps = FieldProps & FlipCardProps

const FormikFlipCard: React.FunctionComponent<FormikFlipCardProps> = props => {
  const { field, form } = props
  const setValue = () => {
    const value = field.value === props.id ? '' : props.id
    form.setFieldValue(field.name, value)
  }

  return (
      <CheckboxFlipCard
        {...props}
        checked={field.value === props.id}
        setValue={setValue}
      />
  )
}

export default FormikFlipCard
