import { Form } from 'formik'
import * as React from 'react'
import Button from '../../../common/buttons/basicButton'
import styled, { css } from '../../../common/styled-components'

const Page = css`
  display: grid;
  grid-row-gap: 50px;
  color: ${props => props.theme.colors.LABEL_TEXT};
  font-size: 12px;
  line-height: 16px;
`

export const AccountTypePage = styled.div`
  ${Page};
  grid-template-columns: repeat(3, auto);
  grid-column-gap: 10%;
`

export const AccountPage = styled.div`
  ${Page};
  grid-template-columns: repeat(1, auto);
`

export const AccountForm = styled(Form)`
  ${Page};
  grid-column-gap: 6%;
  grid-template-columns: repeat(2, 46%);
`

export const LogoContainer = styled.div`
  grid-column: 1/span 3;
  height: 50px;
  svg {
    display: block;
    margin: auto;
    height: 100%;
  }
`

export const PersonContainer = styled.div`
  grid-column: 1/span 3;
  text-align: center;
  font-size: 16px;
  p {
    margin-top: 15px;
  }
  img {
    opacity: 0.25;
  }
`

export const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 5px solid ${props => props.theme.colors.BORDER};
  margin: auto;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  & > svg {
    max-width: 60%;
    max-height: 50%;
    width: 100%;
    color: ${props => props.theme.colors.BORDER};
  }
`

export const AccountOptionWrapper = styled.div<{isSelected: boolean}>`
  cursor: pointer;
  text-align: justify;
  h5 {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    margin: 20px 0;
  }
  & > ${IconWrapper} {
    ${props => props.isSelected
      ? `
        box-shadow: 3px 4px 5px 0px rgba(0,0,0,0.25);
        & > svg {
          color: ${props.theme.colors.GREEN}
        }
      ` : ''
    }
  }
`

export const NextButton = styled(props => <Button {...props} />)`
  grid-column: 1/span 3;
  text-transform: uppercase;
`

export const AccountDetailsCaption = styled.div`
  grid-column: 1/span 3;
`

export const AccountDetailsDescriptionWrapper = styled.div`
  h6 {
    text-transform: uppercase;
    margin-bottom: 10px;
    font-weight: 400;
    font-size: 12px;
  }
  ul {
    list-style: unset;
    padding-left: 16px;
    line-height: 14px;
    li:not(:last-child) {
      margin-bottom: 5px;
    }
  }
`

export const AccountDetailsDescription = styled.div``

export const FormHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    text-transform: uppercase;
    font-weight: 400;
    font-size: 24px;
  }
  label {
    display: block;
    cursor: pointer;
  }
`

export const FormLeftColumn = styled.div`
  grid-column: 1;
  border: 1px solid ${props => props.theme.colors.BORDER};
  border-radius: 5px;
  padding: 15px 30px;
  h6 {
    border-bottom: 1px solid ${props => props.theme.colors.BORDER};
    font-size: 18px;
    font-weight: 400;
    padding: 10px 0;
  }
`

export const FormRightColumn = styled.div`
  grid-column: 2;
  font-size: 14px;
  line-height: 18px;
  p {
    margin-bottom: 15px;
  }
  h5 {
    font-size: 18px;
    font-weight: 400;
    margin: 15px 0;
  }
  h6 {
    font-size: 14px;
  }
  ul {
    margin: 15px 0;
    padding-left: 25px;
    list-style: initial;
    li {
      margin: 5px 0;
      padding-left: 10px;
    }
  }
`

export const FormGroup = styled.div`
  padding: 0 0 0 20px;
  margin: 10px 0 30px;
`

export const RequiredFieldsHint = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: -25px;
  font-size: 13px;

  &:after {
    content: '';
    display: inline-block;
    margin-left: 5px;
    width: 6px;
    height: 17px;
    background: ${props => props.theme.colors.ALERT};
    border-radius: 3px;
  }
`
