import {
  TourQuery,
  TourQueryVariables
} from '#veewme/gen/graphqlTypes'
import { Tour as LoadTourQuery } from '#veewme/lib/graphql/queries'
import { tourDisablePreviewSuffix } from '#veewme/web/common/consts'
import { DotSpinnerModal } from '#veewme/web/common/spinners/dotSpinner'
import { NoNullableFields } from '#veewme/web/common/util'
import { useQuery } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

import * as log from '#veewme/web/common/log'
import { wrapLinkUrl } from '#veewme/web/common/util'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Layout2 from './layouts/layout2'
import MainLayout from './layouts/main'
import { Tour } from './types'

/**
 * TODO: mock values will be removed from initialData when given fields are integrated with backend
 *
 */
const initialData: Tour = {
  address: '',
  addressFull: {
    city: '',
    state: '',
    street: '',
    zip: ''
  },
  amenities: [],
  bannerPhotos: [],
  bannerType: 'SIMPLE',
  brochureUrl: 'http://www.africau.edu/images/default/sample.pdf',
  contactPerson: {
    company: 'Company ABC',
    faxNumber: '+123456789',
    mobile: '+123456789',
    name: 'John Doe',
    officeNumber: '+123456789',
    title: 'Senior Agent'
  },
  coordinates: {
    lat: 0,
    lng: 0
  },
  // TODO add preset values
  customBanner: {
    background: {
      a: 0.68,
      b: 16,
      g: 69,
      r: 236
    },
    text: 'Sold'
  },
  descriptionItems: [],
  documents: [],
  headerLogoUrl: '',
  headerRightComponent: 'Price',
  interactives: [],
  listingType: '',
  mainColor: {
    a: 0.9,
    b: 61,
    g: 204,
    r: 158
  },
  panoramas: [],
  photos: [],
  previewMode: true,
  price: '',
  rawPrice: 0,
  slideshowAudioSrc: '/public/static/audio/african-party.mp3',
  title: '',
  videos: [],
  visibleTabs: ['OVERVIEW'] // these tabs are always visible
}

const transformTourRawData = (data?: TourRawData) => {
  if (!data) {
    return initialData
  }
  const initialDataCopy = {
    ...initialData
  }
  const { tour: { mainColor, realEstate } } = data

  if (mainColor) {
    initialDataCopy.mainColor = mainColor
  }

  const profilePicture = realEstate.agentPrimary.affiliate.profilePicture
  const logoUrl = profilePicture && profilePicture.path
  if (logoUrl) {
    initialDataCopy.headerLogoUrl = logoUrl
  }
  initialDataCopy.address = realEstate.address
  initialDataCopy.addressFull = {
    city: realEstate.city,
    state: realEstate.state,
    street: realEstate.street,
    zip: realEstate.zip
  }
  initialDataCopy.descriptionText = data.tour.descriptionFull
  initialDataCopy.hideRealEstateHeadline = data.tour.hideRealEstateHeadline
  const currency = realEstate.currency || 'USD'
  const formattedPrice = new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency'
  })
  .format(realEstate.price)

  initialDataCopy.rawPrice = realEstate.price
  initialDataCopy.price = formattedPrice
  initialDataCopy.amenities = realEstate.amenities
  initialDataCopy.title = data.tour.realEstateHeadline
  initialDataCopy.listingType = realEstate.listingType

  const isCanadaAffiliate = realEstate.agentPrimary.affiliate.country === 'CA'

  initialDataCopy.descriptionItems = [{
    name: 'BEDS',
    value: isCanadaAffiliate ? `${realEstate.bedroomsAboveGrade} + ${realEstate.bedroomsBelowGrade}` : realEstate.bedrooms
  }, {
    name: 'BATHS/HALF',
    value: `${realEstate.fullBathrooms}/${realEstate.halfBathrooms}`
  }, {
    name: 'INTERIOR',
    value: realEstate.homeSize
  }, {
    name: 'GARAGES',
    value: realEstate.garages
  }, {
    name: 'YEAR',
    value: realEstate.yearBuilt
  }, {
    name: 'LOT',
    value: realEstate.lotSize
  }]
  initialDataCopy.bannerPhotos = data.tour.overviewPhotos

  initialDataCopy.contactPerson = {
    company: realEstate.agentPrimary.brokerage.companyName,
    email: realEstate.agentPrimary.user.email,
    facebookUrl: wrapLinkUrl(realEstate.agentPrimary.facebookLink),
    faxNumber: '+123456789',
    id:  realEstate.agentPrimary.id,
    instagramUrl:  wrapLinkUrl(realEstate.agentPrimary.instagramLink) ,
    linkedinUrl: wrapLinkUrl(realEstate.agentPrimary.linkedinLink),
    mobile: realEstate.agentPrimary.phoneMobile,
    name: `${realEstate.agentPrimary.user.firstName} ${realEstate.agentPrimary.user.lastName}`,
    officeNumber: realEstate.agentPrimary.phone,
    pinterestUrl:  wrapLinkUrl(realEstate.agentPrimary.pinterestLink),
    profilePictureUrl: realEstate.agentPrimary.profilePicture && realEstate.agentPrimary.profilePicture.path,
    profileUrl: realEstate.agentPrimary.profileUrl,
    title: realEstate.agentPrimary.title,
    twitterUrl:  wrapLinkUrl(realEstate.agentPrimary.twitterLink) ,
    websiteUrl: wrapLinkUrl(realEstate.agentPrimary.affiliate.website)
  }

  if (realEstate.agentCoListing) {
    initialDataCopy.contactPerson2 = {
      company: realEstate.agentCoListing.affiliate.companyName,
      email: realEstate.agentCoListing.user.email,
      facebookUrl: wrapLinkUrl(realEstate.agentCoListing.facebookLink),
      faxNumber: '+123456789',
      id:  realEstate.agentCoListing.id,
      instagramUrl:  wrapLinkUrl(realEstate.agentCoListing.instagramLink) ,
      linkedinUrl: wrapLinkUrl(realEstate.agentCoListing.linkedinLink),
      mobile: realEstate.agentCoListing.phoneMobile,
      name: `${realEstate.agentCoListing.user.firstName} ${realEstate.agentCoListing.user.lastName}`,
      officeNumber: realEstate.agentCoListing.phone,
      pinterestUrl:  wrapLinkUrl(realEstate.agentCoListing.pinterestLink),
      profilePictureUrl: realEstate.agentCoListing.profilePicture && realEstate.agentCoListing.profilePicture.path,
      profileUrl: realEstate.agentCoListing.profileUrl,
      title: realEstate.agentCoListing.title,
      twitterUrl:  wrapLinkUrl(realEstate.agentCoListing.twitterLink) ,
      websiteUrl: wrapLinkUrl(realEstate.agentCoListing.affiliate.website)
    }
  }

  initialDataCopy.photos = data.tour.photos
  initialDataCopy.documents = data.tour.realEstate.mediaDocuments
  initialDataCopy.interactives = data.tour.interactives
  initialDataCopy.panoramas = data.tour.panoramas
  initialDataCopy.videos = data.tour.videos.map<Tour['videos'][0]>(video => {
    if (video.type === 'Embed') {
      const { embeddedCode, id, label, theaterMode, type } = video
      return {
        embeddedCode,
        id,
        label,
        theaterMode,
        type
      }
    } else {
      const { id, label, theaterMode, posterFullUrl, type, url } = video
      return {
        id,
        label,
        posterUrl: posterFullUrl,
        theaterMode,
        type,
        url
      }
    }
  })

  // Set visible tabs
  if (data.tour.photos.length) {
    initialDataCopy.visibleTabs.push('PHOTOS')
  }
  if (data.tour.panoramas.length) {
    initialDataCopy.visibleTabs.push('PANORAMAS')
  }
  if (data.tour.videos.length) {
    initialDataCopy.visibleTabs.push('VIDEO')
  }
  if (data.tour.interactives.length) {
    initialDataCopy.visibleTabs.push('INTERACTIVES')
  }

  initialDataCopy.coordinates = {
    lat: data.tour.realEstate.customLatitude,
    lng: data.tour.realEstate.customLongitude
  }

  initialDataCopy.showMap = data.tour.realEstate.showOnMap
  const order = data.tour.realEstate.orders[0]
  initialDataCopy.previewMode = order.statuses.some(s => s === 'Unpublished')

  return initialDataCopy
}

