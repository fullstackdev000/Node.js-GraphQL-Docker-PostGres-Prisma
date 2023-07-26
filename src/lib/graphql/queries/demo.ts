import gql from 'graphql-tag'

export const DemoImages = gql`
  query DemoImages($id: Int!) {
    demoImages(where: { id: $id }) {
      id
      images {
        id
        filename
        path
      }
      cropImages {
        id
        filename
        path
      }
    }
  }
`

export const AddDemoImages = gql`
  mutation AddDemoImages(
    $id: Int!
    $images: [Upload!]!
    $cropImages: [Upload!]!
  ) {
    addDemoImages(
      data: {
        images: $images
        cropImages: $cropImages
      }
      where: { id: $id }
    ) {
      id
    }
  }
`

export const CreateDemoThing = gql`
  mutation createDemoThing($foo: String, $bar: Int!) {
    createDemoThing(data: {
      foo: $foo
      bar: $bar
    }) {
      id
      foo
      bar
    }
  }
`

export const AllDemoThings = gql`
  query allDemoThings {
    demoThings {
      id
      foo
      bar
    }
  }
`

export const DemoUpload = gql`
  mutation DemoUpload($data: Upload!) {
    demoUpload(data: $data)
  }
`

export const ReportPDF = gql`
  query demoReportPDF {
    demoReportPDF {
      url
    }
  }
`

export const RealEstateForDemoPhotosUpload = gql`
  query realEstateForDemoPhotosUpload {
    realEstates(first: 1) {
      id
    }
  }
`
