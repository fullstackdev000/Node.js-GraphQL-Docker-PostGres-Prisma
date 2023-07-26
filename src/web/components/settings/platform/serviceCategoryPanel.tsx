import { ServiceCategory } from '#veewme/gen/graphqlTypes'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import Chips, { Chip } from '#veewme/web/common/chips'
import ColorField from '#veewme/web/common/formikFields/colorField'
import InputField from '#veewme/web/common/formikFields/inputField'
import RadioField from '#veewme/web/common/formikFields/radioInputField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { guidGenerator } from '#veewme/web/common/util'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { Plus } from 'styled-icons/fa-solid'
import { getServiceCategoryIcon } from '../../services/common/util'
import { FormValues } from './form'
import { StyledSection } from './styled'

const StyledFieldsGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 8px;
`

const InlineFields = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`

const RadioButtonsLabel = styled.h5 `
  width: 100%;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.LABEL_TEXT};
  margin: 10px 0;
`

const StyledIcon = styled(props => <props.icon className={props.className}/>) `
  width: 24px;
  height: 24px;
  fill: ${props => props.theme.colors.LABEL_TEXT};
`

interface ServiceCategoryPanelProps {
  values: FormValues
}

const ServiceCategoryPanel: React.FunctionComponent<ServiceCategoryPanelProps> = props => (
  <Panel
    heading='Service Categories'
    toggleable
  >
    <FieldArray
      name={nameof<FormValues>('serviceCategories')}
      render={ ({ push, form, remove }) => (
        <>
          <StyledSection>
            <Field
              name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('label')}`}
              component={InputField}
              label='Category name:'
            />
            <div>
              <RadioButtonsLabel>Category icon:</RadioButtonsLabel>
              <StyledFieldsGrid>
                <Field
                  name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('icon')}`}
                  component={RadioField}
                  size='xs'
                  label={<StyledIcon icon={getServiceCategoryIcon('Aerial')}/>}
                  value={'Aerial'}
                />
                <Field
                  name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('icon')}`}
                  component={RadioField}
                  size='xs'
                  label={<StyledIcon icon={getServiceCategoryIcon('Photo')}/>}
                  value={'Photo'}
                />
                <Field
                  name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('icon')}`}
                  component={RadioField}
                  size='xs'
                  label={<StyledIcon icon={getServiceCategoryIcon('Video')}/>}
                  value={'Video'}
                />
                <Field
                  name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('icon')}`}
                  component={RadioField}
                  size='xs'
                  label={<StyledIcon icon={getServiceCategoryIcon('FloorPlan')}/>}
                  value={'FloorPlan'}
                />
                <Field
                  name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('icon')}`}
                  component={RadioField}
                  size='xs'
                  label={<StyledIcon icon={getServiceCategoryIcon('Landscape')}/>}
                  value={'Landscape'}
                />
                <Field
                  name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('icon')}`}
                  component={RadioField}
                  size='xs'
                  label={<StyledIcon icon={getServiceCategoryIcon('Panorama')}/>}
                  value={'Panorama'}
                />
                <Field
                  name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('icon')}`}
                  component={RadioField}
                  size='xs'
                  label={<StyledIcon icon={getServiceCategoryIcon('Vr3D')}/>}
                  value={'Vr3D'}
                />
              </StyledFieldsGrid>
            </div>
            <InlineFields>
              <Field
                name={`${nameof<FormValues>('serviceCategoryToAdd')}.${nameof<ServiceCategory>('color')}`}
                component={ColorField}
                label='Category icon color:'
              />
              <Button
                type='button'
                full
                buttonTheme='action'
                icon={Plus}
                onClick={() => {
                  if (props.values.serviceCategoryToAdd.label.length > 0 && props.values.serviceCategoryToAdd.icon) {
                    push({
                      color: props.values.serviceCategoryToAdd.color,
                      icon: props.values.serviceCategoryToAdd.icon,
                      id: guidGenerator(),
                      label: props.values.serviceCategoryToAdd.label
                    })
                    form.setFieldValue(nameof<FormValues>('serviceCategoryToAdd'), {
                      color: {
                        a: 1,
                        b: 255,
                        g: 166,
                        r: 61
                      },
                      icon: 'Aerial',
                      id: '',
                      label: ''
                    })
                  }
                }}
              />
            </InlineFields>
          </StyledSection>
          <Chips
            chips={props.values.serviceCategories.map(cat => ({ id: cat.id, label: cat.label }))}
            onChipDelete={(id: Chip['id']) => {
              const idx = props.values.serviceCategories.findIndex(chip => chip.id === id)
              if (idx > -1) {
                remove(idx)
              }
            }}
          />
        </>
      )}
    />
  </Panel>
)

export default ServiceCategoryPanel
