import * as React from 'react'
import { useParams } from 'react-router-dom'
import { NavHashLink } from '../../../common/hashLink'
import SecondaryNavigation from '../../../common/secondaryNavigation'

import { privateUrls } from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'

const SettingsBtnHolder = styled.div`
  padding: 15px 0;
`

export const BrokerNavigation: React.FC = () => {
  const { brokerageId } = useParams()

  return (
    <>
      { /*
      <SecondaryNavigation>
        <li><NavHashLink to='#addBrokerage'>Brokerage</NavHashLink></li>
      </SecondaryNavigation>
      */}
      {brokerageId && (
        <SettingsBtnHolder>
          <Button
            label='Settings'
            full
            buttonTheme='action'
            to={`${privateUrls.accountSettings}/broker/${brokerageId}`}
          />
        </SettingsBtnHolder>
      )}
    </>
  )
}

export const BrokerSettingsNavigation: React.FC = () => {
  const { id } = useParams()

  return (
    <>
      <SecondaryNavigation>
        <li><NavHashLink to='#realEstateSiteMediaShowcase'>Property Site / Media Showcase</NavHashLink></li>
        <li><NavHashLink to='#photoDownloadPresets'>Photo Download Presets</NavHashLink></li>
        <li><NavHashLink to='#defaultColorScheme'>Color scheme</NavHashLink></li>
        <li><NavHashLink to='#realEstateFlyerLayout'>Property Flyer Layout</NavHashLink></li>
        <li><NavHashLink to='#syndication'>Syndication</NavHashLink></li>
      </SecondaryNavigation>
      <SettingsBtnHolder>
        <Button
          label='Profile'
          full
          buttonTheme='action'
          to={`${privateUrls.brokerages}/${id}`}
        />
      </SettingsBtnHolder>
    </>
  )
}
