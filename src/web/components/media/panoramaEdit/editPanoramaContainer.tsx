import {
  PanoramaQuery,
  PanoramaQueryVariables,
  UpdatePanoramaMutationVariables
} from '#veewme/gen/graphqlTypes'
import { Panorama, UpdatePanorama } from '#veewme/lib/graphql/queries'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'

import { privateUrls } from '#veewme/lib/urls'
// import * as log from '#veewme/web/common/log'
import * as React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import PanoramaEdit from './panoramaEdit'
import { PanoramaData } from './panoramaEditor'

type PanoramaQueryData = NoNullableFields<PanoramaQuery>
interface RouteParams {
  panoramaId: string
  realEstateId: string
}

const EditPanorama: React.FunctionComponent<RouteComponentProps> = props => {
  const { panoramaId, realEstateId } = useParams<RouteParams>()
  const { addToast } = useToasts()
  const { data, loading } = useQuery<PanoramaQueryData, PanoramaQueryVariables>(Panorama, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    variables: {
      id: Number(panoramaId)
    }
  })

  const [editPanorama, { loading: upadating }] = useMutation<{}, UpdatePanoramaMutationVariables>(UpdatePanorama, {
    onCompleted: () => {
      addToast('Panorama has been edited successfully.', { appearance: 'success', autoDismiss: true , autoDismissTimeout: 10000 })
      const redirectUrl = `${privateUrls.realEstate}/${realEstateId}/media/panoramas`
      props.history.push(redirectUrl)
    },
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
  })

  return (
    <>
      {
        data && <PanoramaEdit
          panorama={data.panorama}
          onSubmit={(values: PanoramaData) => editPanorama({
            variables: {
              ...values,
              id: Number(panoramaId)
            }
          })}
        />
      }
      <DotSpinnerModal isOpen={loading || upadating} />
    </>
  )
}

export default EditPanorama
