import { nameof } from '#veewme/lib/util'
import { templateOptions } from '#veewme/web/common/consts'
import ColorField from '#veewme/web/common/formikFields/colorField'
import SelectField from '#veewme/web/common/formikFields/selectField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field } from 'formik'
import * as React from 'react'
import { TourTemplate } from './valuesInterfaces'

const ColorLabel = styled.div`
  span {
    display: block;
    font-size: 14px;
    font-weight: 500;
  }

  span + span {
    margin-top: 2px;
    font-size: 11px;
    font-weight: 400;
  }
`

const Hint = styled.p`
  font-size: 14px;
  color: ${p => p.theme.colors.LABEL_TEXT};

  strong {
    font-weight: 500;
  }
`

interface TourTemplateProps {
  hideColorField?: boolean
  templateRequired?: boolean
  agentTemplateHint?: JSX.Element
}

const TourTemplate: React.FunctionComponent<TourTemplateProps> = props => {
  const { agentTemplateHint, templateRequired = true } = props
  const colorLabel = (
    <ColorLabel>
      <span>Change template color</span>
      <span>Applies also to select property flyers</span>
    </ColorLabel>
  )

  return (
    <Panel heading='Change Property Site/Tour template'>
      {agentTemplateHint && <Hint>{agentTemplateHint}</Hint>}
      <div>
        <Field
          name={nameof<TourTemplate>('templateId')}
          component={SelectField}
          label='Select'
          options={templateOptions}
          required={templateRequired}
        />
      </div>
      {!props.hideColorField && (
        <div>
          <Field
            name={nameof<TourTemplate>('tourColor')}
            component={ColorField}
            position='left'
            label={colorLabel}
            options={templateOptions}
          />
        </div>
      )}

    </Panel>
  )
}

export default TourTemplate
