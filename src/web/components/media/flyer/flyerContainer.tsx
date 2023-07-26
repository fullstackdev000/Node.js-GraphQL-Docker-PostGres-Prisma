import {
  CreateFlyerMutationVariables,
  FlyerQuery,
  FlyerQueryVariables
} from '#veewme/gen/graphqlTypes'
import {
  CreateFlyer,
  Flyer as LoadFlyerData
} from '#veewme/lib/graphql/queries/media'

// import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Flyer from './flyer'

type FlyerData = NoNullableFields<FlyerQuery>
interface FlyerContainerProps {
}

const FlyerContainer: React.FunctionComponent<FlyerContainerProps> = () => {
  const { addToast } = useToasts()
  const { realEstateId: realEstateIdString } = useParams<{ realEstateId: string }>() // route params always are strings
  const realEstateId = Number(realEstateIdString)
  const { data, loading } = useQuery<FlyerData, FlyerQueryVariables>(LoadFlyerData, {
    variables: {
      realEstateId: Number(realEstateId)
    }
  })

  const [ createFlyer, { loading: creatingFlyer } ] = useMutation<{}, CreateFlyerMutationVariables>(CreateFlyer, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      addToast('Congratulations. Flyer has been created.', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 })
    },
    onError: error => {
      addToast(error.message, { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 })
    },
    refetchQueries: ['Flyer']
  })

  return (
      <>
        {data && (
          <Flyer
            photos={data.realEstate.photos || []}
            flyerUrl={data.realEstate.flyerUrl}
            onCreateFlyer={ids => {
              createFlyer({ variables: {
                data: {
                  bigImgId: ids[0],
                  coverImgId: ids[1],
                  firstSideImgId: ids[2],
                  realEstateId,
                  secondSideImgId: ids[3]
                }}}).catch(e => null)
            }}
          />
        )}
        <DotSpinnerModal isOpen={loading || creatingFlyer} />
      </>
  )
}
export default FlyerContainer