interface LayoutComponentProps {
  tour: Tour
}

interface LayoutsMap {
  [id: string]: React.ComponentType<LayoutComponentProps>
}
const layoutComponents: LayoutsMap = {
  l1: MainLayout,
  l2: Layout2
}

type TourRawData = NoNullableFields<TourQuery>

interface RouteParams {
  layoutId: string
  tourId: string
}

interface TourContainerProps extends RouteComponentProps<RouteParams> {
}

const TourContainer: React.FunctionComponent<TourContainerProps> = props => {
  const { layoutId, tourId } = props.match.params
  const searchString = props.location.search // TODO: just temp for demo purpose
  log.debug(searchString)
  const LayoutComponent = layoutComponents[layoutId]
  const { addToast } = useToasts()

  const { data, loading } = useQuery<TourRawData, TourQueryVariables>(LoadTourQuery, {
    onError: e => addToast(e.message, { appearance: 'error', autoDismiss: true, pauseOnHover: true , autoDismissTimeout: 10000 }),
    variables: {
      id: Number(tourId)
    }
  })

  const tourData = React.useMemo(() => transformTourRawData(data), [data])
  if (searchString.indexOf(tourDisablePreviewSuffix) > -1) {
    tourData.previewMode = false // mutating object is ok in this case
  }

  React.useEffect(() => {
    document.title = tourData.address
  }, [tourData])

  // TODO just temp hack for demo purpose
  if (searchString === '?v1') {
    tourData.headerRightComponent = 'Price'
    tourData.mainColor = {
      a: 0.9,
      b: 61,
      g: 204,
      r: 158
    }
    tourData.bannerType = 'SIMPLE'
  }

  if (layoutId === 'l2') {
    tourData.headerRightComponent = 'Price'
    tourData.customBanner.background = {
      a: 0.6,
      b: 255,
      g: 166,
      r: 61
    }
    tourData.customBanner.text = 'Lake Front!'
  }

  if (searchString === '?v2') {
    tourData.bannerType = 'KENBURNS'
    tourData.headerRightComponent = 'Call'
    tourData.mainColor = {
      a: 0.9,
      b: 224,
      g: 134,
      r: 121
    }
    tourData.videos = tourData.videos.slice(0, 1)
  }

  if (searchString === '?v3') {
    tourData.headerRightComponent = 'Logo'
    tourData.mainColor = {
      a: 0.9,
      b: 224,
      g: 134,
      r: 200
    }
  }
  // End of demo code

  log.debug(layoutId, LayoutComponent)
  return (
    <>
      {!loading && <LayoutComponent tour={tourData} />}
      <DotSpinnerModal isOpen={loading} />
    </>
  )
}
export default TourContainer
