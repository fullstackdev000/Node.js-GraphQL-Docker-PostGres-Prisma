import { Service } from '#veewme/graphql/types'
import { DiscountExpireDate, DiscountType, PromoCodeValidity } from '#veewme/lib/types'
import * as Grid from '#veewme/web/common/grid'
import { NavHashLink } from '#veewme/web/common/hashLink'
import * as log from '#veewme/web/common/log'
import SecondaryNavigation from '#veewme/web/common/secondaryNavigation'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { StyledFormWrapper, StyledGridWrapper } from '../../common/styled'
import DiscountDetails from './discountDetails'
import ServiceDetails from './serviceDetails'

interface CustomProps {
//  onSubmit: (values: CreateService.CreateService) => void
  services: Array<Pick<Service, 'id' | 'name'>> // list of all already defined services
}

export interface FormValues {
  code: string
  serviceId?: Service['id']
  description: string
  discount: number
  discountType: DiscountType
  expireDate: DiscountExpireDate
  validity: PromoCodeValidity
}

type NewPromoCodeFormProps = FormikProps<FormValues> & CustomProps

class NewPromoCodeForm extends React.Component<NewPromoCodeFormProps, {}> {
  render () {
    const { values, services } = this.props
    return (
      <StyledFormWrapper>
        <StyledGridWrapper as={Form} >
          <Grid.Heading>
            <h1>Promo Code Profile</h1>
          </Grid.Heading>
          <Grid.LeftDesktopAside>
            <SecondaryNavigation>
              <li><NavHashLink to='#service'>Service Details</NavHashLink></li>
              <li><NavHashLink to='#discount'>Discount Details</NavHashLink></li>
            </SecondaryNavigation>
          </Grid.LeftDesktopAside>
          <Grid.MainColumn>
            <ServiceDetails
              services={services}
              values={values}
            />
            <DiscountDetails
              values={values}
            />
          </Grid.MainColumn>
          <Grid.Footer />
        </StyledGridWrapper>
      </StyledFormWrapper>
    )
  }
}

export default withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting }) => {
    log.debug('submitting: ', values)
    setSubmitting(false)
  },
  mapPropsToValues: () => ({
    code: '',
    description: '',
    discount: 0,
    discountType: 'percent',
    expireDate: new Date(),
    validity: PromoCodeValidity.Unlimited
  })
})(NewPromoCodeForm)
