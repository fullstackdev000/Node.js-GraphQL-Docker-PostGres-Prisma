import { AffiliatePhotoExportPreset } from '#veewme/lib/types'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { FieldArray } from 'formik'
import * as React from 'react'
import { useState } from 'react'
import { Edit } from 'styled-icons/boxicons-solid'
import { Clear } from 'styled-icons/material'
import { MediaExportsValues } from '../../components/affiliates/editAffiliate/types'
import ModalPreset from './photoExportPresetForm'

const StyledHeader = styled.header `
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  p {
    font-size: 13px;
    color: ${props => props.theme.colors.LABEL_TEXT};
  }
`

const StyledFormatLabel = styled.p `
  font-size: 12px;
  color: ${props => props.theme.colors.LABEL_TEXT};
`

const StyledFormatContent = styled.span `
  font-weight: 600;
  color: black;
`

const StyledWrapper = styled.div `
  display: flex;
  margin: 8px 0;
  border: 1px solid ${props => props.theme.colors.BORDER};
`

const StyledCell = styled.div `
  display: flex;
  align-items: center;
  padding: 16px;
`

const StyledNameCell = styled(StyledCell) `
  border-right: 1px solid ${props => props.theme.colors.BORDER};
  width: 130px;
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 700;
    max-width: 100%;
    font-size: 13px;
  }
`

const StyledContentCell = styled(StyledCell) `
  flex: 1;
  justify-content: space-between;
`

const StyledButtonsWrapper = styled.div `
  display: flex;
  justify-content: space-between;
  & > :first-child {
    margin-right: 8px;
  }
`

interface PhotoPresetProps {
  preset: AffiliatePhotoExportPreset
  onDelete: (id: AffiliatePhotoExportPreset['id']) => void
  onEdit: (preset: AffiliatePhotoExportPreset) => void
}

const PhotoPreset: React.FunctionComponent<PhotoPresetProps> = props => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <StyledWrapper>
      <StyledNameCell>
        <p>{props.preset.name}</p>
      </StyledNameCell>
      <StyledContentCell>
        <StyledFormatLabel>Photo export format:
          <StyledFormatContent>
            {props.preset.width} x {props.preset.height}, quality: {props.preset.resolution}
          </StyledFormatContent>
        </StyledFormatLabel>
        <StyledButtonsWrapper>
          <Button
            buttonTheme='primary'
            icon={Edit}
            onClick={() => setModalOpen(true)}
          />
          <Button
            type='button'
            buttonTheme='alert'
            icon={Clear}
            onClick={() => props.onDelete(props.preset.id)}
          />
        </StyledButtonsWrapper>
      </StyledContentCell>
      <ModalPreset
        isOpen={modalOpen}
        preset={props.preset}
        onRequestClose={() => setModalOpen(false)}
        onSubmit={(preset: AffiliatePhotoExportPreset) => {
          setModalOpen(false)
          props.onEdit(preset)
        }}
      />
    </StyledWrapper>
  )
}

interface PhotoExportsProps {
  presets: AffiliatePhotoExportPreset[]
}

const PhotoExports: React.FunctionComponent<PhotoExportsProps> = props => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Panel
      heading='Custom Photo Exports'
      id='photoExport'
      toggleable
    >
      <StyledHeader>
        <p>Photo export presets</p>
        <Button
          label='Add photo preset'
          buttonTheme='action'
          onClick={() => {
            setModalOpen(true)
          }}
        />
      </StyledHeader>
      <FieldArray
        name={nameof<MediaExportsValues>('mediaExports')}
        render={({ push, replace, remove }) => (
          <>
            {props.presets.map((preset, index) => (
              <PhotoPreset
                key={index}
                preset={preset}
                onDelete={() => { remove(index) }}
                onEdit={(updatedPreset: AffiliatePhotoExportPreset) => { replace(index, { ...updatedPreset }) }}
              />
            ))}
            <ModalPreset
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              onSubmit={(preset: AffiliatePhotoExportPreset) => {
                if (preset && preset.name.length > 0) {
                  push({
                    ...preset
                  })
                }
                setModalOpen(false)
              }}
            />
          </>
        )}
      />
    </Panel>
  )
}

export default PhotoExports
