import { Card as CardType } from '#veewme/lib/types'
import Button from '#veewme/web/common/buttons/basicButton'
import Card, { BaseCard } from '#veewme/web/common/card'
import FormikCard, { FormikCardProps } from '#veewme/web/common/formikFields/cardField'
import FormikFlipCard from '#veewme/web/common/formikFields/flipCardField'
import Overlay from '#veewme/web/common/overlay'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldProps } from 'formik'
import * as React from 'react'

const StyledCard = styled(FormikCard) `
  width: 250px;
  border-color: ${props => props.theme.colors.GREEN};
  & > div > header {
    background-color: ${props => props.theme.colors.GREEN};
  }
`

const StyledFlipCard = styled(FormikFlipCard) `
  width: 250px;
  height: 400px;
  border-color: ${props => props.theme.colors.BLUE};
  & header {
    background-color: ${props => props.theme.colors.BLUE};
  }
`

const StyledContentWrapper = styled.div `
  flex: 1;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  margin-bottom: 12px;
  font-size: 12px;
`

const StyledCardFront = styled(Card) `
  height: 100%;
`

const StyledCardBack = styled(BaseCard) `
  height: 100%;
`

interface CustomProps {
  className?: string
}

type DemoCardProps = CustomProps & CardType & FieldProps

interface DemoCardState {
  flipped: boolean
}

class DemoFlipCard extends React.PureComponent<DemoCardProps, DemoCardState> {
  state: DemoCardState = {
    flipped: false
  }

  handleFlipClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState(prevState => ({ flipped: !prevState.flipped }))
  }

  render () {
    const { form, field } = this.props
    return (
      <StyledFlipCard
        field={field}
        form={form}
        className={this.props.className}
        flipped={this.state.flipped}
        id={this.props.id}
        cardFront={
          <StyledCardFront
            id={this.props.id}
            title={this.props.title}
            footerContent={<p>Footer Content</p>}
          >
            <StyledContentWrapper>
              <p>Content</p>
              <Button buttonTheme='primary' label='Flip card' onClick={this.handleFlipClick}/>
            </StyledContentWrapper>
          </StyledCardFront>
        }
        cardBack={
          <StyledCardBack
            footerContent={<Button buttonTheme='info' label={'Flip to front'} onClick={this.handleFlipClick}/>}
          >
            <StyledContentWrapper>
              <p>Card Back</p>
              <p>Content</p>
            </StyledContentWrapper>
          </StyledCardBack>
        }
      />
    )
  }
}

const FieldsWrapper = styled.div `
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`

const StyledOverlayContent = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 4px;
`

const StyledOverlayContentHeader = styled.div `
  font-weight: 700;
  font-size: 16px;
  color: ${props => props.theme.colors.GREEN};
  margin-bottom: 30px;
`

const StyledOverlayContentText = styled.div `
  font-weight: 500;
  font-size: 13px;
  color: white;
`

const StyledOverlay = styled(Overlay) `
  border-radius: 7px;
`
interface OverlayCardState {
  showOverlay: boolean
}

class OverlayCard extends React.PureComponent<FormikCardProps, OverlayCardState> {
  state: OverlayCardState = {
    showOverlay: false
  }

  handleOverlayButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      showOverlay: false
    })
  }

  handleClick = () => {
    this.setState({
      showOverlay: true
    })
  }

  render () {
    return (
      <StyledCard {...this.props}>
        {this.state.showOverlay &&
          <StyledOverlay onConfirmClick={this.handleOverlayButtonClick} onCancelClick={this.handleOverlayButtonClick}>
            <StyledOverlayContent>
              <StyledOverlayContentHeader>
                <p>Note!</p>
              </StyledOverlayContentHeader>
              <StyledOverlayContentText>
                <p>Card overlay content. Press OK to accept.</p>
              </StyledOverlayContentText>
            </StyledOverlayContent>
          </StyledOverlay>
        }
        <StyledContentWrapper onClick={this.handleClick}>
          <p>Click on card content to show overlay</p>
        </StyledContentWrapper>
      </StyledCard>
    )
  }
}

const CardPanel: React.FunctionComponent<{}> = () => {
  return (
    <Panel heading='Cards'>
      <FieldsWrapper>
        <Field
          name='card'
          component={StyledCard}
          id='123'
          title='Card Title'
          footerContent={<p>Footer Content</p>}
        >
          <StyledContentWrapper>
            <p>Content</p>
          </StyledContentWrapper>
        </Field>
        <Field
          name='flipCard'
          component={DemoFlipCard}
          id='flip123'
          title='FlipCard Title'
        />
        <Field
          name='overlayCard'
          component={OverlayCard}
          id='overlay123'
          title='Overlay Card'
          footerContent={<p>Footer Content</p>}
        />
      </FieldsWrapper>
    </Panel>
  )
}

export default CardPanel
