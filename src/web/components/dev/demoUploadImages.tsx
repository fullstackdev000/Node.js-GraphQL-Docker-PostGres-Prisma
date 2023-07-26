import { AddDemoImagesMutation, AddDemoImagesMutationVariables, DemoImagesQueryVariables } from '#veewme/gen/graphqlTypes'
import { AddDemoImages, DemoImages } from '#veewme/lib/graphql/queries'
import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import UploadImageField from '#veewme/web/common/formikFields/uploadImageField'
import * as Grid from '#veewme/web/common/grid'
import Panel from '#veewme/web/common/panel'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Field, FieldArray, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

interface DemoImagesValues {
  cropImages: File[]
  id: number
  images: File[]
}
interface DemoImagesQueryValues {
  demoImages: DemoImagesValues
}
type DemoUploadImagesValues = Omit<DemoImagesValues, 'id'>
interface DemoUploadImagesCustomProps {
  fetchedImages: DemoUploadImagesValues
  onSubmit: (values: DemoUploadImagesValues) => void
}

type DemoUploadImagesProps = DemoUploadImagesCustomProps & FormikProps<DemoUploadImagesValues>

const DemoUploadImages: React.FunctionComponent<DemoUploadImagesProps> = props => {
  return (
    <Grid.Wrapper as={Form}>
      <Grid.Heading>
        <h1>Demo upload images</h1>
      </Grid.Heading>
      <Grid.MainColumn>
        <Panel>
          <FieldArray
            name={nameof<DemoUploadImagesValues>('cropImages')}
            render={({ push }) => (
              <>
                <Button
                  label='Add cropped image to upload'
                  onClick={() => push({})}
                />
                {props.values.cropImages && props.values.cropImages.map((img: any, index: number) => {
                  return (
                    <Field
                      component={UploadImageField}
                      name={`${nameof<DemoUploadImagesValues>('cropImages')}[${index}]`}
                      key={index}
                    />
                  )
                })}
              </>
            )}
          />
        </Panel>
      </Grid.MainColumn>
      <Grid.RightAside>
        <Panel>
        <FieldArray
          name={nameof<DemoUploadImagesValues>('images')}
          render={({ push }) => (
            <>
              <Button
                label='Add downsized image to upload'
                onClick={() => push({})}
              />
              {props.values.images && props.values.images.map((img: any, index: number) => {
                return (
                  <Field
                    modificationStyle='scaledown'
                    component={UploadImageField}
                    name={`${nameof<DemoUploadImagesValues>('images')}[${index}]`}
                    key={index}
                  />
                )
              })}
            </>
          )}
        />
        </Panel>
      </Grid.RightAside>
      <Grid.Footer />
    </Grid.Wrapper>
  )
}

const DemoUploadImagesForm = withFormik<DemoUploadImagesCustomProps, DemoUploadImagesValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => props.fetchedImages
})(DemoUploadImages)

const DemoUploadImagesQueries: React.FunctionComponent = () => {
  const seededDemoImagesId = 1
  const { data } = useQuery<DemoImagesQueryValues, DemoImagesQueryVariables>(DemoImages, { variables: { id: seededDemoImagesId } })
  const [ update ] = useMutation<AddDemoImagesMutation, AddDemoImagesMutationVariables>(AddDemoImages, {
    refetchQueries: ['DemoImages']
  })
  if (data && data.demoImages) {
    const { id, ...images } = data.demoImages
    return (
      <DemoUploadImagesForm
        fetchedImages={images}
        onSubmit={values => { update({ variables: { id, ...values } }).catch() }}
      />
    )
  }
  return (<></>)
}

export default DemoUploadImagesQueries
