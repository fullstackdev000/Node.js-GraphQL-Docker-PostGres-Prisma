import {
  DeletePhotosMutationVariables,
  MediaManagementPhotosQuery,
  MediaManagementPhotosQueryVariables,
  ReorderPhotosMutationVariables,
  UpdatePhotosMutationVariables,
  UploadRealEstatePhotoMutationVariables,
  UploadRealEstatePhotoProgressSubscription
} from '#veewme/gen/graphqlTypes'
import {
  DeletePhotos,
  MediaManagementPhotosQuery as PhotosQuery,
  ReorderPhotos,
  UpdatePhotos,
  UploadRealEstatePhoto,
  UploadRealEstatePhotoProgress
} from '#veewme/lib/graphql/queries/media'

// import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import PubSub from 'pubsub-js'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Photos, { subscriptionTopicName } from './photos'

export interface UploadProgressData {
  uploadRealEstatePhotoProgress: NoNullableFields<UploadRealEstatePhotoProgressSubscription['uploadRealEstatePhotoProgress']>
}

interface PhotosData {
  photos: NoNullableArrayItems<NoNullableFields<MediaManagementPhotosQuery['photos']>>
}

interface PhotosContainerProps {
  address?: string
}

const PhotosContainer: React.FunctionComponent<PhotosContainerProps> = ({ address = '' }) => {
  const { addToast } = useToasts()
  const { realEstateId: realEstateIdString } = useParams<{ realEstateId: string }>() // route params always are strings
  const realEstateId = Number(realEstateIdString)
  const { data, loading, refetch } = useQuery<PhotosData, MediaManagementPhotosQueryVariables>(PhotosQuery, {
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const [ uploadRealEstatePhoto ] = useMutation<{}, UploadRealEstatePhotoMutationVariables>(UploadRealEstatePhoto, {
    awaitRefetchQueries: true,
    refetchQueries: ['MediaManagementPhotos']
  })
  useSubscription<UploadProgressData>(UploadRealEstatePhotoProgress, {
    onSubscriptionData: options => {
      PubSub.publish(subscriptionTopicName, options.subscriptionData.data)
      // log.debug(options.subscriptionData.data)
    },
    variables: { realEstateId }
  })

  const [ deletePhotos, { loading: deletingPhotos }] = useMutation<{}, DeletePhotosMutationVariables>(DeletePhotos, {
    awaitRefetchQueries: true,
    refetchQueries: ['MediaManagementPhotos']
  })

  const [processedPhotos, setProcessedPhotos] = React.useState<number[]>([])
  /*
    It seems there is a bug in apollo: when sending one mutataion right after another
    the first mutatation refetches defined queries correctly but the second one doesn't send refetch request at all.
    That's why I've decided to use local react state to update UI correctly without need to send refetch requests.
    Fresh data is requested in case of update errors to sync front state and backend
  */
  const [ updatePhotos] = useMutation<{}, UpdatePhotosMutationVariables>(UpdatePhotos, {
    // awaitRefetchQueries: true,
    // refetchQueries: ['MediaManagementPhotos']
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  const [ reorderPhotos] = useMutation<{}, ReorderPhotosMutationVariables>(ReorderPhotos, {
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  return (
      <>
        <Photos
          photos={data && data.photos || []}
          uploadPhoto={variables => uploadRealEstatePhoto({ variables })}
          reorderPhotos={ids => reorderPhotos({ variables: { ids } })}
          address={address}
          realEstateId={realEstateId}
          deletePhotos={ids => deletePhotos({ variables: { ids } })}
          processedPhotos={processedPhotos}
          updatePhotos={async (ids, delta) => {
            setProcessedPhotos(prev => [...prev, ...ids])
            await updatePhotos({ variables: {
              ids,
              ...delta,
              featured: delta.star
            }})
            setProcessedPhotos(prev => prev.filter(prevId => !ids.includes(prevId)))
          }}
        />
        <DotSpinnerModal isOpen={loading || deletingPhotos} />
      </>
  )
}
export default PhotosContainer
