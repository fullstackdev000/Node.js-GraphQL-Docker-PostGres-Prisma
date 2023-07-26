import * as React from 'react'
import NewOfficeForm from './newOfficeForm'
import NewOfficeValues from './newOfficeValues'

// TODO remove mockData
const mockRegionOptions = [{
  label: 'Region 1',
  value: 'Region 1'
}, {
  label: 'Region 2',
  value: 'Region 2'
}, {
  label: 'Region 3',
  value: 'Region 3'
}]

class NewOffice extends React.PureComponent<{}> {
  render () {
    return (
      <NewOfficeForm
        values={NewOfficeValues}
        regionOptions={mockRegionOptions}
      />
    )
  }
}

export default NewOffice
