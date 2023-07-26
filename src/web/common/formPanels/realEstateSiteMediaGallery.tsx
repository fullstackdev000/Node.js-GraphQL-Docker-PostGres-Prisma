import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import Chips, { Chip } from '#veewme/web/common/chips'
import InputField from '#veewme/web/common/formikFields/inputField'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import { StyledDescription, StyledSection } from '#veewme/web/common/formPanels/styles'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { Plus } from 'styled-icons/typicons'
import { EditAffiliateValues, RealEstateSiteMediaGalleryValues } from '../../components/affiliates/editAffiliate/types'

const StyledPanel = styled(Panel) `
  font-size: 12px;
`

export const StyledHelpWrapper = styled.div `
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
`

const StyledInputWrapper = styled.div `
  flex: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  margin-bottom: 16px;
  & > div {
    flex: 1;
    margin: 0 10px 0 0;
    & > div {
      margin: 0;
    }
  }
  input {width: 100%;}
`

const StyledChipsListLabel = styled.p `
  display: block;
  margin-top: 16px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

interface RealEstateSiteMediaGalleryProps {
  values: EditAffiliateValues
}

const RealEstateSiteMediaGallery: React.FunctionComponent<RealEstateSiteMediaGalleryProps> = props => {
  return (
    <StyledPanel
      heading='Property Site / Media Gallery'
      id='gallery'
      toggleable
    >
      <StyledSection>
        <Field
          name={nameof<RealEstateSiteMediaGalleryValues>('coverPhoto')}
          component={UploadImageField}
          fieldOrientation='landscape'
          imageType='media'
          imageFullDimensions={{ height: 500, width: 1500 }}
          label={
            <>
            Tour gallery cover photo
            <StyledDescription>
              <p>Choose the photo that will appear at the top of your gallery.</p>
              <p>Photo will be resized so that it covers a rectangle 1500x500 px, which will then be saved.</p>
            </StyledDescription>
            </>
          }
        />
      </StyledSection>
      <StyledSection>
        <FieldArray
          name={nameof<EditAffiliateValues>('featuredRealEstateSites')}
          render={ ({ push, form, remove }) => (
            <>
              <StyledInputWrapper>
                <Field
                  name={nameof<EditAffiliateValues>('featuredRealEstateSiteToAdd')}
                  component={InputField}
                  label='Featured property sites:'
                  placeholder='Add a site ID...'
                  rightComponent={
                    <StyledHelpWrapper>
                      <InlineHelp
                        text='Future feature'
                      />
                    </StyledHelpWrapper>
                  }
                />
                <Button
                  type='button'
                  full
                  buttonTheme='action'
                  icon={Plus}
                  onClick={() => {
                    if (props.values.featuredRealEstateSiteToAdd
                      && !props.values.featuredRealEstateSites.includes(props.values.featuredRealEstateSiteToAdd)) {
                      push(props.values.featuredRealEstateSiteToAdd)
                      form.setFieldValue(nameof<EditAffiliateValues>('featuredRealEstateSiteToAdd'), '')
                    }
                  }}
                />
              </StyledInputWrapper>
              <StyledChipsListLabel>IDs list:</StyledChipsListLabel>
              <Chips
                chips={props.values.featuredRealEstateSites.map(site => ({ id: site, label: site }))}
                onChipDelete={(id: Chip['id']) => {
                  const idx = props.values.featuredRealEstateSites.findIndex(site => site === id)
                  if (idx > -1) {
                    remove(idx)
                  }
                }}
              />
            </>
          )}
        />
      </StyledSection>
    </StyledPanel>
  )
}

export default RealEstateSiteMediaGallery
