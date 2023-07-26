import { Countries, States } from '#veewme/lib/constants'
import { Card, LatLng, Location, PromoCode } from '#veewme/lib/types'
import { privateUrls } from '#veewme/lib/urls'
import { convertToServiceTypeCards, fixFloatAfterDigit, nameof } from '#veewme/lib/util'
import { BreadcrumbNavigation } from '#veewme/web/common/breadcrumbs/breadcrumbNavigation'
import Button from '#veewme/web/common/buttons/basicButton'
import { unsetNumberId } from '#veewme/web/common/consts'
import NavigationWarning from '#veewme/web/common/formikFields/navigationWarning'
import * as Grid from '#veewme/web/common/grid'
import * as log from '#veewme/web/common/log'
import { addressToLatLng } from '#veewme/web/common/map'
import styled from '#veewme/web/common/styled-components'
import { ServiceCard } from '#veewme/web/components/services/types'
import { ContentState, EditorState } from 'draft-js'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as Yup from 'yup'
import StepFooter, { setPaymentMethod } from './footer'
import Step1 from './step1/step1'
import Step2, { Step2FieldsProps } from './step2/step2'
import Step3, { Step3ServiceProps } from './step3/step3'
import { ValidationAlert } from './styled'
import { ConvertedAgent, CreateOrderFormValues } from './types'

import Finger from '#veewme/web/assets/svg/finger.svg'

export const LAST_STEP = 2

export type FormValues = CreateOrderFormValues

const StyledGridLeftAside = styled(Grid.LeftAside) `
  & > nav {
    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) and (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XXL}) {
      & > div:first-child > div:first-child > div:first-child {display: flex;}
    }
  }
`

const Heading = styled(Grid.Heading)`
  align-items: center;

  h1 {
    flex: 1 0 auto;
  }

  div {
    margin-bottom: 0;
  }
`

type CustomProps = {
  addOnCategoriesOrder: string[]
  primaryCategoriesOrder: string[]
  addOnCollapsedIds: number[]
  primaryCollapsedIds: number[]
  promoCodes: PromoCode[]
  onSubmit: (values: FormValues) => void
  agents: ConvertedAgent[]
  agentId?: number
  isAgent?: boolean
  setPaymentMethod?: setPaymentMethod
  state?: FormValues['realEstate']['state']
  country?: FormValues['realEstate']['country']

} & Step2FieldsProps & Step3ServiceProps & RouteComponentProps

type NewOrderFormViewProps = FormikProps<FormValues> & CustomProps

interface NewOrderFormViewState {
  discount: number
  validPromoCode: boolean
}

class ScrollToTopOnMount extends React.Component {
  componentDidMount () {
    window.scrollTo(0, 0)
  }

  render () {
    return null
  }
}

class NewOrderFormView extends React.PureComponent<NewOrderFormViewProps, NewOrderFormViewState> {
  state: NewOrderFormViewState = {
    discount: 0,
    validPromoCode: false
  }

  addOnCards = convertToServiceTypeCards(this.props.addOnServices)
  primaryCards = convertToServiceTypeCards(this.props.primaryServices)
  adminCards = this.props.adminServices

  getServicesPrice = (serviceCards: ServiceCard[], selectedCardIds: Array<Card['id']>) => {
    return serviceCards.reduce((sum, card) => {
      if (selectedCardIds.includes(card.id)) {
        sum += card.price
      }
      return sum
    }, 0)
  }

  getPromoCode = (code: string, promoCodes?: PromoCode[]) => {
    if (promoCodes) {
      return promoCodes.find(pc => pc.code === code)
    } else return
  }

  getDiscount = (price: number, promoCode: PromoCode) => {
    if (promoCode.discountType === 'amount') {
      return promoCode.discount // TODO check if discount is greater than price?
    } else {
      return price * promoCode.discount / 100
    }
  }

  getOrderTotal = (values: FormValues) => {
    let total: number = 0
    if (values.servicePackageId) {
      total += this.props.servicePackages.filter(card => card.id === values.servicePackageId)
      .reduce((sum, servicePackage) => sum + servicePackage.price, total)
    }
    total += this.getServicesPrice(this.props.primaryServices, values.serviceIds)
    total += this.getServicesPrice(this.props.addOnServices, values.serviceIds)
    total += this.getServicesPrice(this.props.adminServices, values.serviceIds)
    return fixFloatAfterDigit(total)
  }

