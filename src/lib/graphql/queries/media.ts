import gql from 'graphql-tag'

export const MediaAccessPhotosQuery = gql`
  query MediaAccessPhotos($realEstateId: Int!) {
    photos(where: { realEstateId: $realEstateId }, orderBy: realEstateOrder_ASC) {
      fullUrl
      id
      thumbUrl
      webUrl
    }
  }
`

export const MediaManagementPhotosQuery = gql`
  query MediaManagementPhotos($realEstateId: Int!) {
    photos(where: { realEstateId: $realEstateId }, orderBy: realEstateOrder_ASC) {
      id
      title
      thumbUrl
      fullUrl
      hidden
      star
      date
      createdAt
      fileName
    }
  }
`

export const MediaManagementDocumentsQuery = gql`
  query MediaManagementDocuments($realEstateId: Int!) {
    mediaDocuments(where: { realEstateId: { id: $realEstateId } }) {
      id
      label
      extension
      size
    }
  }
`

export const MediaAccessDocumentsQuery = gql`
  query MediaAccessDocuments($realEstateId: Int!) {
    mediaDocuments(where: { realEstateId: { id: $realEstateId } }) {
      id
      label
      extension
      size
      downloadUrl
    }
  }
`

export const MediaDocumentFormInitialDataQuery = gql`
  query MediaDocumentFormInitialData($id: Int!) {
    mediaDocument(where: { id: $id }) {
      id
      label
      appearance
      downloadUrl
    }
  }
`

export const UpdateMediaDocument = gql`
  mutation UpdateMediaDocument(
    $id: Int!
    $label: String!
    $appearance: Appearance!
  ) {
    updateMediaDocument(data: {
      label: $label
      appearance: $appearance
    }
    where: { id: $id }) {
      id
    }
  }
`

export const UploadRealEstatePhoto = gql`
  mutation UploadRealEstatePhoto(
    $file: Upload!
    $photoIdentification: String!
    $realEstateId: Int!
  ) {
    uploadRealEstatePhoto(data: {
      file: $file
      photoIdentification: $photoIdentification
      realEstateId: $realEstateId
    }) {
      id
    }
  }
`

export const UploadRealEstatePhotoProgress = gql`
  subscription UploadRealEstatePhotoProgress(
    $realEstateId: Int!
  ) {
    uploadRealEstatePhotoProgress(where: {
      realEstateId: $realEstateId
    }) {
      photoIdentification
      progress
      realEstateId
    }
  }
`

export const DeletePhotos = gql`
  mutation DeletePhotos(
    $ids: [Int!]!
  ) {
    deleteManyPhotos(ids: $ids)
  }
`

export const UpdatePhotos = gql`
  mutation UpdatePhotos(
    $ids: [Int!]!
    $hidden: Boolean
    $featured: Boolean
    $title: String
  ) {
    updateManyPhotos(
      ids: $ids
      data: {
        hidden: $hidden
        featured: $featured
        title: $title
      }
    )
  }
`

export const ReorderPhotos = gql`
  mutation ReorderPhotos(
    $ids: [Int!]!
  ) {
    reorderPhotos(
      ids: $ids
    ) {
      id
    }
  }
`

export const MediaManagementInteractives = gql`
  query MediaManagementInteractives($realEstateId: Int!) {
    mediaInteractives(where: { realEstate: { id: $realEstateId } }) {
      id
      label
      type
    }
  }
`

export const CreateInteractive = gql`
  mutation CreateMediaInteractive(
    $label: String!
    $appearance: Appearance!
    $embeddedCode: String
    $files: [MediaInteractiveCreateFileInput!]
    $type: MediaInteractiveType!
    $url: String
    $realEstateId: Int!
    $theaterMode: Boolean
  ) {
    createMediaInteractive(data: {
      label: $label
      appearance: $appearance
      embeddedCode: $embeddedCode
      url: $url
      type: $type
      realEstateId: $realEstateId
      files: $files,
      theaterMode: $theaterMode
    }) {
      id
    }
  }
`

export const MediaManagementInteractive = gql`
  query MediaManagementInteractive($id: Int!) {
    mediaInteractive(id: $id) {
      id
      label
      appearance
      url
      embeddedCode
      theaterMode
      type
      files {
        id
        file {
          path
        }
        label
      }
    }
  }
`

