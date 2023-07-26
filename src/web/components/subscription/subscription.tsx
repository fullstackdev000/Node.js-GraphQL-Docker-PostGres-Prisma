import Button from '#veewme/web/common/buttons/basicButton'
import { Switch } from '#veewme/web/common/formikFields/switchField'
import * as Grid from '#veewme/web/common/grid'
import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const Wrapper = styled.div`
  width: 100%;
`

const Heading = styled(Grid.Heading)`
  [type='submit'] {
    display: none;
  }
`

const Content = styled(Grid.MainColumnFullWidth)`
  &&& {
    grid-column-start: 1;
  }
`

const BoxHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 30px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    justify-content: center;
  }
`

const Box = styled.section`
  margin: 20px 20px 0 0;
  padding: 20px;
  height: 150px;
  flex: 0 0 390px;
  border-radius: 5px;

  background-color: ${props => props.theme.colors.GREEN};

  &:nth-child(2) {
    background-color: ${props => props.theme.colors.ORANGE};
  }

  &:nth-child(3) {
    background-color: ${props => props.theme.colors.BLUE};
  }

  &:nth-child(4) {
    background-color: ${props => props.theme.colors.YELLOW};
  }

  h3 {
    font-size: 17px;
  }

  p {
    margin-top: 10px;
  }

  div {
    margin-top: -20px;
    font-size: 110px;
    text-align: center;
    font-weight: 600;
    color: ${props => props.theme.colors.DARK_GREY};
    opacity: 0.2;
  }
`

const SwitchBox = styled.div`
  display: inline-block;
  padding: 10px 15px;
  border-radius: 3px;
  background: #fff;
  box-shadow: 1px 2px 5px 3px rgba(0, 0, 0, 0.5);

  & > div {
    padding: 0;
  }

`

const ContentBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 1150px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    justify-content: center;
  }
`

const ActivationBox = styled.div`
  width: 500px;
  display: flex;
  align-items: center;
  padding-bottom: 50px;
  margin-right: 20px;
`

const Price = styled.div`
  margin-right: 30px;
  font-size: 24px;
  color: ${props => props.theme.colors.HEADER};
  font-weight: 500;
`

const LeftBox = styled.div`
  width: 500px;
  margin-bottom: 30px;
  margin-right: 20px;

  p {
    margin-bottom: 20px;
    line-height: 21px;
    font-weight: 500
  }
`

const RightBox = styled.div`
  width: 500px;
  color: ${props => props.theme.colors.HEADER};

  p {
    margin-bottom: 20px;
  }
`

const ConfirmButton = styled(props => <Button {...props}/>)`
  float: right;
  background: ${props => props.theme.colors.ORANGE};
  border-color:  ${props => props.theme.colors.ORANGE};

  &&&&:hover {
    background: ${props => props.theme.colors.ORANGE};
    border-color:  ${props => props.theme.colors.ORANGE};
  }
`

const ModalContent = styled.div`
  padding-top: 25px;
  margin-top: -25px;
  background: no-repeat top right url('/public/static/svg/subscription.svg');
  background-size: contain;
  display: flow-root;;

  p {
    width: 540px;
    padding-right: 130px;
    padding-bottom: 50px;
  }
`

const Subscription: React.FunctionComponent = () => {
  const [active, setActive] = React.useState(false)
  const [isOpen, toggleModal] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (active) {
      toggleModal(true)
    }
  }, [active])

  return (
    <Wrapper>
      <Grid.Wrapper>
        <Heading>
         <h1>Subscription has its privileges</h1>
        </Heading>
        <Content>
          <BoxHolder>
              <Box>
                <h3>Free video generation</h3>
                <p>
                  Create slideshow videos from stored photos.
                  A great incentive or additional revenue
                  generator (<strong>$8</strong> savings per video).

                </p>
              </Box>
              <Box>
                <h3>Free video uploads/hosting</h3>
                <p>
                  Why host your videos else-where and
                  complicate things. Our alternative is just
                  as good and a better value, with no
                  hidden fees (<strong>$4</strong> savings per video).

                </p>
              </Box>
              <Box>
                <h3>Discounted property site activations</h3>
                <p>
                  Jump the line without having to
                  purchase at a  higher credit
                  discount level.

                </p>
              </Box>
              <Box>
                <h3>Vendor list preferred positioning</h3>
                <div>Soon!</div>
              </Box>
          </BoxHolder>
          <ActivationBox>
            <Price>
              Subscribe at $89/monthly
            </Price>
            <SwitchBox>
              <Switch
                labelFirst
                compactMode
                value={active}
                name='subscription'
                label='Activate'
                onChange={e => {
                  setActive(e.target.checked)
                  log.debug('Subscription active:', e.target.checked)
                }}
              />
            </SwitchBox>
            </ActivationBox>
          <ContentBottom>
            <LeftBox>
              <p>
                <strong>Example of savings</strong><br/>
                Based on 50 property sites /month -$250<br/>
                50 branded and unbranded video slideshows - $400<br/>
                50 video uploads - $200<br/>
                <strong>Saving $850</strong>
              </p>
              <p>
                <strong>Revenue increase opportunity!</strong><br/>
                Offer video slideshow for $19 or more revenue $950 and up.
              </p>
              <p>
                Plan savings $850<br/>
                Revenue increase $950<br/>
                <strong>Total $1,800+/mon</strong>
              </p>
            </LeftBox>
            <RightBox>
              <p>
                Our subscription based Elite Affiliate program offers a tremendeous value.
                Included are highly discounted Single Property Websites*, Unlimited free video slideshow (Faux Video) generation (branded+unbranded), unlimited video transcoding/ hosting.
                As we add functionality to our platform further discounts will be part of the subscription plan.
              </p>
              <p>
                You may cancel at anytime, your cancellation will take effect on the day of the month the subscription started. No refunds are offered. Your pricing, discounts and other priviledges will return to our normal rates and costs. Pricing subject to change.
              </p>
              *When purchased in volume of 50 activations.
            </RightBox>
          </ContentBottom>
        </Content>
      </Grid.Wrapper>
      <Modal
        centerVertically
        colorTheme='PAYMENT'
        isOpen={isOpen}
        onRequestClose={() => toggleModal(prev => !prev)}
        title='You are subscribed!'
      >
        <ModalContent>
          <p>
            I understand and agree to the Ogle subscription
            plan and that I will be charged a monthly fee<br/>
            as laid out on the activation page.
          </p>
          <ConfirmButton
            onClick={() => toggleModal(false)}
            buttonTheme='info'
            full
            label='OK'
            size='medium'
          />
        </ModalContent>
      </Modal>
    </Wrapper>
  )
}
export default Subscription
