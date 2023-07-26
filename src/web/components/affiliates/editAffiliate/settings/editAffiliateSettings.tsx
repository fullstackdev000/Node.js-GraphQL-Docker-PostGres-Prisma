import { AffiliateSettingsQueryVariables, UpdateAffiliateMutation, UpdateAffiliateMutationVariables } from '#veewme/gen/graphqlTypes'
import { AffiliateSettings as AffiliateAccountQuery, UpdateAffiliate } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { editAffiliateDefaultValues } from '../editAffiliateValues'
import { AffiliateAccountQueryResult } from '../queriesDataTypes'
import { AffiliateSettings } from '../types'
import AffiliateSettingsForm, { FormOptions } from './affiliateSettingsForm'

// import { prepareEditorValueForStorage } from '#veewme/lib/util'
// import { convertFromRaw, EditorState } from 'draft-js'

const initialValues = {
  ...editAffiliateDefaultValues
}
delete initialValues.areasCovered
delete initialValues.description

export const formEmptyOptions: FormOptions = {
  audioTrackOptions: [],
  regionOptions: []
}

type AffiliateData = NoNullableFields<AffiliateAccountQueryResult>
type EditSettingsVariables = Omit<UpdateAffiliateMutationVariables, 'phone'>
interface AffiliateQueryData {
  affiliate: AffiliateData
}

export interface AffiliateSettingsProps {
  accountEdit?: boolean
}

const AffiliateSettings: React.FunctionComponent<AffiliateSettingsProps> = props => {
  const { addToast } = useToasts()
  const { id } = useParams<{
    id: string
  }>()

  const history = useHistory()

  const { data, loading: loadingAffiliateAccount } = useQuery<AffiliateQueryData, AffiliateSettingsQueryVariables>(AffiliateAccountQuery, {
    onError: error => log.debug('Query Affiliate Account error:', error.message),
    variables: {
      id: Number(id)
    }
  })

  const [updateAffiliate, { client, loading: loadingUpdateAffiliate }] = useMutation<UpdateAffiliateMutation, EditSettingsVariables>(
    UpdateAffiliate,
    {
      onCompleted: result => {
        addToast(
          `Affiliate was updated successfully`,
          { appearance: 'success', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        props.accountEdit && client && client.writeData({ data: {
          me: {
            __typename: 'Account',
            firstName: result.updateAffiliate.user.firstName,
            lastName: result.updateAffiliate.user.lastName
          }
        }})
        history.push(`${privateUrls.panel}?allowRedirect`)
      },
      onError: error => {
        addToast(
          `Error ${error.message} while updating affiliate`,
          { appearance: 'error', autoDismiss: true, autoDismissTimeout: 10000 }
        )
        log.debug(error.message)
      }
    }
  )

  const handleSubmit = (newValues: AffiliateSettings) => {
    const valuesCopy = {
      ...newValues
    }
    delete valuesCopy.user

    updateAffiliate({ variables: valuesCopy })
      .catch(e => log.debug(e.message))
  }

  const loading = loadingAffiliateAccount || loadingUpdateAffiliate

  return (
    <>
      {loading &&
        <DotSpinnerModal
          isOpen={loading}
        />
      }
      {data &&
        <AffiliateSettingsForm
          name={`${data.affiliate.user.firstName} ${data.affiliate.user.lastName}`}
          initialValues={{
            ...initialValues,
            ...data.affiliate
          }}
          onSubmit={handleSubmit}
        />
    }
    </>
  )
}

export default AffiliateSettings
