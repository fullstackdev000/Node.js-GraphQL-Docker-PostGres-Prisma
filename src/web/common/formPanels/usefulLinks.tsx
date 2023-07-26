import { nameof } from '#veewme/lib/util'
import Button from '#veewme/web/common/buttons/basicButton'
import InputField from '#veewme/web/common/formikFields/inputField'
import Panel from '#veewme/web/common/panel'
import styled from '#veewme/web/common/styled-components'
import copy from 'copy-to-clipboard'
import { Field } from 'formik'
import prependHttp from 'prepend-http'
import * as React from 'react'
import { EditAffiliateValues, UsefulLinksValues } from '../../components/affiliates/editAffiliate/types'

const StyledWrapper = styled.div `
  display: flex;
  align-items: flex-end;
  & > :first-child {
    flex: 1;
  }
  & > :nth-child(2) {
    margin: 0 4px 15px;
  }
  & > :last-child {
    margin-bottom: 15px;
  }
  input {width: 100%;}
`

interface UsefulLinkProps {
  name: string
  label: string
  link: string
}

export const UsefulLink: React.FunctionComponent<UsefulLinkProps> = props => (
  <StyledWrapper>
    <Field
      label={props.label}
      name={props.name}
      component={InputField}
    />
    <Button
      label='View'
      buttonTheme='action'
      href={encodeURI(prependHttp(props.link))}
      target='_blank'
    />
    <Button
      label='Copy'
      buttonTheme='action'
      onClick={() => copy(encodeURI(prependHttp(props.link)))}
    />
  </StyledWrapper>
)

interface UsefulLinksProps {
  values: UsefulLinksValues
}

const UsefulLinks: React.FunctionComponent<UsefulLinksProps> = props => (
  <Panel
    heading='Useful Links'
    id='links'
    toggleable
  >
    <UsefulLink
      name={`${nameof<EditAffiliateValues>('realEstateSiteLink')}`}
      label='Property Site / Media Showcase link:'
      link={props.values.realEstateSiteLink}
    />
    <UsefulLink
      name={`${nameof<EditAffiliateValues>('loginLink')}`}
      label='Login link:'
      link={props.values.loginLink}
    />
    <UsefulLink
      name={`${nameof<EditAffiliateValues>('signupLink')}`}
      label='Sign up link:'
      link={props.values.signupLink}
    />
  </Panel>
)

export default UsefulLinks
