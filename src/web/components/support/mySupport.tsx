import {
  MySupportQuery,
  MySupportQueryVariables,
  UpdateSupportMutation,
  UpdateSupportMutationVariables
} from '#veewme/gen/graphqlTypes'
import { MySupport, UpdateSupport } from '#veewme/lib/graphql/queries'

import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'

import { privateUrls } from '#veewme/lib/urls'
import { nameof } from '#veewme/lib/util'
import Editor from '#veewme/web/common/formikFields/wysiwygEditor'
import * as Grid from '#veewme/web/common/grid'
import * as log from '#veewme/web/common/log'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import { convertFromRaw, EditorState } from 'draft-js'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'

import { prepareEditorValueForStorage } from '#veewme/lib/util'

const Heading = styled(Grid.Heading)`
  [type='submit'] {
    display: none;
  }
`
type SupportData = NoNullableFields<MySupportQuery>

interface MySupport {
  supportAgent: SupportData['affiliate']['supportAgent']
  supportPhotographer: SupportData['affiliate']['supportPhotographer']
  supportProcessor: SupportData['affiliate']['supportProcessor']
}

interface CustomProps {
  data: MySupport
  onSubmit: (values: MySupport) => void
}

export type FormValues = MySupport

type MySupportPageProps = FormikProps<FormValues> & CustomProps

const MySupportPage: React.FC<MySupportPageProps> = props => {
  return (
    <>
      <Grid.Wrapper as={Form} >
        <Heading>
          <h1>My Support page</h1>
        </Heading>
        <Grid.MainColumn>
          <Panel heading='Agent support'>
            <Field name={nameof<FormValues>('supportAgent')} component={Editor}/>
          </Panel>
          <Panel heading='Photographer support'>
            <Field name={nameof<FormValues>('supportPhotographer')} component={Editor}/>
          </Panel>
          <Panel heading='Processor support'>
            <Field name={nameof<FormValues>('supportProcessor')} component={Editor}/>
          </Panel>
        </Grid.MainColumn>
        <Grid.Footer />
      </Grid.Wrapper>
    </>
  )
}

const initialData: FormValues = {
  supportAgent: EditorState.createEmpty(),
  supportPhotographer: EditorState.createEmpty(),
  supportProcessor: EditorState.createEmpty()
}

const MySupportFormik = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: ({ data }) => ({
    ...initialData,
    supportAgent: data.supportAgent ? EditorState.createWithContent(convertFromRaw(data.supportAgent)) : EditorState.createEmpty(),
    supportPhotographer: data.supportPhotographer ? EditorState.createWithContent(convertFromRaw(data.supportPhotographer)) : EditorState.createEmpty(),
    supportProcessor: data.supportProcessor ? EditorState.createWithContent(convertFromRaw(data.supportProcessor)) : EditorState.createEmpty()
  })
})(MySupportPage)

const Container = () => {
  const { id } = useParams<{
    id: string
  }>()
  const history = useHistory()

  const { addToast } = useToasts()

  const { data, loading } = useQuery<SupportData, MySupportQueryVariables>(MySupport, {
    onError: error => log.debug('Query Affiliate Account error:', error.message),
    variables: {
      id: Number(id)
    }
  })

  const [updateSupport, { loading: updateLoading }] = useMutation<UpdateSupportMutation, UpdateSupportMutationVariables>(
    UpdateSupport,
    {
      onCompleted: () => {
        addToast(
          `Support page was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2500 }
        )
        history.push(`${privateUrls.panel}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating Support`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        log.debug(error.message)
      }
    }
  )
  const waiting = loading || updateLoading
  if (waiting) {
    return (
      <DotSpinnerModal
        isOpen
      />
    )
  }

  return data ? (
    <MySupportFormik
      onSubmit={vals => {
        const variables = {
          id: Number(id),
          supportAgent: prepareEditorValueForStorage(vals.supportAgent),
          supportPhotographer: prepareEditorValueForStorage(vals.supportPhotographer),
          supportProcessor: prepareEditorValueForStorage(vals.supportProcessor)
        }
        updateSupport({ variables }).catch(e => log.debug(e))
      }}
      data={data.affiliate}
    />
  ) : null
}

export default Container
