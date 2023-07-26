import { Amenity } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import { Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import Scrollbars from 'react-custom-scrollbars'

const AmenityItem = styled.li `
  & > div {
    padding: 6px 0;
  }
`

const ButtonHolder = styled.div `
  margin-top: 15px;
`

const StyledAmenityList = styled.ul`
  width: 800px;
  margin-bottom: 20px;
  margin-right: 20px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    width: 600px;
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_MD}) {
    width: 80vw;
    grid-template-columns: repeat(3, 1fr);
  }
`

const ItemStyled = styled.span<{
  checked?: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  height: 44px;
  border-radius: 3px;
  background-color: ${props => props.checked ? props.theme.colors.GREEN : props.theme.colors.GREY};
  cursor: pointer;
  font-size: 13px;
  transition: box-shadow .5s, opacity .5s;
  text-align: center;

  &:hover {
    opacity: 0.9;
  }

  &:last-of-type {
    margin-right: 0;
  }

  ${props => props.checked && `
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.55);
  `}
`

interface CustomProps {
  onSubmit: (values: Amenity[]) => void
  amenities: Amenity[]
  selectedAmenities: Amenity[]
}

export interface SelectableAmenity {
  label: Amenity
  checked: boolean
}

interface FormValues {
  selectableAmenities: SelectableAmenity[]
}

type AddAmenitiesFormViewProps = FormikProps<FormValues> & CustomProps

type ItemProps = AddAmenitiesFormViewProps & {
  label: string
  checked?: boolean
  fieldName: string
}

const Item: React.FC<ItemProps> = props => {
  return (
    <>
      <ItemStyled
        checked={props.checked}
        onClick={() => {
          const checked = !props.checked

          props.setFieldValue(props.fieldName, checked)
        }}
      >
        {props.label}
      </ItemStyled>
    </>
  )
}

class AddAmenitiesFormView extends React.Component<AddAmenitiesFormViewProps, {}> {
  render () {
    const { values: { selectableAmenities }, submitForm } = this.props

    return (
      <Form>
        <Scrollbars
          autoHeight={true}
          autoHeightMax={`calc(85vh - 245px)`}
          autoHide={false}
          autoHeightMin='250px'
        >
            <StyledAmenityList>
              {selectableAmenities.map((sa, i) => (
                  <AmenityItem
                    key={`${sa.label}-${i}`}
                  >
                    <Item
                      {...this.props}
                      checked={sa.checked}
                      label={sa.label}
                      fieldName={`${nameof<FormValues>('selectableAmenities')}[${i}].checked`}
                    />
                  </AmenityItem>
                ))
              }
            </StyledAmenityList>
        </Scrollbars>
        <ButtonHolder>
          <Button full buttonTheme='action' type='button' label='Add Amenities' onClick={submitForm} />
        </ButtonHolder>
      </Form>
    )
  }
}

const AddAmenitiesForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { props }) => {
    const amenities = values.selectableAmenities.filter(sa => sa.checked).map<Amenity>(sa => sa.label)
    props.onSubmit(amenities)
  },
  mapPropsToValues: props => ({
    selectableAmenities: props.amenities.map<SelectableAmenity>(amenity => ({
      checked: props.selectedAmenities.some(sa => sa === amenity),
      label: amenity
    }))
  })
})(AddAmenitiesFormView)

export default AddAmenitiesForm