  updateLatLng = (values: FormValues) => {
    const ZOOM_CONTINENT = 3
    const ZOOM_COUNTRY = 5
    const ZOOM_CITY = 9
    const ZOOM_STREET = 16
    const { street, city, zip, state, country } = values.realEstate
    const stateOption = States.find(s => s.value === state)
    const stateName = stateOption ? stateOption.label : ''
    const countryOption = Countries.find(c => c.value === country)
    const countryName = countryOption ? countryOption.label : ''
    const address = [street, zip, city, stateName, countryName].join(' ')
    addressToLatLng(address)
      .then(response => {
        if (response) {
          this.props.setFieldValue(`${nameof<FormValues>('location')}.${nameof<Location>('latLng')}.${nameof<LatLng>('lat')}`, response.lat)
          this.props.setFieldValue(`${nameof<FormValues>('location')}.${nameof<Location>('latLng')}.${nameof<LatLng>('lng')}`, response.lng)
          let zoom: number = ZOOM_CONTINENT
          if ((zip.length > 0 || street.length > 0) && city.length > 0) {
            zoom = ZOOM_STREET
          } else if (city.length > 0) {
            zoom = ZOOM_CITY
          } else if (stateName) {
            zoom = ZOOM_COUNTRY
          }
          this.props.setFieldValue(`${nameof<FormValues>('location')}.${nameof<Location>('zoom')}`, zoom)
        }
      })
      .catch(() => log.error('addressToLatLng Error'))
  }

  handleUpdateLocation = () => {
    this.updateLatLng(this.props.values)
  }

  handleLocationPanelExpand = () => {
    this.updateLatLng(this.props.values)
  }

  handleApplyPromoCode = () => {
    if (this.props.values.promoCodeToCheck) {
      const promoCode = this.getPromoCode(this.props.values.promoCodeToCheck, this.props.promoCodes)
      if (promoCode) {
        this.props.setFieldValue(nameof<FormValues>('promoCodeId'), promoCode.id)
        this.setState({
          discount: this.getDiscount(this.props.values.orderTotal, promoCode),
          validPromoCode: true
        })
      } else {
        this.props.setFieldValue(nameof<FormValues>('promoCodeId'), '')
        this.setState({
          discount: 0,
          validPromoCode: false
        })
      }
    }
  }

  handleCancelPromoCode = () => {
    this.props.setFieldValue(nameof<FormValues>('promoCodeId'), '')
    this.props.setFieldValue(nameof<FormValues>('promoCodeToCheck'), '')
    this.setState({
      discount: 0,
      validPromoCode: false
    })
  }

  handleBack = () => {
    // because BreadcrumbNavigation is wrapped in Memory Router to navigate outside this router routes (outside multi step form)
    // we need access to history object from main app Router.
    // Wrapping any nested component in withRouter wouldn't work because Memory Router history object would be used
    this.props.history.push(privateUrls.orders)
  }

  componentDidUpdate (prevProps: NewOrderFormViewProps) {
    const { values: prevValues } = prevProps
    const { values } = this.props
    if (prevValues.servicePackageId !== values.servicePackageId
      || prevValues.serviceIds !== values.serviceIds) {
      this.props.setFieldValue(nameof<FormValues>('orderTotal'), this.getOrderTotal(values))
    }
  }

