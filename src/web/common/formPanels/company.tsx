import { Countries, States } from '#veewme/lib/constants'
import { nameof } from '#veewme/lib/util'
import InputField from '#veewme/web/common/formikFields/inputField'
import PhoneField from '#veewme/web/common/formikFields/phoneField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import { FieldSpanAll, StyledDescription, StyledFieldsGrid, StyledSection } from '#veewme/web/common/formPanels/styles'
import { Address } from '#veewme/web/common/formPanels/valuesInterfaces'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { AffiliateContactInfoValues, Company, EditAffiliateValues } from '../../components/affiliates/editAffiliate/types'

const helpText = `Consequat dolore dolor proident anim dolor deserunt esse irure voluptate. \nConsectetur qui do pariatur culpa deserunt est adipisicing id voluptate. \nAliqua ullamco do exercitation aliquip pariatur. \nDo et pariatur dolor anim eu proident irure in minim cupidatat qui qui nostrud est. \nSunt non dolore fugiat qui qui labore ipsum consequat esse sint qui nostrud.`

const StyledInlineHelpWrapper = styled.div `
  display: flex;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  align-items: center;
  padding: 0 5px;
`

const Company: React.FunctionComponent<{}> = () => (
  <Panel
    heading='Company'
    id='company'
    toggleable
  >
    <StyledSection>
      <StyledFieldsGrid>
        <Field
          name={nameof<Company>('companyName')}
          label='Name:'
          component={InputField}
        />
        <Field
          name={nameof<Address>('street')}
          label='Street:'
          component={InputField}
        />
        <Field
          name={nameof<Address>('city')}
          label='City:'
          component={InputField}
        />
        <Field
          name={nameof<Address>('zip')}
          label='Zip/Postal Code:'
          component={InputField}
        />
        <Field
          name={nameof<Address>('state')}
          label='State:'
          component={SelectField}
          options={States}
        />
        <Field
          name={nameof<Address>('country')}
          label='Country:'
          component={SelectField}
          options={Countries}
        />
        <Field
          name={nameof<AffiliateContactInfoValues>('phoneOffice')}
          label='Phone number:'
          component={PhoneField}
        />
        <Field
          name={nameof<AffiliateContactInfoValues>('emailOffice')}
          label='Company email:'
          component={InputField}
        />
        <Field
          name={nameof<AffiliateContactInfoValues>('website')}
          label='Company website:'
          component={InputField}
        />
        <FieldSpanAll
          label='Description:'
          component={Editor}
          name={nameof<EditAffiliateValues>('description')}
          toolbarCustomButtons={[
            <StyledInlineHelpWrapper key={0}>
              <InlineHelp
                text={helpText}
              />
            </StyledInlineHelpWrapper>
          ]}
        />
      </StyledFieldsGrid>
    </StyledSection>
    <StyledSection>
      <Field
        name={nameof<Company>('profilePicture')}
        component={UploadImageField}
        fieldOrientation='landscape'
        imageType='media'
        imageFullDimensions={{ height: 120, width: 200 }}
        label={
          <>
          Company logo
          <StyledDescription>
            <p>This image will show up as your company logo. It will be visible in the top left corner of the application for your clients.</p>
            <p>Please upload JPG or PNG files.</p>
          </StyledDescription>
          </>
        }
      />
    </StyledSection>
    <StyledSection>
      <Field
        name={nameof<EditAffiliateValues>('areasCovered')}
        label='Areas covered:'
        component={Editor}
      />
    </StyledSection>
  </Panel>
)

export default Company
