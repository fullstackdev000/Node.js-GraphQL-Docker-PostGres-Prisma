import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

const EmbeddedStyled = styled.div`
  overflow: hidden;
  position: relative;
  background: ${props => props.theme.colors.LIGHT_BLUISH_GREY};

  &::after {
    padding-top: 56.25%;
    display: block;
    content: '';
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const EmbeddedWrapperStyled = styled.div`
  margin: 30px 0;
`
interface EmbeddedviewerProps {
  code: string
}

const Embeddedviewer: React.FunctionComponent<EmbeddedviewerProps> = ({
  code
}) => (
  <EmbeddedWrapperStyled>
    <EmbeddedStyled
      dangerouslySetInnerHTML={{ __html: code }}
    />
  </EmbeddedWrapperStyled>
)

export default Embeddedviewer
