import { nameof } from '#veewme/lib/util'
import CheckMarkSvg from '#veewme/web/assets/svg/checkmark.svg'
import Button from '#veewme/web/common/buttons/basicButton'
import { Label } from '#veewme/web/common/formikFields/styled'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import { FieldArray } from 'formik'
import * as React from 'react'
import { CounterTextDiv } from '../../common/styled'
import { FetchedService, FormValues } from '../types'
import AddServiceForm, { maxPackageServicesCount } from './addPackageServiceForm'

const Wrapper = styled.div`
  margin-bottom: 15px;
  padding: 25px 0;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};
`
const PackageHeading = styled.div`
  display: flex;

  ${Label} {
    flex: 1 1 0;
    font-weight: 500;
  }
`

const List = styled.ul`
  display: block;

  li {
    display: flex;
    align-content: center;
    justify-content: space-between;
    margin: 15px 0;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;

    &:first-child {
      padding: 5px 50px 5px 0;
      justify-content: flex-end;
      & > div {
        flex-basis: 100px;
        margin-left: 10px;
        justify-content: center;
        align-items: center;
        display: flex;
        text-align: center;
      }
    }

    &:not(:last-child):not(:first-child) {
      border: 1px solid ${props => props.theme.colors.BORDER};
    }

    &:not(:first-child) {
      &:last-child {
        margin: 0;
      }

      &:nth-last-child(2) {
        margin-bottom: 0;
      }

      & > div {
        display: flex;
        align-items: center;
        &:not(:first-child) {
          flex-shrink: 0;
          flex-grow: 0;
          margin-left: 10px;
          justify-content: center;
        }

        &:first-child {
          flex-grow: 1;
          flex-basis: 100%;
        }

        & > span {
          padding: 8px 0;
        }
      }
      &:not(:last-child) > div:last-child {
        flex-basis: 40px;
      }

      &:not(:last-child) > div:nth-last-child(2),
      &:not(:last-child) > div:nth-last-child(3) {
        flex-basis: 100px;
      }
    }
  }
`

const StyledCheckmark = styled(CheckMarkSvg)`
  width: 15px;
  height: 15px;
  margin: 0 15px;
  fill: ${props => props.theme.colors.GREEN}
`

const RemoveBtn = styled.button.attrs({
  type: 'button'
})`
  padding: 0 10px;
  background: transparent;
  border: 0 none;
  outline: 0 none;
  border-left: 1px solid ${props => props.theme.colors.BORDER};
  color: ${props => props.theme.colors.ALERT};
  font-size: 30px;
  text-align: center;
  cursor: pointer;
`

const Total = styled.li`
  padding: 5px 50px 5px 0;
  font-weight: 500;
  font-size: 14px;
  text-align: right;

  span {
    font-weight: 600;
  }
  & > div:first-child {
    justify-content: flex-end;
  }
  & > div:last-child, & > div:nth-last-child(2) {
    flex-basis: 100px;
  }
`

interface PackageServicesProps {
  values: FormValues
  services: FetchedService[]
}

interface PackageServicesState {
  modalOpen: boolean
  totalCompensation: number
  totalPrice: number
}

class PackageServices extends React.PureComponent<PackageServicesProps, PackageServicesState> {
  state = {
    modalOpen: false,
    totalCompensation: 0,
    totalPrice: 0
  }

  componentDidMount () {
    this.getPackageServicesTotalPrice()
  }

  componentDidUpdate (prevProps: PackageServicesProps) {
    const { values: { serviceIds: prevPackageServices } } = prevProps
    const { values: { serviceIds } } = this.props
    if (prevPackageServices !== serviceIds) {
      this.getPackageServicesTotalPrice()
    }
  }

  getPackageServicesTotalPrice () {
    const { values: { serviceIds: serviceIds = [] }, services } = this.props
    const denominator = 100

    const { totalCompensation, totalPrice } = services
      .filter(service => serviceIds.includes(service.id))
      .reduce((acc, service) => ({
        totalCompensation: acc.totalCompensation + service.defaultCompensation,
        totalPrice: acc.totalPrice + service.price
      }), { totalCompensation: 0, totalPrice: 0 })

    this.setState({
      totalCompensation: Math.round(totalCompensation * denominator) / denominator,
      totalPrice: Math.round(totalPrice * denominator) / denominator
    })
  }

  toggleModal = () => {
    this.setState(prev => ({
      modalOpen: !prev.modalOpen
    }))
  }

  render () {
    const { services } = this.props
    const serviceIds = this.props.values.serviceIds
    const serviceIdsLength = serviceIds.length

    return (
      <Wrapper>
        <PackageHeading>
          <Label>Package Services</Label>
          <Button buttonTheme='action' label='Add service' onClick={this.toggleModal} type='button' disabled={serviceIdsLength === maxPackageServicesCount} />
        </PackageHeading>
        <CounterTextDiv alignRight={true}>
          {`${serviceIdsLength} selected out of ${maxPackageServicesCount}`}
        </CounterTextDiv>
        <List>
          <li>
            <div><span>Default Compensation</span></div>
            <div><span>Price</span></div>
          </li>
          <FieldArray
            name={nameof<FormValues>('serviceIds')}
            render={fieldArrayHelpers => (
              <>
                {
                  services
                    .filter(service => serviceIds.includes(service.id))
                    .map((service: FetchedService, index: number) => (
                      <li key={service.id}>
                        <div>
                          <StyledCheckmark />
                          <span>{service.name}</span>
                        </div>
                        <div>
                          <span>${service.defaultCompensation.toFixed(2)}</span>
                        </div>
                        <div>
                          <span>${service.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <RemoveBtn onClick={() => fieldArrayHelpers.remove(index)}>&times;</RemoveBtn>
                        </div>
                      </li>
                    ))
                  }
                  <Modal isOpen={this.state.modalOpen} onRequestClose={this.toggleModal} title='Package Services'>
                    <AddServiceForm
                      services={services}
                      serviceIds={serviceIds}
                      onSubmit={(values: number[]) => {
                        fieldArrayHelpers.form.setFieldValue('serviceIds', values)
                        this.toggleModal()
                      }}
                    />
                  </Modal>
              </>
            )}
          />
          <Total>
            <div>Total:</div>
            <div>
              <span>${this.state.totalCompensation}</span>
            </div>
            <div>
              <span>${this.state.totalPrice}</span>
            </div>
          </Total>
        </List>
      </Wrapper>
    )
  }
}

export default PackageServices
