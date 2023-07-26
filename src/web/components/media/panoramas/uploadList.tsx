import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { FilepondFile } from 'react-filepond'
import { nameof } from '../../../../lib/util'
import Button from '../../../common/buttons/basicButton'
import InputField from '../../../common/formikFields/inputField'
import { Label } from '../../../common/formikFields/styled'
import InlineHelp from '../../../common/inlineHelp'
import styled from '../../../common/styled-components'
import { PanoramaToUpload, PanoramaType } from '../types'

const ItemBreakpoint = '1100px'

const Item = styled.li`
  display: flex;
  align-items: center;
  margin: 15px 0;
  min-height: 80px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  border-radius: 4px;

  img {
    width: 135px;
    height: 80px;
    object-fit: cover;
    flex: 0 0 auto;
  }
`

const MainWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  padding: 15px;
  flex-wrap: wrap;

  @media (max-width: ${ItemBreakpoint}) {
    padding: 10px 15px;
    flex-wrap: wrap;
  }
`

const ItemInfo = styled.div`
  padding-right: 20px;
  flex: 1 0 auto;

  div {
    display: block;
    margin-bottom: 2px;
    color: ${props => props.theme.colors.LABEL_TEXT};
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:first-child {
      color: ${props => props.theme.colors.FIELD_TEXT};
      text-transform: capitalize;
      font-size: 14px;
    }
  }

  @media (max-width: ${ItemBreakpoint}) {
    width: 100%;
    padding: 0 0 5px;

    div {
      display: inline-block;
      padding-right: 10px;
    }
  }
`

const ItemType = styled.div`
  padding-right: 20px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;

  label {
    width: auto;
    margin: 0 10px 0 0;
  }

  button {
    margin: 0 5px 0;

    &:last-child {
      margin: 0;
    }
  }

  @media (max-width: ${ItemBreakpoint}) {
    flex: 1 0 auto;
    padding-right: 5px;
    width: 50%;

    label {
      margin-right: 5px;
      flex: 0 0 auto;
    }
  }
`

const StyledInput = styled(InputField)`
  flex-wrap: nowrap;
  padding: 0 10px;
  align-items: center;
  flex: 0 0 220px;

  label {
     width: auto;
     margin: 0 10px 0 0;
  }

  input {
    flex: 0 1 auto;
    width: 100%;
  }

  div {
    margin-bottom: 0;
    display: flex;
    flex: 0 1 auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    flex-basis: 150px;
  }
`

const List = styled.ul`
  margin: 25px 0;
`

const MainButtons = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-right: 5px;
    flex: 0 0 auto;
  }

  div {
    flex: 0 1 auto;
    margin-left: 10px;
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.colors.LABEL_TEXT};

    span {
      color: ${props => props.theme.colors.GREEN};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    flex-wrap: wrap;

    div {
      order: -1;
      width: 100%;
      margin: 10px 0;
      flex: 1 0 auto;;
    }
  }
`

interface CustomProps {
  onSubmit: (items: PanoramaToUpload[]) => void
  handleCancel: () => void
  files: FilepondFile[]
}

interface FormValues {
  items: PanoramaToUpload[]
}

type UploadPanoramasListViewProps = FormikProps<FormValues> & CustomProps

class UploadPanoramasListView extends React.Component<UploadPanoramasListViewProps, {}> {
  componentDidUpdate (prevProps: UploadPanoramasListViewProps) {
    // Retain values of already existing items on reinitialization (to keep already changed values and prevent overwritting them with defaults).
    // TODO: can be removed when 'keepDirtyOnReinitialize' option is implemented in Formik (like in redux-form or final-form)
    // https://github.com/jaredpalmer/formik/pull/181
    const { initialValues: prevInitialValues } = prevProps
    const { initialValues: currentInitialValues } = this.props

    if (prevInitialValues !== currentInitialValues) {
      // no need to check if given item actually changed - if it exists we want to keep it and just add brand new items
      const updatedItems = currentInitialValues.items.map(initItem => ({
        ...initItem,
        ...prevProps.values.items.find(item => item.id === initItem.id)
      }))
      this.props.setValues({
        items: updatedItems
      })
    }
  }
  render () {
    const { values: { items }, submitForm, setFieldValue, handleCancel } = this.props

    return (
      <Form>
        <List>
          {
            items.map((item, i) => {
              const fieldNamePrefix = `${nameof<FormValues>('items')}[${i}]`
              const typeName = `${fieldNamePrefix}.${nameof<PanoramaToUpload>('type')}`
              const hfovName = `${fieldNamePrefix}.${nameof<PanoramaToUpload>('hfov')}`

              return (
                <Item key={item.id}>
                  <img src={item.thumb} />
                  <MainWrapper>
                    <ItemInfo>
                      <div>{item.name}</div>
                      <div>{`${(item.size / (1024 ** 2)).toFixed(2)} MB`}</div>
                    </ItemInfo>
                    <ItemType>
                      <Label>Type:</Label>
                      <Button
                        buttonTheme='action'
                        full={item.type === 'CYLINDRICAL'}
                        type='button'
                        label='Cylindrical'
                        onClick={() => setFieldValue(typeName, 'CYLINDRICAL')}
                      />
                      <Button
                        buttonTheme='action'
                        full={item.type === 'SPHERICAL'}
                        type='button'
                        label='Spherical'
                        onClick={() => setFieldValue(typeName, 'SPHERICAL')}
                      />
                    </ItemType>
                    <Field
                      name={hfovName}
                      component={StyledInput}
                      label='HFOV'
                    />
                    <InlineHelp text='Lorem ipsum dolor amet' />
                  </MainWrapper>
                </Item>
              )
            })
          }
        </List>
        <MainButtons>
          <Button full buttonTheme='action' type='button' label='Start Upload' onClick={submitForm} />
          <Button buttonTheme='primary' type='button' label='Cancel' onClick={handleCancel} />
          <div>
            <span>Note!</span> Please ensure that for each panorama you're uploading you've selected correct panorama type and horizontal field of view
            (HFOV). Otherwise, the resulting image might look subpar or distorted.
          </div>
        </MainButtons>
      </Form>
    )
  }
}

const UploadPanoramasList = withFormik<CustomProps, FormValues>({
  enableReinitialize: true,
  handleSubmit:  (values, { props, setSubmitting }) => {
    props.onSubmit(values.items)
    setSubmitting(false)
  },
  mapPropsToValues: ({ files }) => {
    const items: PanoramaToUpload[] = files.map(file => ({
      hfov: 360,
      id: file.id,
      name: file.filename,
      size: file.fileSize,
      thumb: URL.createObjectURL(file.file),
      type: 'SPHERICAL' as PanoramaType // TODO: replace with actual type  when cylindrical panorama support is added
    }))
    return {
      items
    }
  }
})(UploadPanoramasListView)

export default UploadPanoramasList