  render () {
    const { values } = this.props
    const { realEstate: {
      city,
      country,
      street,
      zip
    }} = values
    const address = `${zip}, ${street}, ${city}, ${country}`
    const showErrorAlert = !this.props.isValid && !!this.props.submitCount
    const steps = [
      {
        label: 'Choose Service',
        render: () => (
          <>
            <ScrollToTopOnMount/>
            <Step1
              values={values}
              packageCards={this.props.servicePackages}
              addOnCards={this.addOnCards}
              adminCards={this.adminCards}
              primaryCards={this.primaryCards}
              addOnCategoriesOrder={this.props.addOnCategoriesOrder}
              primaryCategoriesOrder={this.props.primaryCategoriesOrder}
              addOnCollapsedIds={this.props.addOnCollapsedIds}
              primaryCollapsedIds={this.props.primaryCollapsedIds}
            />
          </>
        )
      },
      {
        label: 'Enter Property Details',
        render: () => (
          <>
            <ScrollToTopOnMount/>
            <Step2
              values={values}
              amenities={this.props.amenities}
              onUpdateLocation={this.handleUpdateLocation}
              agents={this.props.agents}
              isAgent={this.props.isAgent}
              country={this.props.country}
              address={address}
              onCoordinatesUpdate={c => {
                this.props.setFieldValue('realEstate.customLatitude', c.lat)
                this.props.setFieldValue('realEstate.customLongitude', c.lng)
              }}
              coordinates={{
                lat: this.props.values.realEstate.customLatitude,
                lng: this.props.values.realEstate.customLongitude
              }}
              showMap={this.props.values.realEstate.showOnMap}
            />
          </>
        )
      },
      {
        label: 'Confirm Order',
        render: () => (
          <>
            <ScrollToTopOnMount/>
            <Step3
              values={values}
              agents={this.props.agents}
              servicePackages={this.props.servicePackages}
              addOnServices={this.props.addOnServices}
              adminServices={this.adminCards}
              primaryServices={this.props.primaryServices}
              discount={this.state.discount}
              validPromoCode={this.state.validPromoCode}
              onApplyPromoCode={this.handleApplyPromoCode}
              onCancelPromoCode={this.handleCancelPromoCode}
            />
          </>
        )
      }
    ]
    const footers = [
      {
        render: () => (
          <StepFooter step={0} orderTotal={values.orderTotal} enableNext={values.serviceIds.length > 0 || !!values.servicePackageId} />
        )
      },
      {
        render: () => (
          <StepFooter step={1} />
        )
      },
      {
        render: () => (
          <StepFooter
            step={2}
            orderTotal={values.orderTotal}
            setPaymentMethod={this.props.setPaymentMethod}
          />
        )
      }
    ]
    return (
      <>
        <NavigationWarning touched={this.props.touched} />
        <BreadcrumbNavigation.Provider steps={steps} footers={footers}>
          <Grid.Wrapper as={Form}>
            <Heading hideButtons>
              <h1>Add New Order</h1>
              <div>
                <Button
                  buttonTheme='primary'
                  label='Back'
                  onClick={() => this.handleBack()}
                />
              </div>
            </Heading>
            <StyledGridLeftAside>
              <BreadcrumbNavigation.Breadcrumbs />
            </StyledGridLeftAside>
            <Grid.MainColumnFullWidth>
              <BreadcrumbNavigation.SelectedStep />
              {showErrorAlert && (
                <ValidationAlert to='1'>
                  There are some errors or omissions in Step 2 <Finger width='30' height='30' />
                </ValidationAlert>
              )}
            </Grid.MainColumnFullWidth>
            <Grid.FooterContainer>
              <BreadcrumbNavigation.SelectedFooter />
            </Grid.FooterContainer>
          </Grid.Wrapper>
        </BreadcrumbNavigation.Provider>
      </>
    )
  }
}

type RealEstateRequiredFields = Pick<FormValues['realEstate'],
  'agentPrimaryId'
  | 'city'
  | 'street'
  | 'zip'
 >

interface RequiredFields {
  realEstate: RealEstateRequiredFields
}

export const FormSchema = Yup.object().shape<RequiredFields>({
  realEstate: Yup.object().shape({
    agentPrimaryId: Yup.number().selectNumberId(),
    city:  Yup.string().required(),
    street: Yup.string().required(),
    zip:  Yup.string().required()
  })
})

const NewOrderForm = withFormik<CustomProps, FormValues>({
  handleSubmit: (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    creditCard: {
      cardNumber: '',
      CVC: '',
      expiration: ''
    },
    location: {
      dontDisplay: false,
      latLng: {
        lat: 37.09024,
        lng: -95.712891
      },
      name: 'United States',
      zoom: 3
    },
    orderTotal: 0,
    realEstate: {
      agentPrimaryId: props.agentId || unsetNumberId,
      amenities: [],
      bedrooms: 0,
      bedroomsAboveGrade: 0,
      bedroomsBelowGrade: 0,
      city: '',
      country: props.country || 'US',
      fullBathrooms: 0,
      halfBathrooms: 0,
      lockBox: false,
      occupied: true,
      showOnMap: false,
      state: props.state || 'AL',
      street: '',
      tour: {
        descriptionFull:  EditorState.createWithContent(ContentState.createFromText('Have you been searching the Internet for that perfect home? This interactive presentation has been made available by the listing agent to help you get a feel for this property and help you determine if this home could be the one! Enjoy the presentation. When you’ve completed the tour, feel free to contact your Realtor with any questions or to arrange a showing.')),
        realEstateHeadline: 'Looking for that perfect home? This could be the one!'
      },
      zip: ''
    },
    serviceIds: [],
    shippingInfo: {
      address: {
        city: '',
        country: 'US',
        state: 'AL',
        street: '',
        zip: ''
      },
      email: '',
      firstName: '',
      lastName: ''
    }
  }),
  validateOnChange: false,
  validationSchema: FormSchema
})(NewOrderFormView)

export default withRouter(NewOrderForm)
