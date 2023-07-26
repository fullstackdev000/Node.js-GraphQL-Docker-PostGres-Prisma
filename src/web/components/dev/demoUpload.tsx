import * as React from 'react'
import { DemoUploadComponent } from '../../../../build/gen/graphqlTypes'
import Button from '../../common/buttons/basicButton'
import styled from '../../common/styled-components'

const Wrapper = styled.div`
  padding: 30px;

  button {
    margin-top: 20px;
  }
`

// more examples (<input>) https://github.com/jaydenseric/apollo-upload-client

const UploadExample: React.FunctionComponent = () => {
  return (
    <Wrapper>
      <DemoUploadComponent>
        {(submit, { data, loading, error }) => (
          <div>
            {!loading &&
              <div>
                <Button
                  label='Upload some file'
                  onClick={() => {
                    const file = new Blob(['test file'], { type: 'text/plain' })
                    submit({ variables: { data: file } }).catch()
                  }}
                />
              </div>
            }
            {error &&
              <div>Upload error: {error}</div>
            }
            {!error && data && data.demoUpload &&
              <div>
                Url: <a href={data.demoUpload}>{data.demoUpload}</a>
              </div>
            }
          </div>
        )}
      </DemoUploadComponent>
    </Wrapper>
  )
}

export default UploadExample
