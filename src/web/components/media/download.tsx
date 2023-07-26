import MediaModal, { TabItems } from '#veewme/web/components/mediaAccess/modal'
import * as React from 'react'
import { useParams } from 'react-router-dom'

import { Download as DownloadIcon } from 'styled-icons/boxicons-regular'

interface DownloadProps {
  address: string
}

const Download: React.FunctionComponent<DownloadProps> = ({ address }) => {
  const { realEstateId: realEstateIdString } = useParams<{ realEstateId: string }>()
  const realEstateId = Number(realEstateIdString)
  const [modalOpen, toggleModal] = React.useState(false)

  return (
    <div>
       <span onClick={() => toggleModal(true)}>
        <DownloadIcon size='28'/>
      </span>
      <MediaModal
        isOpen={modalOpen}
        close={() => toggleModal(false)}
        title={address}
        currentTab={TabItems.Photos}
        realEstateId={realEstateId}
        visibleTabs={{}}
      />
    </div>
  )
}

export default React.memo(Download)
