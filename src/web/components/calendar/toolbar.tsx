import { Select } from '#veewme/web/common/formikFields/selectField'
import FullScreenButton from '#veewme/web/common/fullScreenButton'
// import * as log from '#veewme/web/common/log'
import React from 'react'
import Photographers from './photographers'
import { GlobalFullScreenStyle, ToolbarBottom, ToolbarTop } from './styled'
import { CalendarPhotographer, Regions } from './types'

const timezoneOptions = [{
  label: 'Local (default)',
  value: 'local'
}, {
  label: 'Atlantic',
  value: 'Canada/Atlantic'
}, {
  label: 'Eastern',
  value: 'US/Eastern'
}, {
  label: 'Central',
  value: 'US/Central'
}, {
  label: 'Mountain',
  value: 'US/Mountain'
}, {
  label: 'Pacific',
  value: 'US/Pacific'
}, {
  label: 'Alaska',
  value: 'US/Alaska'
},{
  label: 'Hawaii',
  value: 'US/Hawaii'
}]

type RegionId = Regions[0]['id']

interface CalendarToolbarProps {
  photographers: CalendarPhotographer[]
  setPhotographers: (photographers: CalendarPhotographer[]) => void
  timezone: string
  setTimezone: (timezone: string) => void
  regions: Regions
  regionId: RegionId
  setRegion: (RegionId: number) => void
}

const CalendarToolbar: React.FunctionComponent<CalendarToolbarProps> = props => {

  return (
    <>
      <ToolbarTop>
        <Photographers
          photographers={props.photographers}
          setPhotographers={props.setPhotographers}
        />
        <div>
          <FullScreenButton
            elementSelector='body'
            globalStyleComponent={<GlobalFullScreenStyle />}
          />
        </div>
      </ToolbarTop>
      <ToolbarBottom>
        <Select
          options={timezoneOptions}
          onChange={selected => {
            selected && props.setTimezone(selected.value)
          }}
          value={props.timezone}
          label='Select Time Zone'
        />
        <Select
          options={props.regions.map(r => ({
            label: r.label,
            value: r.id
          }))}
          onChange={selected => {
            selected && props.setRegion(selected.value)
          }}
          value={props.regionId}
          label='Select Region'
        />
      </ToolbarBottom>
    </>
  )
}

export default CalendarToolbar