export const UpdateMediaInteractive = gql`
  mutation UpdateMediaInteractive(
    $label: String!
    $appearance: Appearance!
    $embeddedCode: String
    $files: [MediaInteractiveUpdateFileInput!]
    $type: MediaInteractiveType!
    $url: String
    $id: Int!
    $theaterMode: Boolean
  ) {
    updateMediaInteractive(data: {
      label: $label
      appearance: $appearance
      embeddedCode: $embeddedCode
      url: $url
      type: $type
      files: $files
      theaterMode: $theaterMode
    }, where: { id: $id }) {
      id
    }
  }
`

export const DeleteMediaInteractive = gql`
  mutation DeleteMediaInteractive(
    $id: Int!
  ) {
    deleteMediaInteractive(where: { id: $id }) {
      id
    }
  }
`

export const MediaManagementPanoramas = gql`
  query MediaManagementPanoramas($realEstateId: Int!) {
    panoramas(where: { realEstate: { id: $realEstateId } }, orderBy: realEstateOrder_ASC) {
      id
      title
      initialZoom
      date
      fileName
      fullUrl
      thumbUrl
      theaterMode
    }
  }
`

export const UpdatePanorama = gql`
  mutation UpdatePanorama(
    $id: Int!
    $title: String
    $initialZoom: Float
    $initialVerticalAngle: Float
    $initialHorizontalAngle: Float
    $theaterMode: Boolean
  ) {
    updatePanorama(
      data: {
        title: $title
        theaterMode: $theaterMode
        initialZoom: $initialZoom
        initialVerticalAngle: $initialVerticalAngle
        initialHorizontalAngle: $initialHorizontalAngle
      }
      where: {
        id: $id
      }
    ) {
      id
    }
  }
`

export const ReorderPanoramas = gql`
  mutation ReorderPanoramas(
    $ids: [Int!]!
  ) {
    reorderPanoramas(
      ids: $ids
    ) {
      id
    }
  }
`

export const MediaAccessInteractives = gql`
  query MediaAccessInteractives($realEstateId: Int!) {
    mediaInteractives(where: { realEstate: { id: $realEstateId } }) {
      id
      label
      url
      embeddedCode
      type
    }
  }
`

export const UploadPanorama = gql`
  mutation UploadPanorama(
    $file: Upload!
    $photoIdentification: String!
    $realEstateId: Int!
    $hfov: Float
    $initialHorizontalAngle: Float
    $initialVerticalAngle: Float
    $initialZoom: Float
    $type: PanoramaType!
  ) {
    uploadRealEstatePanorama(data: {
      file: $file
      photoIdentification: $photoIdentification
      realEstateId: $realEstateId
      hfov: $hfov
      initialHorizontalAngle: $initialHorizontalAngle
      initialVerticalAngle: $initialVerticalAngle
      initialZoom: $initialZoom
      type: $type
    }) {
      id
    }
  }
`

export const DeletePanorama = gql`
  mutation DeletePanorama(
    $id: Int!
  ) {
    deletePanorama(where: {id: $id}) {
      id
    }
  }
`

export const Panorama = gql`
  query Panorama($id: Int!) {
    panorama(where: { id: $id }) {
      id
      initialZoom
      initialVerticalAngle
      initialHorizontalAngle
      fullUrl
      theaterMode
      hfov
    }
  }
`

export const MediaManagementVideos = gql`
  query MediaManagementVideos($realEstateId: Int!) {
    videos(where: { realEstate: { id: $realEstateId } }, orderBy: realEstateOrder_ASC) {
      appearance
      category
      date
      fileName
      id
      label
      type
      url
      embeddedCode
      photos {
        id
        thumbUrl
      }
      thumbId
      thumbUrl
    }
  }
`

export const MediaAccessVideos = gql`
  query MediaAccessVideos($realEstateId: Int!) {
    videos(where: { realEstate: { id: $realEstateId } }, orderBy: realEstateOrder_ASC) {
      id
      appearance
      category
      fileName
      id
      label
      type
      url
      embeddedCode
    }
  }
`

export const ReorderVideos = gql`
  mutation ReorderVideos(
    $ids: [Int!]!
  ) {
    reorderVideos(
      ids: $ids
    ) {
      id
    }
  }
`

export const DeleteVideo = gql`
  mutation DeleteVideo(
    $id: Int!
  ) {
    deleteVideo(where: {id: $id}) {
      id
    }
  }
`

export const AddEmbedVideo = gql`
  mutation AddEmbedVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $embeddedCode: String!
    $category: VideoCategory
    $realEstateId: Int!
  ) {
    createVideoEmbed(data: {
      label: $label
      appearance: $appearance
      embeddedCode: $embeddedCode
      theaterMode: $theaterMode
      realEstateId: $realEstateId
      category: $category
    }) {
      id
    }
  }
`

