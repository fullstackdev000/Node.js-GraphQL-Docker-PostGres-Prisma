import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import SelectField from '#veewme/web/common/formikFields/selectField'
// import * as log from '#veewme/web/common/log'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

/* START of Form*/
const FieldsWrapper = styled.div`
  margin: 10px 0 25px;
  display: flex;
  justify-content: space-between;
`

const StyledForm = styled(Form)`
`

const ItemPrice = styled.span`
  margin-left: 10px;
  align-self: center;
`

const BottomHolder = styled.div`
  div {
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
    font-weight: 500;
  }

  p {
    margin-top: 35px;
    padding-top: 15px;
    border-top: 1px solid ${props => props.theme.colors.BORDER};
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-size: 11px;
  }
`

const StyledSelect = styled(SelectField)<{
  isTour: boolean
}>`
  display: flex;

  label {
    display: inline-block;
    flex: 0 0 60px;
    padding: 3px 7px 0 7px;
    margin: 0 10px 0 0;
    background: ${props => props.isTour ? props.theme.colors.GREEN : props.theme.colors.BLUE};
    color: #fff;
    border-radius: 3px;
    text-align: left;
    line-height: 12px;
    font-size: 12px;
  }

  && label + div {
    flex: 0 0 170px;
    margin-bottom: 0;

    > div {
      border-color: ${props => props.isTour ? props.theme.colors.GREEN : props.theme.colors.BLUE};
    }
  }
`

const TourSelect = styled(StyledSelect).attrs({
  isTour: true
})``

const MediaSelect = styled(StyledSelect).attrs({
  isTour: false
})``

interface CustomProps {
  onSubmit: (totalPrice: number) => void
}

interface FormValues {
  tourCreditsPrice: number
  mediaCreditsPrice: number
}

type CreditsPurchaseFormViewProps = FormikProps<FormValues> & CustomProps

const CreditsPurchaseFormView: React.FunctionComponent<CreditsPurchaseFormViewProps> = props => {
  const totalPrice = props.values.tourCreditsPrice + props.values.mediaCreditsPrice
  return (
    <StyledForm>
      <FieldsWrapper>
        <Field
          name={`${nameof<FormValues>('tourCreditsPrice')}`}
          component={TourSelect}
          label='Tour Credits'
          options={[{
            label: '0 credits',
            value: 0
          }, {
            label: '20 pack - $13/Credit',
            value: 260
          }, {
            label: '50 pack - $10/Credit',
            value: 500
          }]}
        />
        <ItemPrice>${props.values.tourCreditsPrice.toFixed(2)}</ItemPrice>
      </FieldsWrapper>
      <FieldsWrapper>
        <Field
          name={`${nameof<FormValues>('mediaCreditsPrice')}`}
          component={MediaSelect}
          label='Media Credits'
          options={[{
            label: '0 credits',
            value: 0
          }, {
            label: '20 pack - $13/Credit',
            value: 260
          }, {
            label: '50 pack - $10/Credit',
            value: 500
          }]}
        />
        <ItemPrice>${props.values.mediaCreditsPrice.toFixed(2)}</ItemPrice>
      </FieldsWrapper>
      <BottomHolder>
          <div>
             Total: ${totalPrice.toFixed(2)}
          </div>
          <div>
            <Button
              full
              buttonTheme='info'
              type='button'
              label='Purchase'
              onClick={props.submitForm}
              disabled={!totalPrice}
            />
          </div>
          <p>Note! Credits are not refundable.</p>
      </BottomHolder>
    </StyledForm>
  )
}

export const CreditsPurchaseForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { props }) => {
    const totalPrice = values.tourCreditsPrice + values.mediaCreditsPrice
    props.onSubmit(totalPrice)
  },
  mapPropsToValues: props => ({
    mediaCreditsPrice: 0,
    tourCreditsPrice: 0
  })
})(CreditsPurchaseFormView)
/* END of Form*/

interface CreditsPurchaseModalProps extends CustomProps {
  isOpen: boolean
  onRequestClose: () => void
}

const CreditsPurchaseModal: React.FunctionComponent<CreditsPurchaseModalProps> = props => {

  return (
    <Modal
      centerVertically
      fullSide={true}
      title='Credit Purchase'
      isOpen={props.isOpen}
      onRequestClose={() => props.onRequestClose()}
    >
      <CreditsPurchaseForm
        onSubmit={vals => {
          props.onSubmit(vals)
          props.onRequestClose()
        }}
      />
    </Modal>
  )
}

export default CreditsPurchaseModal
