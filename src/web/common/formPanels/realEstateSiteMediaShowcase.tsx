import { nameof } from '#veewme/lib/util'
import SwitchField from '#veewme/web/common/formikFields/switchField'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { AgentValues, RealEstateSiteMediaShowcase } from './valuesInterfaces'

const StyledPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const RealEstateSiteMediaShowcase: React.FunctionComponent<{}> = () => {
  return (
    <StyledPanel
      heading='Property Site / Media Showcase'
      id='realEstateSiteMediaShowcase'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text={
            'A web page gallery displaying all agent property sites / tours,\n'
            + 'including pending and sold ones. Can also include other media\n'
            + 'such as (community or neighborhood) videos.'
          }
        />
      }
    >
      <Field
        name={`${nameof<AgentValues>('coverPhoto')}`}
        component={UploadImageField}
        fieldOrientation='landscape'
        imageType='media'
        imageFullDimensions={{ height: 500, width: 1500 }}
        label='Choose the top banner photo / image that will appear top of the Showcase page. Image size 1500x500 pixels'
        switchField={<Field
          component={SwitchField}
          name={`${nameof<RealEstateSiteMediaShowcase>('showRealEstateMapOnShowcasePage')}`}
          label='Show property map on Showcase page'
        />}
      />
    </StyledPanel>
  )
}

export default RealEstateSiteMediaShowcase
