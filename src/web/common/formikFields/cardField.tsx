import { Card as CardType } from '#veewme/lib/types'
import { StyledCheckMarkStamp } from '#veewme/web/common/formikFields/flipCardField'
import { FieldProps } from 'formik'
import * as React from 'react'
import Card, { CardProps } from '../card'
import styled from '../styled-components'

const StyledCard = styled(Card) `
`

const StyledCardWrapper = styled.div<{checked?: boolean}> `
  position: relative;
  & > ${StyledCard} {
    box-shadow: ${props => props.checked ? '0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' : 'none'};
  }
  & > ${StyledCheckMarkStamp} {
    display: ${props => props.checked ? 'flex' : 'none'}
  }
`

export type FormikCardProps = FieldProps & CardProps & CardType

class FormikCard extends React.Component<FormikCardProps> {
  handleClick = () => {
    let value
    if (this.props.field.value !== this.props.id) {
      value = this.props.id
    }
    this.props.form.setFieldValue(this.props.field.name, value)
    this.props.form.setFieldTouched(this.props.field.name)
  }

  render () {
    const { field, form, ...props } = this.props
    return (
      <StyledCardWrapper
        className={props.className}
        onClick={this.handleClick}
        checked={field.value === props.id}
      >
        <StyledCheckMarkStamp/>
        <StyledCard {...props}>
          {props.children}
        </StyledCard>
      </StyledCardWrapper>
    )
  }
}

export default FormikCard
