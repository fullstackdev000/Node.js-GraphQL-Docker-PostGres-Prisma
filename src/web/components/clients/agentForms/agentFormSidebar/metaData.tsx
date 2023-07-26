import { privateUrls } from '#veewme/lib/urls'
import Button from '#veewme/web/common/buttons/basicButton'
import styled from '#veewme/web/common/styled-components'
import { format } from 'date-fns'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import * as Meta from '../../../../common/metaData'

const SettingsBtnHolder = styled.div`
  padding: 0 15px;
  margin-top: -10px;
`
interface MetaDataProps {
  id?: number
  showSettingsBtn?: boolean
  showProfileButton?: boolean
  lastLogIn: string
  joinDate: string
  userName: string
}

const MetaData: React.FC<MetaDataProps> = props => {
  const { agentId } = useParams()
  const id = agentId || props.id

  return (
    <>
      <Meta.Container>
         <li>
          <Meta.Label>Date Joined:</Meta.Label>
          <Meta.Data>{format(props.joinDate,'MM/DD/YYYY | hh:mm a')}</Meta.Data>
        </li>
        {props.lastLogIn && (
          <li>
            <Meta.Label>Last Login:</Meta.Label>
            <Meta.Data>{format(props.lastLogIn,'MM/DD/YYYY | hh:mm a')}</Meta.Data>
          </li>
        )}
        <li>
          <Meta.Label>Username:</Meta.Label>
          <Meta.Data>{props.userName}</Meta.Data>
        </li>
      </Meta.Container>
      {
        props.showSettingsBtn && id && (
          <SettingsBtnHolder>
            <Button
              label='Settings'
              full
              buttonTheme='action'
              to={`${privateUrls.accountSettings}/agent/${id}`}
            />
          </SettingsBtnHolder>
        )
      }
      {
        props.showProfileButton && id && (
          <SettingsBtnHolder>
            <Button
              label='Profile'
              full
              buttonTheme='action'
              to={`${privateUrls.agent}/${id}`}
            />
          </SettingsBtnHolder>
        )
      }
    </>
  )
}

export default MetaData
