import styled from '#veewme/web/common/styled-components'
import React, { FunctionComponent } from 'react'
import { TourContext } from '..'
import { Tour } from '../../../types'
import DocumentsModal from '../../common/documents'
import { Container } from '../styled'
import MapSection from './map'

import Document from '#veewme/web/assets/svg/document.svg'
import Flyer from '#veewme/web/assets/svg/flyer.svg'
import Map from '#veewme/web/assets/svg/map.svg'

const Wrapper = styled(Container)<{ mainColor: string }>`
  padding: 30px 0;
  display: flex;
  justify-content: center;

  svg {
    fill: ${props => props.mainColor};
  }
`

const IconBox = styled.div`
  width: 95px;
  margin: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  span {
    display: block;
    text-align: center;
    font-family: 'American Typewriter', sans-serif;
    font-size: 18px;
    font-weight: 700;
  }
`

interface AdditionalSectionProps {
  tour: Tour
}

const AdditionalSection: FunctionComponent<AdditionalSectionProps> = ({ tour }) => {
  const mainColor = React.useContext(TourContext).mainColor
  const [documentsModalVisible, toggleDocumentsModal] = React.useState(false)
  const [mapVisible, toggleMap] = React.useState(false)
  const documentsCount = tour.documents.length

  return (
    <>
      <Wrapper mainColor={mainColor} id='additional'>
        {
          documentsCount > 0 && (
            <IconBox onClick={() => toggleDocumentsModal(true)}>
              <Document width='90' height='90' />
              <span>Digital GLA</span>
            </IconBox>
          )
        }
        {
          tour.showMap && (
            <IconBox onClick={() => toggleMap(prev => !prev)}>
              <Map width='90' height='90' />
              <span>Map</span>
            </IconBox>
          )
        }
        <IconBox>
          <Flyer width='90' height='90' />
          <span>Property Flyer</span>
        </IconBox>
      </Wrapper>
      {mapVisible && <MapSection tour={tour} />}
      <DocumentsModal
        toggleModal={() => toggleDocumentsModal(false)}
        modalVisible={documentsModalVisible}
        tour={tour}
      />
    </>
  )
}
export default AdditionalSection
