import { CreateTourBanner } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { useMutation } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import Form, { FormValues } from './form'

const formInitialValues: FormValues = {
  blackText: false,
  color: {
    a: 1,
    b: 255,
    g: 166,
    r: 61
  },
  label: ''
}

const NewTourBanner: React.FunctionComponent<RouteComponentProps> = props => {
  const { addToast } = useToasts()

  const [createTourBanner, { loading }] = useMutation(
    CreateTourBanner,
    {
      onCompleted: result => {
        addToast(
          `Tour banner ${result.createTourBanner.label} was created successfully`,
          { appearance: 'success', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
        props.history.push(`${privateUrls.tourBanners}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while creating the tour banner`,
          { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }
        )
      }
    }
  )

  const handleSubmit = (values: FormValues) => {
    createTourBanner({
      variables: values
    })
    .catch(e => log.debug(e.message))
  }

  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      <Form
        heading='Add New Tour Banner'
        initialValues={formInitialValues}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default withRouter(NewTourBanner)
