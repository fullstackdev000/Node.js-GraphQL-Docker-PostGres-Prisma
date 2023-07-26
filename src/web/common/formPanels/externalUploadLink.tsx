import { nameof } from '#veewme/lib/util'
import Panel from '#veewme/web/common/panel'
import * as React from 'react'
import { AffiliateSettings } from '../../components/affiliates/editAffiliate/types'

import { UsefulLink } from './usefulLinks'

interface ExternalUploadProps {
  link?: string
}

const ExternalUpload: React.FunctionComponent<ExternalUploadProps> = props => (
  <Panel
    heading='External Upload'
    id='external-link'
    toggleable
  >
    <UsefulLink
      name={`${nameof<AffiliateSettings>('externalUploadLink')}`}
      label='Link:'
      link={props.link || ''}
    />
  </Panel>
)

export default ExternalUpload
