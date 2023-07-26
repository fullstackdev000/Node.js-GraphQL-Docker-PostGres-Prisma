import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import { Select } from '#veewme/web/common/formikFields/selectField'
import styled from '#veewme/web/common/styled-components'
import * as React from 'react'
import { DuplicateHolder, SourceWrapper } from '../../common/styled'

const DuplicateButton = styled(props => <Button {...props} />)`
  margin-left: 15px;
  margin-bottom: 15px;
`

const SelectSource = styled(props => <Select<() => void> {...props} />)`
  flex-grow: 1;
`

export interface DuplicateOptionValue {
  id: number
  service: boolean
}

interface DuplicateOption {
  label: string
  value: DuplicateOptionValue
}

export type DuplicateOptions = Array<{ label: string, value: DuplicateOptionValue}>

interface SourceProps {
  serviceOptions: DuplicateOptions
  getDuplicate?: (val: DuplicateOptionValue) => void
}

interface SourceState {
  duplicateFrom: number
}

const Source: React.FunctionComponent<SourceProps> = props => {
  const [ duplicateSource, setDuplicateSource ] = React.useState<DuplicateOptionValue>()

  return (
    <SourceWrapper>
      <DuplicateHolder>
        <SelectSource
          name={nameof<SourceState>('duplicateFrom')}
          label='Duplicate service'
          onChange={(option: DuplicateOption) => {
            setDuplicateSource(option.value)
          }}
          options={props.serviceOptions}
        />
        <DuplicateButton
          buttonTheme='info'
          full
          label='Duplicate'
          onClick={() => props.getDuplicate && duplicateSource && props.getDuplicate(duplicateSource)}
        />
      </DuplicateHolder>
    </SourceWrapper>
  )
}

export default Source
