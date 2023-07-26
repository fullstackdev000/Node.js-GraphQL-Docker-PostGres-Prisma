import { UnreachableCaseError } from '#veewme/lib/error'
import * as React from 'react'
import { VideoTypes } from '../types'
import AddEmbedVideo from './addEmbedVideo'
import AddFauxVideo from './addFauxVideo'
import AddHostedVideo from './addHostedVideo'
import AddUrlVideo from './addUrlVideo'

interface Step2Props {
  selectedType: VideoTypes
  onSubmitSuccess: () => void
  realEstateId: number
}

// Just temp version of component.
class Step2 extends React.PureComponent<Step2Props> {
  render () {
    const { selectedType, onSubmitSuccess, realEstateId } = this.props
    const formProps = {
      onSubmitSuccess,
      realEstateId
    }
    // TODO: chose component to render (string -> JSX.Element)
    let contentToShow: string | JSX.Element
    switch (selectedType) {
      case 'URL':
        contentToShow = <AddUrlVideo {...formProps} />
        break
      case 'Faux':
        contentToShow = <AddFauxVideo {...formProps} />
        break
      case 'Embed':
        contentToShow = <AddEmbedVideo {...formProps} />
        break
      case 'Hosted':
        contentToShow = <AddHostedVideo {...formProps} />
        break
      default:
        throw new UnreachableCaseError(selectedType)
    }
    return (
      <>
        {contentToShow}
      </>
    )
  }
}

export default Step2
