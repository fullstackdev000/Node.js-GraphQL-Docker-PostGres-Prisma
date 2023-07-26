import { nameof } from '#veewme/lib/util'
import Select from '#veewme/web/common/formikFields/selectField'
import { Label } from '#veewme/web/common/formikFields/styled'
import Switch from '#veewme/web/common/formikFields/switchField'
import InlineHelp from '#veewme/web/common/inlineHelp'
import Panel, { Heading } from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { Field, FieldArray } from 'formik'
import * as React from 'react'
import { PhotoDownloadPreset, PhotoDownloadPresetValues } from './valuesInterfaces'

const PhotoDownloadPresetsPanel = styled(Panel)`
  ${Heading} {
    justify-content: flex-start;
    & > *:nth-child(2) {
      margin-left: 10px;
    }
  }
`

const PresetPanel = styled.table`
  width: 100%;
  border-spacing: 0 15px;
  td {
    padding: 20px 2%;
    border-top: 2px solid ${props => props.theme.colors.BORDER};
    border-bottom: 2px solid ${props => props.theme.colors.BORDER};
    font-size: 13px;
    color: ${props => props.theme.colors.FIELD_TEXT}
    &:first-child {
      border-left: 2px solid ${props => props.theme.colors.BORDER};
      border-right: 1px solid ${props => props.theme.colors.BORDER};
      padding-left: 3%;
    }
    &:nth-child(2) {
      text-align: center;
    }
    &:last-child {
      border-right: 2px solid ${props => props.theme.colors.BORDER};
      padding-right: 3%;
    }
  }
`

const PresetsLabel = styled(Label)`
  margin: 0;
`

const TriggerSelect = styled(Select)`
  min-width: 150px;
`

const downloadTriggers = [
  { label: 'No trigger', value: 'NOTRIGGER' },
  { label: 'Upon activation', value: 'UPONACTIVATION' }
]

interface PhotoDownloadPresetsProps {
  values: PhotoDownloadPreset[]
}

const PhotoDownloadPresets: React.FunctionComponent<PhotoDownloadPresetsProps> = props => {
  return (
    <PhotoDownloadPresetsPanel
      heading='Photo Download Presets'
      id='photoDownloadPresets'
      toggleable
      headingPlacedComponent={
        <InlineHelp
          text={`Enable custom photo sizes for agents to download.\nSet trigger to make downloads available upon activation.\nNo Trigger agent will have trigger in Media Access.`}
        />
      }
    >
      <PresetPanel>
        <tbody>
          <FieldArray
            name={nameof<PhotoDownloadPresetValues>('photoDownloadPresets')}
            render={({ push, replace, remove }) => (
              <>
                {props.values.length > 0 && props.values.map((value, idx) => (
                  <tr
                    key={idx}
                  >
                    <td>{value.photoPreset.name}</td>
                    <td>
                      <PresetsLabel>Photo export format:</PresetsLabel>
                      <div>{value.photoPreset.width}x{value.photoPreset.height}, quality: {value.photoPreset.resolution}</div>
                    </td>
                    <td>
                      <Field
                        name={`${nameof<PhotoDownloadPresetValues>('photoDownloadPresets')}[${idx}].${nameof<PhotoDownloadPreset>('enabled')}`}
                        label='Enable'
                        component={Switch}
                      />
                    </td>
                    <td>
                      <Field
                        name={`${nameof<PhotoDownloadPresetValues>('photoDownloadPresets')}[${idx}].${nameof<PhotoDownloadPreset>('downloadTrigger')}`}
                        options={downloadTriggers}
                        component={TriggerSelect}
                      />
                    </td>
                  </tr>
                ))}
              </>
            )}
          />
        </tbody>
      </PresetPanel>
    </PhotoDownloadPresetsPanel>
  )
}

export default PhotoDownloadPresets
