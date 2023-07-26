import { AffiliatePhotoExportPreset } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import { StyledFieldsGrid } from '#veewme/web/common/formPanels/styles'
import Modal from '#veewme/web/common/modal'
import styled from '#veewme/web/common/styled-components'
import { StyledHeader } from '#veewme/web/components/dashboard/dateChartStatsBox'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

const StyledWrapper = styled.div `
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const StyledComment = styled.div `
  font-size: 13px;
  font-weight: 400;
  color: ${props => props.theme.colors.DARK_GREY};
`

const StyledFooter = styled.footer `
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`

interface CustomProps {
  preset?: AffiliatePhotoExportPreset
  onSubmit: (preset: AffiliatePhotoExportPreset) => void
}

type PhotoExportPresetViewProps = FormikProps<AffiliatePhotoExportPreset> & CustomProps

const PhotoExportPresetView: React.FunctionComponent<PhotoExportPresetViewProps> = props => (
  <Form>
    <StyledWrapper>
      <StyledHeader>
        <p>Photo Preset</p>
      </StyledHeader>
      <Field
        name={nameof<AffiliatePhotoExportPreset>('name')}
        label='Name:'
        component={InputField}
      />
      <StyledFieldsGrid>
        <Field
          name={nameof<AffiliatePhotoExportPreset>('width')}
          label='Photo width (pixels):'
          component={InputField}
          type='number'
        />
        <Field
          name={nameof<AffiliatePhotoExportPreset>('height')}
          label='Photo height (pixels):'
          component={InputField}
          type='number'
        />
        <Field
          name={nameof<AffiliatePhotoExportPreset>('resolution')}
          label='Photo quality:'
          component={InputField}
          type='number'
        />
      </StyledFieldsGrid>
      <StyledFooter>
        <StyledComment>
          <p>Note!<br />The higher the quality the larger the file size.</p>
          <p>Most frequently used is a happy medium of 75</p>
        </StyledComment>
        <Button full buttonTheme='action' type='button' label='Confirm' onClick={props.submitForm} />
      </StyledFooter>
    </StyledWrapper>
  </Form>
)

const defaultValues: AffiliatePhotoExportPreset = {
  height: 600,
  name: '',
  resolution: 75,
  width: 800
}

const PhotoExportPresetForm = withFormik<CustomProps, AffiliatePhotoExportPreset>({
  handleSubmit:  (values, { props }) => {
    props.onSubmit(values)
  },
  mapPropsToValues: props => ({
    ...defaultValues,
    ...props.preset
  })
})(PhotoExportPresetView)

interface ModalPresetProps {
  preset?: AffiliatePhotoExportPreset
  isOpen: boolean
  onRequestClose: () => void
  onSubmit: (preset: AffiliatePhotoExportPreset) => void
}

const ModalPreset: React.FunctionComponent<ModalPresetProps> = props => (
  <Modal
    isOpen={props.isOpen}
    onRequestClose={props.onRequestClose}
  >
    <PhotoExportPresetForm
      preset={props.preset}
      onSubmit={(preset: AffiliatePhotoExportPreset) => {
        props.onSubmit(preset)
      }}
    />
  </Modal>
)

export default ModalPreset
