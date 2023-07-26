import {
  DeletePanoramaMutationVariables,
  MediaManagementPanoramasQuery,
  MediaManagementPanoramasQueryVariables,
  ReorderPanoramasMutationVariables,
  UpdatePanoramaMutationVariables,
  UploadPanoramaMutationVariables,
  UploadRealEstatePhotoProgressSubscription
} from '#veewme/gen/graphqlTypes'
import { DeletePanorama, MediaManagementPanoramas, ReorderPanoramas, UpdatePanorama, UploadPanorama, UploadRealEstatePhotoProgress } from '#veewme/lib/graphql/queries'
import HideForRole from '#veewme/web/common/hideForRole'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoAccessFallback } from '#veewme/web/common/ui-helpers'
import { NoNullableArrayItems, NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

// import * as log from '#veewme/web/common/log'
import PubSub from 'pubsub-js'
import * as React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import Panoramas from './panoramas'
import { subscriptionTopicName } from './panoramasUploader'

export interface UploadProgressData {
  uploadRealEstatePhotoProgress: NoNullableFields<UploadRealEstatePhotoProgressSubscription['uploadRealEstatePhotoProgress']>
}

interface PanoramasData {
  panoramas: NoNullableArrayItems<NoNullableFields<MediaManagementPanoramasQuery['panoramas']>>
}

interface RouteParams {
  realEstateId: string
}

const PanoramasContainer: React.FunctionComponent<RouteComponentProps> = props => {
  const { realEstateId } = useParams<RouteParams>()
  const { addToast } = useToasts()
  const [processedPanoramas, setProcessedPanoramas] = React.useState<number[]>([])
  const { data, loading, refetch } = useQuery<PanoramasData, MediaManagementPanoramasQueryVariables>(MediaManagementPanoramas, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const [ updatePanorama ] = useMutation<{}, UpdatePanoramaMutationVariables>(UpdatePanorama, {
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  const [ reorderPanoramas] = useMutation<{}, ReorderPanoramasMutationVariables>(ReorderPanoramas, {
    onError: error => {
      refetch().catch(e => null)
      addToast(error.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 })
    }
  })

  const [ uploadPanorama ] = useMutation<{}, UploadPanoramaMutationVariables>(UploadPanorama, {
    awaitRefetchQueries: true,
    refetchQueries: ['MediaManagementPanoramas']
  })

  useSubscription<UploadProgressData>(UploadRealEstatePhotoProgress, {
    onSubscriptionData: options => {
      PubSub.publish(subscriptionTopicName, options.subscriptionData.data)
    },
    variables: { realEstateId: Number(realEstateId) }
  })

  const [ deletePanorama, { loading: deleting } ] = useMutation<{}, DeletePanoramaMutationVariables>(DeletePanorama, {
    awaitRefetchQueries: true,
    refetchQueries: ['MediaManagementPanoramas']
  })

  return (
    <>
      <Panoramas
        panoramas={data && data.panoramas || []}
        processedPanoramas={processedPanoramas}
        realEstateId={Number(realEstateId)}
        reorderPanoramas={ids => reorderPanoramas({ variables: { ids } })}
        uploadPanorama={variables => uploadPanorama({ variables })}
        deletePanorama={id => deletePanorama({ variables: { id } })}
        updatePanorama={async (id, delta) => {
          setProcessedPanoramas(prev => [...prev, id])
          await updatePanorama({ variables: {
            id,
            ...delta
          }})
          setProcessedPanoramas(prev => prev.filter(prevId => id !== prevId))
        }}
      />
      <DotSpinnerModal isOpen={loading || deleting} />
    </>
  )
}

const PanoramasAuth: React.FC<RouteComponentProps> = props => {
  return (
    <HideForRole
      action='hide'
      roles={['AGENT']}
      fallback={<NoAccessFallback />}
    >
      <PanoramasContainer {...props} />
    </HideForRole>
  )
}

export default PanoramasAuth
