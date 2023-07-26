import { TourBanner, TourBannerQueryVariables, UpdateTourBannerMutation, UpdateTourBannerMutationVariables } from '#veewme/gen/graphqlTypes'
import { TourBanner as TourBannerQuery, UpdateTourBanner } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import Form, { FormValues } from './form'

interface EditTourBannerProps {
  bannerId: string
}

interface TourBannerData {
  tourBanner: TourBanner
}

const EditTourBanner: React.FunctionComponent<RouteComponentProps<EditTourBannerProps>> = props => {
  const bannerId = parseInt(props.match.params.bannerId, 10)

  const { addToast } = useToasts()

  const { loading: loadingQuery, data } = useQuery<TourBannerData, TourBannerQueryVariables>(TourBannerQuery,
    { variables: { id: bannerId } }
  )

  const [updateTourBanner, { loading: loadingMutation }] = useMutation<UpdateTourBannerMutation, UpdateTourBannerMutationVariables>(
    UpdateTourBanner,
    {
      onCompleted: result => {
        addToast(
          `Tour banner ${result.updateTourBanner.label} was updated successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
        props.history.push(`${privateUrls.tourBanners}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating the tour banner`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const handleSubmit = (id: TourBanner['id'], values: FormValues) => {
    updateTourBanner({
      variables: {
        ...values,
        color: {
          a: values.color.a,
          b: values.color.b,
          g: values.color.g,
          r: values.color.r
        },
        id
      }
    })
    .catch(e => log.debug(e.message))
  }

  const loading = loadingQuery || loadingMutation

  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      { data &&
        <Form
          heading='Edit Tour Banner'
          initialValues={{
            blackText: data.tourBanner.blackText,
            color: data.tourBanner.color,
            label: data.tourBanner.label
          }}
          onSubmit={values => handleSubmit(data.tourBanner.id, values)}
        />
      }
    </>
  )
}

export default withRouter(EditTourBanner)
