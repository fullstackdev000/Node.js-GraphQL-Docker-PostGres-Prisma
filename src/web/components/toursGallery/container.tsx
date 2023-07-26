import {
  ToursGalleryQuery,
  ToursGalleryQueryVariables
} from '#veewme/gen/graphqlTypes'
import { ToursGallery } from '#veewme/lib/graphql/queries'
import * as log from '#veewme/web/common/log'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'
import { NetworkStatus } from 'apollo-client'

import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import Main from './galleryLayout'
import { Gallery } from './types'

/* tslint:disable:object-literal-sort-keys */
const initialData: Gallery = {
  bannerUrl: '',
  contact: {
    logo: '',
    email: '',
    company: '',
    imageUrl: '',
    mobile: '',
    name: '',
    phone: '',
    title: '',
    facebookUrl: '',
    websiteUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    pinterestUrl: ''
  }
}
/* tslint:enable:object-literal-sort-keys */

const perPaginationPage = 16

type GalleryData = NoNullableFields<ToursGalleryQuery>

const GalleryContainer: FunctionComponent = props => {
  const { id, type } = useParams()
  const galleryType = type.toUpperCase() as ToursGalleryQueryVariables['type']
  const { data, loading, networkStatus, refetch } = useQuery<GalleryData, ToursGalleryQueryVariables>(ToursGallery, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: perPaginationPage,
      id: Number(id),
      type: galleryType
    }
  })

  const gallery = data && data.tourGalleryConnection
  const totalCount = (data && data.tourGalleryConnection.totalCount) || 0
  const pageCount = Math.ceil(totalCount / perPaginationPage)
  const showSearchBar = gallery && gallery.showSearchBar

  return (
    <>
      {/* There is an apollo bug: when refetching `networkStatus` is not always correctly set to `NetworkStatus.refetching` value*/}
      <Main
        pageCount={pageCount}
        refetching={(networkStatus !== NetworkStatus.loading) && loading}
        data={gallery || initialData}
        onSearch={searchQuery => refetch({
          id: Number(id),
          search: searchQuery,
          skip: 0
        })}
        showSearchBar={showSearchBar}
        onPageChange={page => {
          const skip = page * perPaginationPage
          refetch({
            first: perPaginationPage,
            id: Number(id),
            skip
          }).catch(e => log.debug(e))
        }}
      />
      <DotSpinnerModal isOpen={networkStatus === NetworkStatus.loading} />
    </>
  )
}
export default GalleryContainer
