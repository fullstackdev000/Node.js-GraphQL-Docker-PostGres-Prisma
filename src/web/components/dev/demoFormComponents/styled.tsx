import styled from '../../../common/styled-components'

export const FieldWrapper = styled.div`
  flex: 1 0 auto;
  margin: 25px 0;

  input {
    flex: 1 0 auto;
  }

  > div {
    width: 100%;
  }
`

export const ColorFieldWrapper = styled(FieldWrapper) `
  min-width: 350px;
`

export const InlineFields = styled.div`
  display: flex;
  margin-bottom: 30px;
  margin-top: 10px;
  flex-wrap: wrap;

  ${FieldWrapper} {
    padding-right: 25px;
    max-width: 50%;

    &:last-child {
      padding-right: 0;
    }
  }
`

export const StyledHelpWrapper = styled.div `
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
`

// TODO: replace buttons with generic button component when it's ready
export const Button = styled.button`
  margin-right: 20px;
  padding: 6px 15px;
  border: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
  border-radius: 5px;
  color: ${props => props.theme.colors.GREEN};
  background-color: transparent;
  font-weight: 600;
  cursor: pointer;
  outline: 0 none;
  transition: border .5s, color .5s;

  &[disabled] {
    opacity: 0.6;
    transition: none;
  }

  &:hover {
    border: 2px solid ${props => props.theme.colors.BUTTON_BORDER_HOVER};
  }
`
export const ResetButton = styled(Button)`
  color: ${props => props.theme.colors.FIELD_TEXT};

  &:hover {
    border: 2px solid ${props => props.theme.colors.GREY};

    &[disabled] {
        border: 2px solid ${props => props.theme.colors.BUTTON_BORDER};
    }
  }
`

export const SectionTitle = styled.div`
  padding: 15px 0;
  font-size: 14px;
`