export const AddUrlVideo = gql`
  mutation AddUrlVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $url: String!
    $category: VideoCategory
    $realEstateId: Int!
  ) {
    createVideoUrl(data: {
      label: $label
      appearance: $appearance
      url: $url
      theaterMode: $theaterMode
      realEstateId: $realEstateId
      category: $category
    }) {
      id
    }
  }
`

export const MediaManagementVideo = gql`
  query MediaManagementVideo($id: Int!) {
    video(where: { id: $id }) {
      label
      appearance
      url
      theaterMode
      id
      category
      embeddedCode
      generateOption
      overview
      thumbId
    }
  }
`

export const EditUrlVideo = gql`
  mutation EditUrlVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $url: String!
    $category: VideoCategory
    $id: Int!
  ) {
    updateVideoUrl(data: {
      label: $label
      appearance: $appearance
      url: $url
      theaterMode: $theaterMode
      category: $category
    }
    where: {
      id: $id
    }
    ) {
      id
    }
  }
`

export const EditEmbedVideo = gql`
  mutation EditEmbedVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $embeddedCode: String!
    $category: VideoCategory
    $id: Int!
  ) {
    updateVideoEmbed(data: {
      label: $label
      appearance: $appearance
      embeddedCode: $embeddedCode
      theaterMode: $theaterMode
      category: $category
    }
    where: {
      id: $id
    }) {
      id
    }
  }
`

export const AddFauxVideo = gql`
  mutation AddFauxVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $category: VideoCategory
    $realEstateId: Int!
    $includeCaptions: Boolean
    $generateOption: GenerateOption!
    $photos: [Int!]!
    $slideDuration: Int!
    $slideTransition: SlideTransition!
    $audio: String
    $thumbId: Int
  ) {
    createVideoFaux(data: {
      label: $label
      appearance: $appearance
      theaterMode: $theaterMode
      realEstateId: $realEstateId
      category: $category
      includeCaptions: $includeCaptions
      generateOption: $generateOption
      photos: $photos
      slideDuration: $slideDuration
      slideTransition: $slideTransition
      audio: $audio
      thumbId: $thumbId
    }) {
      id
    }
  }
`

export const EditFauxVideo = gql`
  mutation EditFauxVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $category: VideoCategory
    $generateOption: GenerateOption!
    $id: Int!
  ) {
    updateVideoFaux(data: {
      label: $label
      appearance: $appearance
      theaterMode: $theaterMode
      category: $category
      generateOption: $generateOption
    }
    where: {
      id: $id
    }) {
      id
    }
  }
`

export const AddHostedVideo = gql`
  mutation AddHostedVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $file: Upload!
    $category: VideoCategory
    $realEstateId: Int!
    $overview: Boolean
    $photoIdentification: String!
    $thumbId: Int
  ) {
    createVideoHosted(data: {
      label: $label
      appearance: $appearance
      file: $file
      theaterMode: $theaterMode
      realEstateId: $realEstateId
      category: $category
      overview: $overview
      photoIdentification: $photoIdentification
      thumbId: $thumbId
    }) {
      id
    }
  }
`
export const EditHostedVideo = gql`
  mutation EditHostedVideo(
    $label: String!
    $appearance: Appearance!
    $theaterMode: Boolean
    $category: VideoCategory
    $id: Int!
    $overview: Boolean
    $thumbId: Int
  ) {
    updateVideoHosted(data: {
      label: $label
      appearance: $appearance
      theaterMode: $theaterMode
      category: $category
      overview: $overview
      thumbId: $thumbId
    }
    where: {
      id: $id
    }) {
      id
    }
  }
`

export const UploadMediaDocument = gql`
  mutation UploadMediaDocument(
    $file: Upload!
    $photoIdentification: String!
    $realEstateId: Int!
    $appearance: Appearance
    $label: String
  ) {
    uploadMediaDocument(data: {
      file: $file
      photoIdentification: $photoIdentification
      realEstateId: $realEstateId
      appearance: $appearance
      label: $label
    }) {
      id
    }
  }
`

export const DeleteDocument = gql`
  mutation DeleteDocument (
    $id: Int!
  ) {
    deleteMediaDocument(where: { id: $id }) {
      id
    }
  }
`

export const Flyer = gql`
  query Flyer($realEstateId: Int!) {
    realEstate(where: { id: $realEstateId }) {
      id
      flyerUrl
      photos {
        id
        title
        thumbUrl
        fullUrl
        fileName
      }
    }
  }
`

export const CreateFlyer = gql`
  mutation CreateFlyer($data: OnePageRealEstateFlyerPdfInput!) {
    createOnePageRealEstateFlyerPdf(data: $data)
  }
`
