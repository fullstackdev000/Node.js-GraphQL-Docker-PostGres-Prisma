import gql from 'graphql-tag'

export const TourBanner = gql`
  query TourBanner($id: Int!) {
    tourBanner(where: { id: $id }) {
      id
      color {
        a
        b
        g
        r
      }
      label
      blackText
    }
  }
`

export const TourBanners = gql`
  query TourBanners {
    tourBanners {
      id
      color {
        a
        b
        g
        r
      }
      label
      blackText
    }
  }
`

export const CreateTourBanner = gql`
  mutation CreateTourBanner(
    $label: String!
    $color: ColorCreateInput!
    $blackText: Boolean
  ) {
    createTourBanner(data: {
      color: $color
      label: $label
      blackText: $blackText
    }) {
      id
      label
    }
  }
`

export const UpdateTourBanner = gql`
  mutation UpdateTourBanner(
    $id: Int!
    $label: String!
    $color: ColorUpdateDataInput!
    $blackText: Boolean
  ) {
    updateTourBanner(
      data: {
        color: $color
        label: $label
        blackText: $blackText
      },
      where: {
        id: $id
      }
    ) {
      id
      label
    }
  }
`

export const DeleteTourBanner = gql`
  mutation DeleteTourBanner($id: Int!) {
    deleteTourBanner(where: { id: $id }) {
      id
      label
    }
  }
`

export const Tour = gql`
  query Tour($id: Int!) {
    tour(where: { id: $id }) {
      id
      descriptionShort
      descriptionFull
      realEstateHeadline
      hideRealEstateHeadline
      mainColor {
        id
        r
        g
        b
        a
      }
      overviewPhotos {
        id
        fullUrl
      }
      interactives {
        id
        label
        embeddedCode
        type
        theaterMode
        files {
          id
          label
          file {
            id
            path
          }
        }
      }
      photos {
        id
        thumbUrl
        fullUrl
        title
      }
      panoramas {
        id
        initialZoom
        initialVerticalAngle
        initialHorizontalAngle
        fullUrl
        hfov
        thumbUrl
        theaterMode
      }
      videos {
        id
        type
        url
        embeddedCode
        thumbUrl
        theaterMode
        label
        posterFullUrl
      }
      realEstate {
        customLatitude
        customLongitude
        showOnMap
        mediaDocuments {
          id
          label
          extension
          size
          downloadUrl
        }
        agentPrimary {
          id
          brokerage {
            id
            companyName
          }
          user {
            firstName
            lastName
            email
          }
          profileUrl
          facebookLink
          twitterLink
          linkedinLink
          instagramLink
          pinterestLink
          title
          phone
          phoneMobile
          profilePicture {
            path
          }
          affiliate {
            companyName
            country
            website
            profilePicture {
              path
            }
          }
        }
        agentCoListing {
          id
          user {
            firstName
            lastName
            email
          }
          profileUrl
          facebookLink
          twitterLink
          linkedinLink
          instagramLink
          pinterestLink
          title
          phone
          phoneMobile
          profilePicture {
            path
          }
          affiliate {
            companyName
            website
            profilePicture {
              path
            }
          }
        }
        address
        city
        state
        street
        zip
        price
        currency
        amenities
        bedrooms
        bedroomsAboveGrade
        bedroomsBelowGrade
        fullBathrooms
        halfBathrooms
        yearBuilt
        lotSize
        homeSize
        garages
        listingType
        orders {
          id
          statuses
        }
      }
    }
  }
`

export const ToursGallery = gql`
  query ToursGallery(
    $type: TourGalleryType
    $id: Int!
    $search: String
    $skip: Int
    $first: Int
    ) {
    tourGalleryConnection(
      where: { id: $id }
      type: $type
      search: $search
      first: $first
      skip: $skip
    ) {
      totalCount
      bannerUrl
      showSearchBar
      contact {
        id
        bio
        email
        name
        title
        description
        company
        mobile
        phone
        facebookUrl
        websiteUrl
        linkedinUrl
        twitterUrl
        instagramUrl
        pinterestUrl
        imageUrl
        logo
      }
      tours {
        id
        realEstate {
          id
          street
          city
          zip
          state
          bedrooms
          currency
          fullBathrooms
          halfBathrooms
          homeSize
          listingType
          photos {
            id
            thumbUrl
          },
          price
        }
      }
    }
  }
`
