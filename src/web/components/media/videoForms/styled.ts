import styled from '../../../common/styled-components'

export const StyledFooter = styled.footer<{ singleButton?: boolean }> `
  width: 100%;
  display: flex;
  justify-content: ${props => props.singleButton ? 'flex-end' : 'space-between'};
  align-items: center;
  border-top: 3px solid ${props => props.theme.colors.BORDER};
  margin-top: 40px;
  padding: 20px 0;
  font-weight: 600;
  font-size: 14px;
`

export const Hint = styled.div`
  padding: 10px 0 20px 0;
  font-size: 13px;
  color: ${props => props.theme.colors.LABEL_TEXT}
`

export const InfoWrapper = styled.span`
  color: ${props => props.theme.colors.GREEN};
`

export const EmbedCodeSection = styled.div`
  display: flex;
  padding-top: 20px;
  margin-top: 15px;
  border-top: qpx solid ${props => props.theme.colors.BORDER};

  & > div {
    flex: 1 0 auto;

    span {
      display: block;
      margin-bottom: 15px;
      font-size: 12px;
      color: ${props => props.theme.colors.LABEL_TEXT}
    }

    &:last-child {
      flex: 0 0 45%;
      padding-left: 25px;
      font-size: 13px;

      h5 {
        margin-bottom: 5px;
        font-weight: 400;
        font-size: 15px;
      }
    }
  }

  textarea {
    &::placeholder {
      width: 100%;
      line-height: 125px;
      text-align: center;
    }
  }

  @media (max-width: 850px) {
    display: block;

    & > div:last-child {
      padding-left: 0;
    }
  }
`

export const VideoDisableOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0
  right: 0;
  background: rgba(255, 255, 255, 0.2);
`
