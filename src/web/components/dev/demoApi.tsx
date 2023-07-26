import { randomInt } from '#veewme/lib/faker'
import * as React from 'react'
import { AllDemoThingsComponent, AllDemoThingsDocument, CreateDemoThingComponent, DemoThing } from '../../../../build/gen/graphqlTypes'
import Button from '../../common/buttons/basicButton'
import styled from '../../common/styled-components'

const DemoApiWrapper = styled.div`
  padding: 15px 30px;
  & > * {
    margin: 5px;
  }
`

const AddNewThing = () => (
  <CreateDemoThingComponent refetchQueries={[AllDemoThingsDocument.definitions[0].name.value]}>
    {(submit, { data, loading, error }) => (
      <div>
        {!loading &&
          <div>
            <Button
              label='Add a thing'
              onClick={() => {
                submit({ variables: { foo: 'foo', bar: randomInt(0, 9999) } }).catch()
              }}
            />
          </div>
        }
        {error &&
          <div>Couldn't add the thing: {error}</div>
        }
        {!error && data && data.createDemoThing &&
          <div>
            Added {data.createDemoThing.foo || 'no name'} ({data.createDemoThing.bar})
          </div>
        }
      </div>
    )}
  </CreateDemoThingComponent>
)

const AllThingsList = () => (
  <AllDemoThingsComponent>
    {({ data, loading, error }) => {
      if (loading) {
        return (
          <p>Loading...</p>
        )
      } else if (error) {
        return (
          <p>Error loading data</p>
        )
      } else if (!data || !data.demoThings) {
        return (
          <p>Empty</p>
        )
      } else {
        return (
          <ul>
            {data.demoThings.filter((t): t is DemoThing => !!t).map(thing => (
              <li key={thing.id}>{thing.foo || 'no name'} {thing.bar}</li>
            ))}
          </ul>
        )
      }
    }}
  </AllDemoThingsComponent>
)

class DemoApi extends React.Component<{}> {
  render () {
    return (
      <DemoApiWrapper>
        <AddNewThing />
        <AllThingsList />
      </DemoApiWrapper>
    )
  }
}

export default DemoApi
