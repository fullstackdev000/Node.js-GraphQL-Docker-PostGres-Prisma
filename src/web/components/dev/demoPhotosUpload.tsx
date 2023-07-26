import {
  RealEstateForDemoPhotosUploadQuery,
  UploadRealEstatePhotoMutationVariables,
  UploadRealEstatePhotoProgressSubscription
} from '#veewme/gen/graphqlTypes'
import { RealEstateForDemoPhotosUpload } from '#veewme/lib/graphql/queries/demo'
import { UploadRealEstatePhoto, UploadRealEstatePhotoProgress } from '#veewme/lib/graphql/queries/media'
import Button from '#veewme/web/common/buttons/basicButton'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import * as React from 'react'
import * as Grid from '../../common/grid'
import Panel from '../../common/panel'

type UploadRealEstatePhotoProgressType = Omit<Exclude<
  UploadRealEstatePhotoProgressSubscription['uploadRealEstatePhotoProgress'],
  null
>, '__typename'>
type PhotosType = UploadRealEstatePhotoProgressType & { file: File }

interface PhotosUploadProcessListProps {
  photos: PhotosType[]
}

const PhotosUploadProcessList: React.FunctionComponent<PhotosUploadProcessListProps> = props => {
  return (
    <ul>
      {props.photos.map((p, idx) => {
        return (
          <li key={idx}>{p.file.name} - {p.progress}%</li>
        )
      })}
    </ul>
  )
}

const DemoPhotosUpload: React.FunctionComponent<{ realEstateId: number }> = props => {
  const [photos, setPhotos] = React.useState<PhotosType[]>([])
  const [
    uploadRealEstatePhoto,
    { error: mutationError }
  ] = useMutation<{}, UploadRealEstatePhotoMutationVariables>(UploadRealEstatePhoto)
  const { data: subscriptionData, error: subscriptionError } = useSubscription<{
    uploadRealEstatePhotoProgress: UploadRealEstatePhotoProgressType
  }>(UploadRealEstatePhotoProgress, { variables: { realEstateId: props.realEstateId } })

  log.debug(mutationError)
  log.debug(subscriptionError)

  React.useEffect(() => {
    const photosCopy: PhotosType[] = [ ...photos ]
    if (subscriptionData && subscriptionData.uploadRealEstatePhotoProgress) {
      const indexOfUpdatedPhoto = photosCopy.findIndex(p => p.photoIdentification === subscriptionData.uploadRealEstatePhotoProgress.photoIdentification)
      if (indexOfUpdatedPhoto >= 0) {
        photosCopy[indexOfUpdatedPhoto].progress = subscriptionData.uploadRealEstatePhotoProgress.progress
        setPhotos(photosCopy)
      }
    }
  }, [subscriptionData])

  return (
    <Grid.Wrapper>
      <Grid.Header>
        <h1>Demo Photos Upload</h1>
      </Grid.Header>
      <Grid.MainColumn centerColumn>
        <Panel>
          <input
            name='photos'
            type='file'
            accept='image/png, image/jpeg'
            onChange={event => {
              if (event.currentTarget && event.currentTarget.files) {
                const photosCopy: PhotosType[] = []
                Object.values(event.currentTarget.files).map((f, idx) => {
                  photosCopy.push({
                    file: f,
                    photoIdentification: `${idx}`,
                    progress: 0,
                    realEstateId: props.realEstateId
                  })
                })
                setPhotos(photosCopy)
              }
            }}
            multiple
          />
          <Button
            buttonTheme='action'
            full
            label='Submit files'
            onClick={() => {
              photos.map((p, idx) => {
                uploadRealEstatePhoto({ variables: {
                  file: p.file,
                  photoIdentification: p.photoIdentification,
                  realEstateId: props.realEstateId
                }}).catch(e => {
                  log.debug(e.message)
                })
              })
            }}
            disabled={!photos.length}
          />
          <PhotosUploadProcessList photos={photos} />
        </Panel>
      </Grid.MainColumn>
    </Grid.Wrapper>
  )
}

const DemoPhotosUploadWrapper: React.FunctionComponent = props => {
  const { data, loading } = useQuery<RealEstateForDemoPhotosUploadQuery>(RealEstateForDemoPhotosUpload)
  const realEstateId = data && data.realEstates && data.realEstates[0] && data.realEstates[0].id
  return (
    <>
      <DotSpinnerModal isOpen={loading} />
      {realEstateId && <DemoPhotosUpload realEstateId={realEstateId} />}
    </>
  )
}

export default DemoPhotosUploadWrapper
