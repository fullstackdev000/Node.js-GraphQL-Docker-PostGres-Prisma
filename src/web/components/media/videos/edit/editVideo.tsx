import { privateUrls } from '#veewme/lib/urls'
import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { VideoTypes } from '../../types'
import EditEmbedVideo from './editEmbedVideo'
import EditFauxVideo from './editFauxVideo'
import EditHostedVideo from './editHostedVideo'
import EditUrlVideo from './editUrlVideo'

interface RouteParams {
  type: VideoTypes
  realEstateId: string
}

const EditVideo: React.FunctionComponent = () => {
  const { realEstateId, type } = useParams<RouteParams>()
  const history = useHistory()
  // TODO add helper functions returning complete urls based on route path and params
  const redirectionUrl = `${privateUrls.realEstate}/${realEstateId}/media/video`

  let contentToShow: string | JSX.Element
  switch (type) {
    case 'URL':
      contentToShow = <EditUrlVideo onSuccess={() => history.push(redirectionUrl)}/>
      break
    case 'Faux':
      contentToShow = <EditFauxVideo onSuccess={() => history.push(redirectionUrl)}/>
      break
    case 'Embed':
      contentToShow = <EditEmbedVideo onSuccess={() => history.push(redirectionUrl)}/>
      break
    case 'Hosted':
      contentToShow = <EditHostedVideo onSuccess={() => history.push(redirectionUrl)}/>
      break
    default:
      contentToShow = <>Error: Such video type doesn't exist.</>
  }
  return (
    <>
      {contentToShow}
    </>
  )
}

export default EditVideo
