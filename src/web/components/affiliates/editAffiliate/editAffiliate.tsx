import { Affiliate, AffiliateAccountQueryVariables, UpdateAffiliateMutation, UpdateAffiliateMutationVariables } from '#veewme/gen/graphqlTypes'
import { AffiliateAccount as AffiliateAccountQuery, UpdateAffiliate } from '#veewme/lib/graphql/queries'
import { privateUrls } from '#veewme/lib/urls'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useMutation, useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import EditAffiliateForm, { FormOptions } from './editAffiliateForm'
import { editAffiliateDefaultValues } from './editAffiliateValues'
import { AffiliateAccountQueryResult } from './queriesDataTypes'
import { EditAffiliateValues } from './types'

import { prepareEditorValueForStorage } from '#veewme/lib/util'
import { convertFromRaw, EditorState } from 'draft-js'

export const formEmptyOptions: FormOptions = {
  audioTrackOptions: [],
  regionOptions: []
}

type AffiliateData = NoNullableFields<AffiliateAccountQueryResult>
interface AffiliateQueryData {
  affiliate: AffiliateData
}

export const useInitializeAffiliateForm = (affiliate?: AffiliateData): EditAffiliateValues => {
  const data = React.useMemo(() => {
    if (affiliate) {
      return {
        ...editAffiliateDefaultValues,
        ...affiliate,
        // TODO remove when added to the backend
        areasCovered: affiliate.areasCovered ? EditorState.createWithContent(convertFromRaw(affiliate.areasCovered)) : EditorState.createEmpty(),
        billingFrequency: editAffiliateDefaultValues.billingFrequency,
        description: affiliate.description ? EditorState.createWithContent(convertFromRaw(affiliate.description)) : EditorState.createEmpty(),
        // TODO remove when logo added on the backend
        logo: '',
        socialMedia: {
          facebookLink: affiliate.facebookLink,
          instagramLink: affiliate.instagramLink,
          linkedinLink: affiliate.linkedinLink,
          pinterestLink: affiliate.pinterestLink,
          twitterLink: affiliate.twitterLink
        }
      }
    } else {
      return editAffiliateDefaultValues
    }
  }, [affiliate])

  return data
}

export interface EditAffiliateProps {
  affiliateId: Affiliate['id']
  accountEdit?: boolean
}

const EditAffiliate: React.FunctionComponent<RouteComponentProps & EditAffiliateProps> = props => {
  const { addToast } = useToasts()

  const { data, loading: loadingAffiliateAccount } = useQuery<AffiliateQueryData, AffiliateAccountQueryVariables>(AffiliateAccountQuery, {
    onError: error => log.debug('Query Affiliate Account error:', error.message),
    variables: {
      id: props.affiliateId
    }
  })

  const initialFormValues = useInitializeAffiliateForm(data && data.affiliate)

  const [updateAffiliate, { client, loading: loadingUpdateAffiliate }] = useMutation<UpdateAffiliateMutation, UpdateAffiliateMutationVariables>(
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
        props.history.push(`${privateUrls.panel}?allowRedirect`)
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

  const handleSubmit = (newValues: EditAffiliateValues) => {
    const userCoreData = {
      ...newValues.user
    }
    delete userCoreData.lastLogIn
    delete userCoreData.joinDate

    updateAffiliate({
      variables: {
        ...newValues,
        areasCovered: prepareEditorValueForStorage(newValues.areasCovered),
        description: prepareEditorValueForStorage(newValues.description),
        user: {
          ...userCoreData
        }
      }
    })
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
        <EditAffiliateForm
          name={`${data.affiliate.user.firstName} ${data.affiliate.user.lastName}`}
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
        />
    }
    </>
  )
}

export default withRouter(EditAffiliate)
